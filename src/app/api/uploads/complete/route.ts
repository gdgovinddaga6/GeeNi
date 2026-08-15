import { getServerSession } from 'next-auth';
import { authOptions, isGoogleAuthReady } from '@/lib/auth/options';
import { getMediaRecord, publishMediaRecord } from '@/lib/aws/dynamodb';
import { getUploadsPrefix, objectExists } from '@/lib/aws/s3';
import { features } from '@/lib/config/features';
import { isAwsConfigured } from '@/lib/config/env';
import { jsonError, jsonOk } from '@/lib/http/response';
import type { CompleteRequestBody } from '@/lib/uploads/types';
import {
  isOwnedUploadKey,
  validateCaption,
  validateEvent,
  validateGuestName,
} from '@/lib/uploads/validate';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!features.upload) {
    return jsonError('Uploads are currently closed. Please enjoy the gallery instead.', 403);
  }

  if (!isAwsConfigured()) {
    return jsonError('Photo storage is being prepared. Please try again a little later.', 503);
  }

  if (isGoogleAuthReady()) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return jsonError('Please sign in with Google to upload memories.', 401);
    }
  }

  let body: CompleteRequestBody;
  try {
    body = (await request.json()) as CompleteRequestBody;
  } catch {
    return jsonError('We could not confirm that upload. Please try again.', 400);
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return jsonError('Please choose one or more files first.', 400);
  }

  const uploadsPrefix = getUploadsPrefix();

  for (const item of items) {
    const nameResult = validateGuestName(item.guestName ?? '');
    if (!nameResult.ok) {
      return jsonError(nameResult.message, 400);
    }

    const captionResult = validateCaption(item.caption);
    if (!captionResult.ok) {
      return jsonError(captionResult.message, 400);
    }

    const eventResult = validateEvent(item.event);
    if (!eventResult.ok) {
      return jsonError(eventResult.message, 400);
    }

    if (!isOwnedUploadKey(item.key, uploadsPrefix, item.id)) {
      return jsonError('That upload could not be verified. Please try again.', 400);
    }

    if (item.thumbKey && !isOwnedUploadKey(item.thumbKey, uploadsPrefix, item.id)) {
      return jsonError('That upload could not be verified. Please try again.', 400);
    }

    const existing = await getMediaRecord(item.id);
    if (!existing || existing.key !== item.key) {
      return jsonError('That upload could not be verified. Please try again.', 400);
    }

    const uploaded = await objectExists(item.key);
    if (!uploaded) {
      return jsonError('We could not find that file yet. Please try again.', 400);
    }

    try {
      await publishMediaRecord(item.id, {
        guestName: item.guestName.trim(),
        caption: item.caption?.trim() || undefined,
        event: item.event,
        size: item.size,
        thumbKey: item.thumbKey ?? existing.thumbKey,
      });
    } catch {
      return jsonError('We saved your files but could not publish them just yet. Please try again.', 503);
    }
  }

  return jsonOk({
    message: `Thank you — ${items.length} ${items.length === 1 ? 'memory is' : 'memories are'} on the way to the gallery.`,
    count: items.length,
  });
}
