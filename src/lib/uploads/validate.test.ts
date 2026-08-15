import { describe, expect, it } from 'vitest';
import { UPLOAD_LIMITS } from '@/lib/uploads/limits';
import {
  inferMediaKind,
  isOwnedUploadKey,
  sanitizeFileName,
  validateCaption,
  validateEvent,
  validateFileBatch,
  validateFileRequest,
  validateGuestName,
} from '@/lib/uploads/validate';

describe('validateGuestName', () => {
  it('accepts a normal guest name', () => {
    expect(validateGuestName('Nidhi')).toEqual({ ok: true });
  });

  it('rejects a missing name', () => {
    expect(validateGuestName(' ')).toEqual({
      ok: false,
      message: 'Please share your name so we know who this memory is from.',
    });
  });
});

describe('validateCaption', () => {
  it('allows an empty caption', () => {
    expect(validateCaption(undefined)).toEqual({ ok: true });
  });

  it('rejects captions over 280 characters', () => {
    expect(validateCaption('x'.repeat(281)).ok).toBe(false);
  });
});

describe('validateEvent', () => {
  it('accepts a listed event', () => {
    expect(validateEvent('Sangeet')).toEqual({ ok: true });
  });

  it('rejects an unknown event', () => {
    expect(validateEvent('Afterparty').ok).toBe(false);
  });
});

describe('validateFileRequest', () => {
  it('accepts a jpeg photo', () => {
    expect(
      validateFileRequest({
        fileName: 'ceremony.jpg',
        contentType: 'image/jpeg',
        size: 1_000_000,
        kind: 'photo',
        hasThumbnail: true,
      }),
    ).toEqual({ ok: true });
  });

  it('rejects files over the size limit', () => {
    const result = validateFileRequest({
      fileName: 'huge.mp4',
      contentType: 'video/mp4',
      size: UPLOAD_LIMITS.maxBytesPerFile + 1,
      kind: 'video',
      hasThumbnail: false,
    });

    expect(result.ok).toBe(false);
  });

  it('rejects path-like file names', () => {
    const result = validateFileRequest({
      fileName: '../secret.jpg',
      contentType: 'image/jpeg',
      size: 1000,
      kind: 'photo',
      hasThumbnail: false,
    });

    expect(result.ok).toBe(false);
  });
});

describe('validateFileBatch', () => {
  it('rejects an empty selection', () => {
    expect(validateFileBatch([])).toEqual({
      ok: false,
      message: 'Please choose one or more files first.',
    });
  });

  it('rejects more than the session file limit', () => {
    const files = Array.from({ length: UPLOAD_LIMITS.maxFilesPerSession + 1 }, (_, index) => ({
      fileName: `photo-${index}.jpg`,
      contentType: 'image/jpeg',
      size: 10,
      kind: 'photo' as const,
      hasThumbnail: false,
    }));

    expect(validateFileBatch(files).ok).toBe(false);
  });
});

describe('helpers', () => {
  it('infers photos and videos from type or name', () => {
    expect(inferMediaKind('image/jpeg')).toBe('photo');
    expect(inferMediaKind('video/mp4')).toBe('video');
    expect(inferMediaKind('', 'clip.MOV')).toBe('video');
  });

  it('sanitizes file names', () => {
    expect(sanitizeFileName('Our Dance!.JPG')).toBe('Our-Dance-.JPG');
  });

  it('only allows keys owned by the upload id', () => {
    expect(isOwnedUploadKey('uploads/2026/08/abc/original.jpg', 'uploads/', 'abc')).toBe(true);
    expect(isOwnedUploadKey('gallery/official/photo.jpg', 'uploads/', 'abc')).toBe(false);
    expect(isOwnedUploadKey('uploads/2026/08/other/original.jpg', 'uploads/', 'abc')).toBe(false);
  });
});
