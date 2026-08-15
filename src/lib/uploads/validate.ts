import {
  ALLOWED_CONTENT_TYPES,
  UPLOAD_LIMITS,
  WEDDING_EVENTS,
  formatBytes,
  isAllowedContentType,
  isImageContentType,
  isVideoContentType,
} from '@/lib/uploads/limits';
import type { MediaKind, PresignFileRequest } from '@/lib/uploads/types';

export type ValidationResult =
  | { ok: true }
  | { ok: false; message: string };

const MAX_FILE_NAME_LENGTH = 180;

export function inferMediaKind(contentType: string, fileName?: string): MediaKind | undefined {
  if (isVideoContentType(contentType) || isVideoFileName(fileName)) {
    return 'video';
  }

  if (isImageContentType(contentType) || isImageFileName(fileName)) {
    return 'photo';
  }

  return undefined;
}

export function isImageFileName(fileName?: string): boolean {
  if (!fileName) {
    return false;
  }

  return /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(fileName);
}

export function isVideoFileName(fileName?: string): boolean {
  if (!fileName) {
    return false;
  }

  return /\.(mp4|mov|webm|m4v)$/i.test(fileName);
}

export function sanitizeFileName(fileName: string): string {
  const trimmed = fileName.trim().slice(0, MAX_FILE_NAME_LENGTH);
  const base = trimmed.split(/[\\/]/).pop() ?? 'memory';
  return base.replace(/[^a-zA-Z0-9._-]/g, '-') || 'memory';
}

export function validateGuestName(guestName: string): ValidationResult {
  const name = guestName.trim();

  if (name.length < 2) {
    return { ok: false, message: 'Please share your name so we know who this memory is from.' };
  }

  if (name.length > 80) {
    return { ok: false, message: 'Please use a shorter name, up to 80 characters.' };
  }

  return { ok: true };
}

export function validateCaption(caption: string | undefined): ValidationResult {
  if (!caption) {
    return { ok: true };
  }

  if (caption.trim().length > 280) {
    return { ok: false, message: 'Captions can be up to 280 characters.' };
  }

  return { ok: true };
}

export function validateEvent(event: string | undefined): ValidationResult {
  if (!event) {
    return { ok: true };
  }

  if (!(WEDDING_EVENTS as readonly string[]).includes(event)) {
    return { ok: false, message: 'Please choose one of the listed wedding events.' };
  }

  return { ok: true };
}

export function validateFileRequest(file: PresignFileRequest): ValidationResult {
  if (!file.fileName.trim()) {
    return { ok: false, message: 'One of the files has an invalid name. Please rename it and try again.' };
  }

  if (file.fileName.includes('..') || file.fileName.includes('/') || file.fileName.includes('\\')) {
    return { ok: false, message: 'One of the files has an invalid name. Please rename it and try again.' };
  }

  if (file.size <= 0) {
    return { ok: false, message: 'One of the selected files appears to be empty. Please choose another.' };
  }

  if (file.size > UPLOAD_LIMITS.maxBytesPerFile) {
    return {
      ok: false,
      message: `Each file can be up to ${formatBytes(UPLOAD_LIMITS.maxBytesPerFile)}. Please choose a smaller file.`,
    };
  }

  const contentType = file.contentType.toLowerCase();
  const kind = inferMediaKind(contentType, file.fileName);

  if (!isAllowedContentType(contentType) && !kind) {
    return {
      ok: false,
      message: 'Please upload a photo or video. We support JPEG, PNG, WebP, GIF, HEIC, MP4, MOV, and WebM.',
    };
  }

  if (file.kind === 'photo' && kind === 'video') {
    return { ok: false, message: 'A video was marked as a photo. Please try selecting the files again.' };
  }

  if (file.kind === 'video' && kind === 'photo') {
    return { ok: false, message: 'A photo was marked as a video. Please try selecting the files again.' };
  }

  return { ok: true };
}

export function validateFileBatch(files: PresignFileRequest[]): ValidationResult {
  if (files.length === 0) {
    return { ok: false, message: 'Please choose one or more files first.' };
  }

  if (files.length > UPLOAD_LIMITS.maxFilesPerSession) {
    return {
      ok: false,
      message: `You can upload up to ${UPLOAD_LIMITS.maxFilesPerSession} files at a time.`,
    };
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  if (totalBytes > UPLOAD_LIMITS.maxBytesPerSession) {
    return {
      ok: false,
      message: `This selection is ${formatBytes(totalBytes)}. Please keep a session under ${formatBytes(UPLOAD_LIMITS.maxBytesPerSession)}.`,
    };
  }

  for (const file of files) {
    const result = validateFileRequest(file);
    if (!result.ok) {
      return result;
    }
  }

  return { ok: true };
}

export function isOwnedUploadKey(key: string, uploadsPrefix: string, id: string): boolean {
  if (!key.startsWith(uploadsPrefix)) {
    return false;
  }

  if (key.includes('..') || key.startsWith('/')) {
    return false;
  }

  return key.includes(`/${id}/`);
}

export { ALLOWED_CONTENT_TYPES };
