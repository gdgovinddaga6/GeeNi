import { describe, expect, it } from 'vitest';
import { createUploadSessionCookie, getClientIp, getUploadSessionIdFromCookieHeader, isUuid } from '@/lib/http/request';

describe('request helpers', () => {
  it('reads the first forwarded IP', () => {
    const request = new Request('http://localhost/api/uploads/presign', {
      headers: { 'x-forwarded-for': '203.0.113.10, 10.0.0.1' },
    });

    expect(getClientIp(request)).toBe('203.0.113.10');
  });

  it('reads a valid upload session cookie', () => {
    const sessionId = '11111111-1111-4111-8111-111111111111';
    expect(isUuid(sessionId)).toBe(true);
    expect(getUploadSessionIdFromCookieHeader(`geeni_upload_session=${sessionId}; Path=/`)).toBe(sessionId);
    expect(createUploadSessionCookie(sessionId)).toContain(sessionId);
  });
});
