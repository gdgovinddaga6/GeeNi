import { UPLOAD_LIMITS, formatBytes } from '@/lib/uploads/limits';

export type RateLimitDecision = {
  allowed: boolean;
  retryAfterSeconds?: number;
  message?: string;
};

export type RateLimitInput = {
  ip: string;
  sessionId: string;
  fileCount: number;
  totalBytes: number;
  now?: Date;
};

export interface RateLimitStore {
  increment(key: string, amount: number, ttlSeconds: number): Promise<number>;
}

export class MemoryRateLimitStore implements RateLimitStore {
  private readonly entries = new Map<string, { value: number; expiresAt: number }>();

  async increment(key: string, amount: number, ttlSeconds: number): Promise<number> {
    const now = Date.now();
    const existing = this.entries.get(key);

    if (!existing || existing.expiresAt <= now) {
      const entry = { value: amount, expiresAt: now + ttlSeconds * 1000 };
      this.entries.set(key, entry);
      return amount;
    }

    existing.value += amount;
    return existing.value;
  }
}

export function minuteWindowKey(now: Date): string {
  return now.toISOString().slice(0, 16);
}

export function dayWindowKey(now: Date): string {
  return now.toISOString().slice(0, 10);
}

export function rateLimitKeys(input: { ip: string; sessionId: string; now?: Date }) {
  const now = input.now ?? new Date();

  return {
    presignMinute: `presign:ip:${input.ip}:minute:${minuteWindowKey(now)}`,
    filesDay: `files:ip:${input.ip}:day:${dayWindowKey(now)}`,
    filesSession: `files:session:${input.sessionId}`,
    bytesSession: `bytes:session:${input.sessionId}`,
  };
}

export async function consumeUploadQuota(
  store: RateLimitStore,
  input: RateLimitInput,
): Promise<RateLimitDecision> {
  if (input.fileCount <= 0) {
    return { allowed: false, message: 'Please choose one or more files first.' };
  }

  const now = input.now ?? new Date();
  const keys = rateLimitKeys({ ip: input.ip, sessionId: input.sessionId, now });

  const presignCount = await store.increment(keys.presignMinute, 1, 120);
  if (presignCount > UPLOAD_LIMITS.maxPresignsPerMinute) {
    return {
      allowed: false,
      retryAfterSeconds: 60,
      message: 'Uploads are a little busy right now. Please wait a moment and try again.',
    };
  }

  const filesToday = await store.increment(keys.filesDay, input.fileCount, 60 * 60 * 48);
  if (filesToday > UPLOAD_LIMITS.maxFilesPerIpPerDay) {
    return {
      allowed: false,
      retryAfterSeconds: 60 * 60,
      message: 'You have reached today’s upload limit. Thank you for sharing — please try again tomorrow.',
    };
  }

  const sessionFiles = await store.increment(keys.filesSession, input.fileCount, 60 * 60 * 24 * 7);
  if (sessionFiles > UPLOAD_LIMITS.maxFilesPerSession) {
    return {
      allowed: false,
      message: `You can upload up to ${UPLOAD_LIMITS.maxFilesPerSession} files in one session.`,
    };
  }

  const sessionBytes = await store.increment(keys.bytesSession, input.totalBytes, 60 * 60 * 24 * 7);
  if (sessionBytes > UPLOAD_LIMITS.maxBytesPerSession) {
    return {
      allowed: false,
      message: `Please keep this session under ${formatBytes(UPLOAD_LIMITS.maxBytesPerSession)}.`,
    };
  }

  return { allowed: true };
}
