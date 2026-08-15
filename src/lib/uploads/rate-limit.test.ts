import { describe, expect, it } from 'vitest';
import { UPLOAD_LIMITS } from '@/lib/uploads/limits';
import { MemoryRateLimitStore, consumeUploadQuota, rateLimitKeys } from '@/lib/uploads/rate-limit';

describe('rateLimitKeys', () => {
  it('uses minute and day windows', () => {
    const now = new Date('2026-08-15T16:02:30.000Z');
    const keys = rateLimitKeys({ ip: '1.2.3.4', sessionId: 'session-1', now });

    expect(keys.presignMinute).toBe('presign:ip:1.2.3.4:minute:2026-08-15T16:02');
    expect(keys.filesDay).toBe('files:ip:1.2.3.4:day:2026-08-15');
    expect(keys.filesSession).toBe('files:session:session-1');
  });
});

describe('consumeUploadQuota', () => {
  it('allows a first upload', async () => {
    const store = new MemoryRateLimitStore();
    const result = await consumeUploadQuota(store, {
      ip: '1.2.3.4',
      sessionId: 'session-1',
      fileCount: 2,
      totalBytes: 1_000_000,
      now: new Date('2026-08-15T16:02:00.000Z'),
    });

    expect(result.allowed).toBe(true);
  });

  it('blocks more than the per-minute presign limit', async () => {
    const store = new MemoryRateLimitStore();
    const now = new Date('2026-08-15T16:02:00.000Z');

    for (let index = 0; index < UPLOAD_LIMITS.maxPresignsPerMinute; index += 1) {
      const result = await consumeUploadQuota(store, {
        ip: '8.8.8.8',
        sessionId: `session-${index}`,
        fileCount: 1,
        totalBytes: 100,
        now,
      });
      expect(result.allowed).toBe(true);
    }

    const blocked = await consumeUploadQuota(store, {
      ip: '8.8.8.8',
      sessionId: 'session-overflow',
      fileCount: 1,
      totalBytes: 100,
      now,
    });

    expect(blocked.allowed).toBe(false);
    expect(blocked.message).toMatch(/wait a moment/i);
  });

  it('blocks a session that exceeds the file cap', async () => {
    const store = new MemoryRateLimitStore();
    const now = new Date('2026-08-15T16:02:00.000Z');

    const allowed = await consumeUploadQuota(store, {
      ip: '9.9.9.9',
      sessionId: 'big-session',
      fileCount: UPLOAD_LIMITS.maxFilesPerSession,
      totalBytes: 1000,
      now,
    });
    expect(allowed.allowed).toBe(true);

    const blocked = await consumeUploadQuota(store, {
      ip: '9.9.9.9',
      sessionId: 'big-session',
      fileCount: 1,
      totalBytes: 10,
      now: new Date('2026-08-15T16:03:00.000Z'),
    });

    expect(blocked.allowed).toBe(false);
    expect(blocked.message).toMatch(/100 files/i);
  });
});
