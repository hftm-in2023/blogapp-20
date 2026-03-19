# CLAUDE.md

## Project Overview

Angular 21 blog application with a Backend-for-Frontend (BFF) pattern using Azure Functions. Deployed to Azure Static Web Apps.

## Commands

| Task                        | Command                   |
| --------------------------- | ------------------------- |
| Dev server (frontend + BFF) | `npm start`               |
| Build production            | `npm run build`           |
| Run all tests               | `npm test`                |
| Run tests headless (CI)     | `npm run test:ci`         |
| Lint                        | `npm run lint`            |
| Format                      | `npm run format`          |
| Build BFF only              | `cd bff && npm run build` |
| Start BFF only              | `npm run start:bff`       |

## Architecture

- **Frontend**: Angular 21 with standalone components, signals, and zoneless change detection
- **BFF**: Azure Functions v4 (TypeScript, ESM) in `bff/` directory
- **Auth**: BFF pattern — session cookies via `@hapi/iron`, Keycloak as identity provider
- **State**: Signal-based stores (`signal()` + `computed()`) — no NgRx
- **Routing**: Lazy-loaded features with `canMatch` guards
- **i18n**: ngx-translate with JSON files in `public/i18n/`
- **Validation**: Zod v4
- **UI**: Angular Material + SCSS

## Project Structure

```
src/app/
  core/          # Auth, layout, state, interceptors, error handling, theme
  feature/       # Domain features (blog-overview, blog-detail, add-blog, login, demo)
  shared/        # Reusable components (blog-card)
bff/src/
  functions/     # Azure Function endpoints (auth-login, auth-logout, auth-me, proxy-entries)
  lib/           # Shared BFF logic (session, keycloak, cors, csrf, proxy)
```

## Code Conventions

- **Strict TypeScript** — `strict: true`, `strictTemplates: true`, no implicit returns
- **Type keyword** over interface — enforced by ESLint (`consistent-type-definitions`)
- **Standalone components only** — no NgModules
- **Component prefix**: `app` (selector: `app-*`, directive: `appCamelCase`)
- **Conventional commits** — enforced by commitlint (`feat:`, `fix:`, `chore:`, etc.)
- **Pre-commit hooks**: lint-staged runs ESLint + Prettier on staged files
- **Single quotes** for TypeScript, 2-space indent, trailing newline

## Environment Config

- Production BFF URL: `/api` (relative, served by Azure SWA)
- Development BFF URL: `http://localhost:7071/api`
- Config files: `src/environments/environment.ts` and `environment.development.ts`
- BFF local settings: `bff/local.settings.json` (not committed)

## Deployment

- **Platform**: Azure Static Web Apps
- **CI**: GitHub Actions — `ci-build.yml` (test + build), `azure-static-web-apps-*.yml` (deploy)
- **Node version**: 20.19.1
- **Build output**: `dist/blogapp-20/browser`
- **API location**: `bff` (deployed as managed Azure Functions)
- BFF environment variables must be set in Azure SWA Application Settings (see `docs/azure-env-setup.md`)

## Testing

- **Framework**: Karma + Jasmine
- **Browser**: ChromeHeadless for CI
- **Spec files**: Co-located with source (`*.spec.ts`)
