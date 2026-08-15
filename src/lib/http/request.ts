const COOKIE_NAME = 'geeni_upload_session';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) {
      return first;
    }
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function getUploadSessionIdFromCookieHeader(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [name, ...rest] = part.trim().split('=');
    if (name === COOKIE_NAME) {
      const value = rest.join('=');
      return isUuid(value) ? value : undefined;
    }
  }

  return undefined;
}

export function createUploadSessionCookie(sessionId: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure}`;
}

export function getOrCreateUploadSessionId(request: Request): { sessionId: string; setCookie?: string } {
  const existing = getUploadSessionIdFromCookieHeader(request.headers.get('cookie'));
  if (existing) {
    return { sessionId: existing };
  }

  const sessionId = crypto.randomUUID();
  return { sessionId, setCookie: createUploadSessionCookie(sessionId) };
}
