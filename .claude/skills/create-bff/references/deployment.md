# BFF Deployment to Azure Static Web Apps

## GitHub Actions workflow

The key setting is `api_location: "bff"`. If this is empty or missing, the BFF Azure Functions are silently not deployed and all `/api` requests return 404.

```yaml
# In your Azure SWA GitHub Actions workflow file
- name: Build And Deploy
  uses: Azure/static-web-apps-deploy@v1
  with:
    azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
    repo_token: ${{ secrets.GITHUB_TOKEN }}
    action: "upload"
    app_location: "/"
    api_location: "bff" # <-- This MUST be "bff", not ""
    output_location: "dist/your-app/browser"
```

## Setting environment variables

Environment variables must be set as Azure SWA Application Settings. They are NOT read from `local.settings.json` in production.

**The user must run this command themselves** — it contains secrets that should not be generated or handled by the skill. Present this command to the user and ask them to fill in their values:

```bash
az staticwebapp appsettings set \
  --name <your-swa-name> \
  --setting-names \
  SESSION_SECRET="$(openssl rand -base64 32)" \
  KEYCLOAK_URL="https://your-keycloak-host/realms/your-realm" \
  KEYCLOAK_CLIENT_ID="bff-your-app" \
  KEYCLOAK_CLIENT_SECRET="your-client-secret" \
  BACKEND_API_URL="https://your-backend-api.example.com" \
  ALLOWED_ORIGIN="https://your-swa-name.azurestaticapps.net"
```

**After the user confirms they've run it**, verify by listing setting names (values are not shown):

```bash
az staticwebapp appsettings list --name <swa-name> --query "[].name" -o tsv
```

All six must be present: `SESSION_SECRET`, `KEYCLOAK_URL`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`, `BACKEND_API_URL`, `ALLOWED_ORIGIN`. If any are missing, tell the user which ones and provide the specific `az` command to add them.

**Important notes:**

- `SESSION_SECRET` must be consistent across cold starts — generate once and set permanently
- `ALLOWED_ORIGIN` must exactly match the frontend URL (no trailing slash)

## staticwebapp.config.json

The SPA needs a fallback route for client-side routing. API routes are handled automatically by Azure SWA.

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "/*.{css,js,svg,png,jpg,ico,woff2}"]
  }
}
```

## Keycloak client setup

The BFF requires a **confidential** Keycloak client with these settings:

1. **Client type**: OpenID Connect
2. **Client authentication**: ON (confidential)
3. **Direct Access Grants**: Enabled (for ROPC password grant)
4. **Valid redirect URIs**: Not needed (BFF uses direct grant, not redirect flow)
5. **Web origins**: Your frontend origin (for CORS on token endpoint, if needed)

To create via Keycloak Admin REST API (avoid curl for this — shell escaping mangles JWT tokens; use a Node.js script instead):

```typescript
// create-client.mjs
const adminToken = await fetch(`${KEYCLOAK_URL}/protocol/openid-connect/token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "password",
    client_id: "admin-cli",
    username: "admin",
    password: "your-admin-password",
  }),
}).then((r) => r.json());

await fetch(`${KEYCLOAK_ADMIN_URL}/clients`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken.access_token}`,
  },
  body: JSON.stringify({
    clientId: "bff-your-app",
    directAccessGrantsEnabled: true,
    publicClient: false,
    serviceAccountsEnabled: false,
  }),
});
```

## Troubleshooting deployment

| Symptom                                                | Cause                                      | Fix                                                          |
| ------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------ |
| All `/api` routes return 404                           | `api_location` is empty in workflow        | Set `api_location: "bff"`                                    |
| Login returns 200 but no cookie set                    | Azure SWA strips `Set-Cookie` headers      | Use `cookies: Cookie[]` property on `HttpResponseInit`       |
| `auth/me` returns `isAuthenticated: false` after login | Cookie value URL-encoded by Azure SWA      | Add `decodeURIComponent()` in `parseCookie()`                |
| CORS error on login/like/comment                       | Missing CORS headers on error response     | Spread `corsHeaders` into all responses including errors     |
| `X-Requested-With` preflight fails                     | OPTIONS handler missing or incomplete      | Include `X-Requested-With` in `Access-Control-Allow-Headers` |
| `func start` fails with ESM errors                     | Missing `"type": "module"` in package.json | Add `"type": "module"` to `bff/package.json`                 |
| Functions not discovered at startup                    | Missing import in index.ts                 | Import every function file in `bff/src/index.ts`             |
| TypeScript import errors                               | Missing `.js` extension on local imports   | Use `./session.js` not `./session` or `./session.ts`         |
