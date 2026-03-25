import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { authenticateUser } from '../lib/keycloak.js';
import { sealSession, sessionCookie } from '../lib/session.js';
import { checkCsrf } from '../lib/csrf.js';
import { corsHeaders, handlePreflight } from '../lib/cors.js';
import { decodeJwt } from 'jose';

async function authLogin(request: HttpRequest): Promise<HttpResponseInit> {
  const preflight = handlePreflight(request);
  if (preflight) return preflight;

  const csrfError = checkCsrf(request);
  if (csrfError) return { ...csrfError, headers: corsHeaders };

  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };
    const { username, password } = body;

    if (!username || !password) {
      return {
        status: 400,
        jsonBody: { error: 'Username and password are required' },
        headers: corsHeaders,
      };
    }

    const tokens = await authenticateUser(username, password);
    const sealed = await sealSession({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    });

    const claims = decodeJwt(tokens.access_token);

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
      headers: corsHeaders,
      cookies: [sessionCookie(sealed)],
    };
  } catch (error) {
    return {
      status: 401,
      jsonBody: {
        error: error instanceof Error ? error.message : 'Authentication failed',
      },
      headers: corsHeaders,
    };
  }
}

app.http('auth-login', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/login',
  handler: authLogin,
});
