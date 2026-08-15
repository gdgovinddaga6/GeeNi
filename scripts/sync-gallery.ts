import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdir, readFile } from 'node:fs/promises';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const IMAGE_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Set it before syncing gallery assets.`);
  }

  return value;
}

function contentTypeFor(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase();
  return IMAGE_TYPES[extension] ?? 'application/octet-stream';
}

async function main() {
  const bucket = requiredEnv('AWS_S3_BUCKET');
  const region = process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? 'us-east-1';
  const prefix = (process.env.AWS_S3_OFFICIAL_PREFIX ?? 'gallery/official/').replace(/\/?$/, '/');
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const folder = path.join(root, 'gallery-assets');
  const entries = await readdir(folder, { withFileTypes: true });
  const files = entries.filter(
    (entry) => entry.isFile() && !entry.name.startsWith('.') && entry.name !== 'README.md',
  );

  if (files.length === 0) {
    console.log('No gallery assets found in gallery-assets/. Add photos and run this script again.');
    return;
  }

  const client = new S3Client({ region });

  for (const file of files) {
    const body = await readFile(path.join(folder, file.name));
    const key = `${prefix}${file.name}`;
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentTypeFor(file.name),
        CacheControl: 'public, max-age=86400',
      }),
    );
    console.log(`Uploaded ${file.name} -> s3://${bucket}/${key}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Gallery sync failed.';
  console.error(message);
  process.exitCode = 1;
});
