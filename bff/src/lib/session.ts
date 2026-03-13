import * as Iron from '@hapi/iron';

const SESSION_SECRET = process.env.SESSION_SECRET!;
const COOKIE_NAME = '__session';

export type SessionData = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export async function sealSession(data: SessionData): Promise<string> {
  return Iron.seal(data, SESSION_SECRET, Iron.defaults);
}

export async function unsealSession(
  cookie: string,
): Promise<SessionData | null> {
  try {
    return (await Iron.unseal(
      cookie,
      SESSION_SECRET,
      Iron.defaults,
    )) as SessionData;
  } catch {
    return null;
  }
}

export function parseCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  return match ? match.substring(COOKIE_NAME.length + 1) : null;
}

export function setSessionCookie(
  sealed: string,
  headers: Record<string, string>,
): void {
  headers['Set-Cookie'] =
    `${COOKIE_NAME}=${sealed}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`;
}

export function clearSessionCookie(headers: Record<string, string>): void {
  headers['Set-Cookie'] =
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function isSessionExpired(session: SessionData): boolean {
  return Date.now() >= session.expiresAt;
}

export function sessionToHeaders(sealed: string): Record<string, string> {
  const headers: Record<string, string> = {};
  setSessionCookie(sealed, headers);
  return headers;
}
