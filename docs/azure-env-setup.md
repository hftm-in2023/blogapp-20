# Azure Static Web Apps — Umgebungsvariablen setzen

## Voraussetzungen

- Azure CLI installiert (`az`)
- Eingeloggt mit `az login`

## Schritt 1: Ressourcenname herausfinden

```bash
az staticwebapp list --query "[].{name:name, hostname:defaultHostname}" -o table
```

Notiere dir den **Name** (nicht den Hostname) deiner Static Web App.

## Schritt 2: Umgebungsvariablen setzen

```bash
az staticwebapp appsettings set --name <DEIN-SWA-NAME> \
  --setting-names \
  SESSION_SECRET="$(openssl rand -base64 32)" \
  KEYCLOAK_URL="https://d-cap-keyclaok.kindbay-711f60b2.westeurope.azurecontainerapps.io/realms/blog" \
  KEYCLOAK_CLIENT_ID="bff-blog" \
  KEYCLOAK_CLIENT_SECRET="R8jk2D8da7omHBxp6wH8YiYROxv8CZvn" \
  BLOG_BACKEND_URL="https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io" \
  ALLOWED_ORIGIN="https://<DEIN-HOSTNAME>.azurestaticapps.net"
```

> **`<DEIN-SWA-NAME>`** durch den Ressourcennamen aus Schritt 1 ersetzen.
> **`<DEIN-HOSTNAME>`** durch den Hostname deiner Static Web App ersetzen (z.B. `calm-plant-0066bdd03.6`).

## Schritt 3: Überprüfen

```bash
az staticwebapp appsettings list --name <DEIN-SWA-NAME> -o table
```
