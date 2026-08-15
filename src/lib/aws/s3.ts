import { HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  getAwsRegion,
  getMediaBucket,
  getOfficialPrefix,
  getUploadsPrefix,
  isAwsConfigured,
} from '@/lib/config/env';
import { UPLOAD_LIMITS } from '@/lib/uploads/limits';
import { sanitizeFileName } from '@/lib/uploads/validate';
import type { MediaKind } from '@/lib/uploads/types';

let s3Client: S3Client | undefined;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({ region: getAwsRegion() });
  }

  return s3Client;
}

function requireBucket(): string {
  const bucket = getMediaBucket();
  if (!bucket) {
    throw new Error('AWS_S3_BUCKET is not configured.');
  }

  return bucket;
}

export function buildUploadKeys(input: {
  id: string;
  fileName: string;
  kind: MediaKind;
  createdAt: Date;
  hasThumbnail: boolean;
}): { key: string; thumbKey?: string } {
  const created = input.createdAt;
  const year = created.getUTCFullYear();
  const month = String(created.getUTCMonth() + 1).padStart(2, '0');
  const safeName = sanitizeFileName(input.fileName);
  const prefix = `${getUploadsPrefix()}${year}/${month}/${input.id}`;
  const originalName = input.kind === 'photo' ? `original-${safeName}` : safeName;

  return {
    key: `${prefix}/${originalName}`,
    thumbKey: input.hasThumbnail ? `${prefix}/thumb.jpg` : undefined,
  };
}

export async function createPresignedPutUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: requireBucket(),
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(getS3Client(), command, {
    expiresIn: UPLOAD_LIMITS.presignedUrlExpiresInSeconds,
  });
}

export async function listOfficialObjects(maxKeys = 60): Promise<Array<{ key: string; lastModified?: Date }>> {
  if (!isAwsConfigured()) {
    return [];
  }

  const result = await getS3Client().send(
    new ListObjectsV2Command({
      Bucket: requireBucket(),
      Prefix: getOfficialPrefix(),
      MaxKeys: maxKeys,
    }),
  );

  return (result.Contents ?? [])
    .filter((item): item is { Key: string; LastModified?: Date } => Boolean(item.Key) && !item.Key?.endsWith('/'))
    .map((item) => ({ key: item.Key, lastModified: item.LastModified }));
}

export async function putOfficialObject(key: string, body: Buffer, contentType: string): Promise<void> {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: requireBucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=86400',
    }),
  );
}

export async function objectExists(key: string): Promise<boolean> {
  try {
    await getS3Client().send(
      new HeadObjectCommand({
        Bucket: requireBucket(),
        Key: key,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

export { getOfficialPrefix, getUploadsPrefix };
