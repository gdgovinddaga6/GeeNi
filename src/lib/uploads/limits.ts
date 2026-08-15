export const UPLOAD_LIMITS = {
  maxFilesPerSession: 100,
  maxBytesPerSession: 5 * 1024 * 1024 * 1024,
  maxBytesPerFile: 250 * 1024 * 1024,
  maxPresignsPerMinute: 10,
  maxFilesPerIpPerDay: 200,
  presignedUrlExpiresInSeconds: 5 * 60,
  longEdgePixels: 2560,
  thumbnailPixels: 480,
  jpegQuality: 0.8,
} as const;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
] as const;

export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'] as const;

export const ALLOWED_CONTENT_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES] as const;

export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

export const WEDDING_EVENTS = [
  'Mayra',
  'Sangeet',
  'Haldi',
  'Reception',
  'Wedding Ceremony',
  'Other',
] as const;

export type WeddingEvent = (typeof WEDDING_EVENTS)[number];

export function isAllowedContentType(value: string): value is AllowedContentType {
  return (ALLOWED_CONTENT_TYPES as readonly string[]).includes(value);
}

export function isImageContentType(value: string): boolean {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(value) || value.startsWith('image/');
}

export function isVideoContentType(value: string): boolean {
  return (ALLOWED_VIDEO_TYPES as readonly string[]).includes(value) || value.startsWith('video/');
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
