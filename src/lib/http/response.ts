export function jsonError(message: string, status: number, extra?: Record<string, string | number>) {
  return Response.json({ message, ...extra }, { status });
}

export function jsonOk<T extends object>(body: T, init?: { headers?: HeadersInit; status?: number }) {
  return Response.json(body, init);
}
