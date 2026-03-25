import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { proxyToBackend } from '../lib/proxy.js';
import { corsHeaders, handlePreflight } from '../lib/cors.js';
import { checkCsrf } from '../lib/csrf.js';

async function proxyComment(request: HttpRequest): Promise<HttpResponseInit> {
  const preflight = handlePreflight(request);
  if (preflight) return preflight;

  const csrf = checkCsrf(request);
  if (csrf) return { ...csrf, headers: { ...csrf.headers, ...corsHeaders } };

  const id = request.params.id;
  const result = await proxyToBackend(
    request,
    '/entries/' + id + '/comments',
    'POST',
  );

  return {
    status: result.status,
    jsonBody: result.body,
    headers: { ...corsHeaders, ...result.headers },
  };
}

app.http('proxy-comment', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'entries/{id:int}/comments',
  handler: proxyComment,
});
