import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { proxyToBackend } from '../lib/proxy.js';
import { corsHeaders, handlePreflight } from '../lib/cors.js';
import { checkCsrf } from '../lib/csrf.js';

async function proxyLike(request: HttpRequest): Promise<HttpResponseInit> {
  const preflight = handlePreflight(request);
  if (preflight) return preflight;

  const csrf = checkCsrf(request);
  if (csrf) return csrf;

  const id = request.params.id;
  const result = await proxyToBackend(
    request,
    '/entries/' + id + '/like-info',
    'PUT',
  );

  return {
    status: result.status,
    jsonBody: result.body,
    headers: { ...corsHeaders, ...result.headers },
  };
}

app.http('proxy-like', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'entries/{id}/like',
  handler: proxyLike,
});
