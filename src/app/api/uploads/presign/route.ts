import { getServerSession } from 'next-auth';
import { authOptions, isGoogleAuthReady } from '@/lib/auth/options';
import { features } from '@/lib/config/features';
import { getRateLimitStore, putMediaRecord } from '@/lib/aws/dynamodb';
import { buildUploadKeys, createPresignedPutUrl } from '@/lib/aws/s3';
import { isAwsConfigured } from '@/lib/config/env';
import { getClientIp, getOrCreateUploadSessionId } from '@/lib/http/request';
import { jsonError, jsonOk } from '@/lib/http/response';
import { MemoryRateLimitStore, consumeUploadQuota } from '@/lib/uploads/rate-limit';
import type { MediaRecord, PresignRequestBody, PresignResponseBody, PresignUpload } from '@/lib/uploads/types';
import { validateCaption, validateEvent, validateFileBatch, validateGuestName } from '@/lib/uploads/validate';

export const runtime = 'nodejs';

const memoryRateLimitStore = new MemoryRateLimitStore();

export async function POST(request: Request) {
  if (!features.upload) {
    return jsonError('Uploads are currently closed. Please enjoy the gallery instead.', 403);
  }

  if (isGoogleAuthReady()) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return jsonError('Please sign in with Google to upload memories.', 401);
    }
  }

  let body: PresignRequestBody;
  try {
    body = (await request.json()) as PresignRequestBody;
  } catch {
    return jsonError('We could not read that upload request. Please try again.', 400);
  }

  const guestName = body.guestName?.trim() ?? '';
  const nameResult = validateGuestName(guestName);
  if (!nameResult.ok) {
    return jsonError(nameResult.message, 400);
  }

  const captionResult = validateCaption(body.caption);
  if (!captionResult.ok) {
    return jsonError(captionResult.message, 400);
  }

  const eventResult = validateEvent(body.event);
  if (!eventResult.ok) {
    return jsonError(eventResult.message, 400);
  }

  const files = Array.isArray(body.files) ? body.files : [];
  const batchResult = validateFileBatch(files);
  if (!batchResult.ok) {
    return jsonError(batchResult.message, 400);
  }

  if (!isAwsConfigured()) {
    return jsonError('Photo storage is being prepared. Please try again a little later.', 503);
  }

  const { sessionId, setCookie } = getOrCreateUploadSessionId(request);
  const store = getRateLimitStore() ?? memoryRateLimitStore;
  const quota = await consumeUploadQuota(store, {
    ip: getClientIp(request),
    sessionId,
    fileCount: files.length,
    totalBytes: files.reduce((sum, file) => sum + file.size, 0),
  });

  if (!quota.allowed) {
    return jsonError(quota.message ?? 'Please wait a moment before uploading again.', 429, {
      retryAfterSeconds: quota.retryAfterSeconds ?? 60,
    });
  }

  const createdAt = new Date();
  const uploads: PresignUpload[] = [];

  for (const file of files) {
    const id = crypto.randomUUID();
    const thumbContentType = file.hasThumbnail ? 'image/jpeg' : undefined;
    const keys = buildUploadKeys({
      id,
      fileName: file.fileName,
      kind: file.kind,
      createdAt,
      hasThumbnail: file.hasThumbnail,
    });

    const url = await createPresignedPutUrl(keys.key, file.contentType);
    const thumbUrl = keys.thumbKey && thumbContentType
      ? await createPresignedPutUrl(keys.thumbKey, thumbContentType)
      : undefined;

    const record: MediaRecord = {
      id,
      source: 'guest',
      status: 'pending',
      key: keys.key,
      thumbKey: keys.thumbKey,
      contentType: file.contentType,
      size: file.size,
      kind: file.kind,
      guestName,
      caption: body.caption?.trim() || undefined,
      event: body.event,
      createdAt: createdAt.toISOString(),
    };

    try {
      await putMediaRecord(record);
    } catch {
      return jsonError('We could not start this upload just now. Please try again in a moment.', 503);
    }

    uploads.push({
      id,
      key: keys.key,
      url,
      contentType: file.contentType,
      thumbKey: keys.thumbKey,
      thumbUrl,
      thumbContentType,
    });
  }

  const response: PresignResponseBody = { sessionId, uploads };
  const headers: HeadersInit = {};
  if (setCookie) {
    headers['Set-Cookie'] = setCookie;
  }

  return jsonOk(response, { headers });
}
