import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import {
  parseCookie,
  unsealSession,
  isSessionExpired,
  sealSession,
} from '../lib/session.js';
import { refreshTokens } from '../lib/keycloak.js';
import { corsHeaders, handlePreflight } from '../lib/cors.js';
import { decodeJwt } from 'jose';

async function authMe(request: HttpRequest): Promise<HttpResponseInit> {
  const preflight = handlePreflight(request);
  if (preflight) return preflight;

  const cookieHeader = request.headers.get('cookie');
  const sealed = parseCookie(cookieHeader);

  if (!sealed) {
    return {
      status: 200,
      jsonBody: { isAuthenticated: false, user: null },
      headers: corsHeaders,
    };
  }

  let session = await unsealSession(sealed);
  if (!session) {
    return {
      status: 200,
      jsonBody: { isAuthenticated: false, user: null },
      headers: {
        ...corsHeaders,
        'Set-Cookie':
          '__session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
      },
    };
  }

  const extraHeaders: Record<string, string> = {};

  if (isSessionExpired(session)) {
    try {
      const tokens = await refreshTokens(session.refreshToken);
      session = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: Date.now() + tokens.expires_in * 1000,
      };
      const newSealed = await sealSession(session);
      extraHeaders['Set-Cookie'] =
        `__session=${newSealed}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`;
    } catch {
      return {
        status: 200,
        jsonBody: { isAuthenticated: false, user: null },
        headers: {
          ...corsHeaders,
          'Set-Cookie':
            '__session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
        },
      };
    }
  }

  const claims = decodeJwt(session.accessToken);

  return {
    status: 200,
    jsonBody: {
      isAuthenticated: true,
      user: {
        preferred_username: claims.preferred_username,
        email: claims.email,
        name: claims.name,
        roles: (claims as Record<string, unknown>).realm_access
          ? (
              (claims as Record<string, unknown>).realm_access as {
                roles: string[];
              }
            ).roles
          : [],
      },
    },
    headers: { ...corsHeaders, ...extraHeaders },
  };
}

app.http('auth-me', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/me',
  handler: authMe,
});
