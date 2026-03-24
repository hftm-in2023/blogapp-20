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
- **Theming**: Material Design 3 CSS custom properties (`var(--mat-sys-*)`) — no hardcoded colors
- **Component styles**: SCSS with `:host { display: block; }` as default base style

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

## Architecture Rules

### Layer Boundaries

- **Data Layer**: Backend services + HTTP interceptors only. No business logic here.
- **Business Logic**: Stores (state + computed selectors) and feature services. No UI concerns.
- **Application/UI Logic**: Page components, dumb components, router. No direct HTTP calls — exception: resolvers may call backend services directly in the Gated Navigation pattern (see Resolver & Navigation Patterns).

### Component Rules (Smart/Dumb Split)

- **Page Components** (smart/container): Inject stores/services, hold local UI state, mediate between dumb components and stores. Use `input()`/`output()` for route data. Located in `feature/*/`.
- **Dumb Components** (presentational): Only `input()` for data, `output()` for events. No injected services/stores. No side effects. Located in `shared/` or as children of page components.
- **Signal API only**: Use `input()`, `input.required()`, `output()`, `model()` — never `@Input()` / `@Output()` decorators
- **Control flow**: Use `@if`, `@for` (with `track`), `@defer` (with `@placeholder`) — no legacy `*ngIf`, `*ngFor` — `<ng-template>` only when required by Material/CDK APIs
- **Templates**: Inline `template` for simple components, external `templateUrl` for complex ones

### Signal-Based State Management

- **State** → private `signal<T>(initialState)` in store services
- **Selectors** → public `computed()` signals (read-only derived state)
- **Actions/Reducers** → public methods using `signal.update()` / `signal.set()`
- **Effects** → `effect()` for side effects only (toast, console.log, localStorage sync). Business events in effects must be `untracked()` to avoid cycles.
- `computed()` must be pure — no async, no DOM mutations, no side effects
- **Cross-feature events** → `Dispatcher` service (RxJS Subject with `Action<T>`) for events that cross feature boundaries — no direct store-to-store imports across features

### State Types

- **Local state**: Component-scoped, lives in a component signal, lost when component destroys
- **Shared/Feature state**: Feature store service, shared among components within a feature
- **Global state**: Core store service (`providedIn: 'root'`), app-wide (auth, theme, router)
- **Persistent state**: Survives refresh — stored in localStorage, URL, or session cookie
- **Silent state**: In-memory only, lost on refresh/navigation

### Core vs Feature

- **Core** (`src/app/core/`): Global stores (AppStore, AuthStore, ThemeStore), HTTP interceptors, backend service base patterns, event dispatcher, error handling
- **Feature** (`src/app/feature/*/`): Feature-specific stores, feature services, page components, feature routes/resolvers/guards
- **Feature isolation**: Each feature lives in its own subfolder under `feature/` (e.g., `feature/blog-overview/`, `feature/add-blog/`, `feature/login/`)
- Features must NOT import from other features — only from `core/` or `shared/`
- **Core providers**: Core providers (interceptors, error handler) are registered exclusively in `app.config.ts`
- **No feature-specific logic in core** — core must remain generic and feature-agnostic
- **Core layout components**: `core/layout/` holds app-shell components (header, sidebar) used by the root `App` component — reusable components shared across features belong in `shared/`
- **No business logic in shared** — shared components are purely presentational
- **Shared must not import from `core/`** — shared components depend only on Angular/third-party libraries, not on app-specific core services

### Backend Services (Data Layer)

- Transform, validate (Zod), and cache backend data
- Hide heterogeneous API responses behind uniform methods
- Protect the app from faulty data
- Use `httpResource` for component-level reactive data; use `HttpClient` + `lastValueFrom` for resolver-driven loading and mutations
- Located in feature directories (`*-backend.ts`)

### Resolver & Navigation Patterns

**Default: data must be ready before navigation.** Resolvers load data via stores, block navigation until complete, and the component receives resolved data.

**Two patterns:**

1. **Resolver → Store Loading (default)** — Resolver calls `store.load()`, awaits completion, data is ready when component initializes.

   ```
   Resolver → store.load() → Store → Backend Service → State ready → Navigate
   ```

2. **Gated Navigation Resolver (exception — business access gates only)** — Resolver calls backend service directly to decide if route entry is allowed. On success: write state to store, allow navigation. On business rejection: redirect, store unchanged.
   ```
   Resolver → Backend Service → Decision
     ├─ OK  → store.setState() → navigate
     └─ NOK → redirect → store unchanged
   ```

**When NOT to use resolvers:**

- **Slow APIs** — Don't block navigation; let the component show a skeleton/loading state instead
- **Cached/already-loaded data** — If the store already has the data, don't re-fetch in a resolver
- **Auth/access checks** — Use guards, not resolvers

**Guard rules:**

- Use `canMatchFn` exclusively — no `CanActivateFn` or other guard types
- Guards must NOT load data — they only guard navigation

**Router state as source of truth:**

- UI state (filters, pagination, selected tabs, sort order) should be router state (query params / route params) whenever possible
- Router state must be the single source of truth to support sharing hyperlinks between sessions
- Components read UI state from the route, not from signals or local variables
- Use `withComponentInputBinding()` (in `provideRouter()`) so route params, query params, and resolved data bind directly to component `input()` signals — avoid injecting `ActivatedRoute` or `Router` whenever possible

**Error handling:**

- **Technical errors** (timeout, network, 5xx): abort navigation, user stays on current page, feedback via toast/notification, no state written to target store
- **Business rejection** (gated resolver): redirect to appropriate route, no UI state for target route

**Responsibilities:**

- Resolver: navigation/UI orchestration only — no business logic
- Store: domain state + business logic
- Guard (`canMatchFn`): route access decisions only — no data loading
- Router state: UI state source of truth for shareable URLs

## Code Style Philosophy

- **Simplicity first** — write the simplest code a human can understand at a glance. Favor clarity over cleverness.
- **Clean Code principles** — meaningful names, small focused functions, single responsibility, no dead code, no unnecessary abstractions
- **Reactive/declarative over imperative** — prefer declarative expressions (signal `computed()`, RxJS pipelines, array methods like `map`/`filter`) over imperative control flow (`for` loops, manual state mutations, step-by-step procedural logic)
- **async/await over promise chains** — always use `async`/`await` instead of `.then()` chains, except when using `Promise.all()` for parallel loading
- **Signals over RxJS** — prefer Angular signals (`signal()`, `computed()`, `effect()`) over RxJS Observables. When RxJS is unavoidable (e.g. `HttpClient`, router events), wrap it in reusable signal-based utilities in `core/utils/` (see `debouncedEffect`, `queryParamSignal`, `breakpointSignal`, `onNavigation`)

## Code Conventions

- **Strict TypeScript** — `strict: true`, `strictTemplates: true`, no implicit returns
- **Type keyword** over interface — enforced by ESLint (`consistent-type-definitions`)
- **Standalone components only** — no NgModules
- **Component prefix**: `app` (selector: `app-*`, directive: `appCamelCase`)
- **Conventional commits** — enforced by commitlint (`feat:`, `fix:`, `chore:`, etc.)
- **Pre-commit hooks**: lint-staged runs ESLint + Prettier on staged files
- **Single quotes** for TypeScript, 2-space indent, trailing newline
- **ES private fields** (`#`) — never TypeScript `private` keyword: `readonly #state`, `readonly #httpClient`
- **`inject()` function only** — no constructor parameter injection: `readonly #http = inject(HttpClient)`
- **File naming**: `state.ts` (stores), `*-backend.ts` (backend services), `*-page.ts` (page components), `*-route.ts` (route configs), `guard.ts` (guards)
- **Default exports** for lazy-loaded page components and route files — enables `loadComponent: () => import('...')` without `.then()`
- **Barrel exports** (`index.ts`) in core subdirectories to expose public API
- **Function-based HTTP interceptors** (`HttpInterceptorFn`) — no class-based interceptors, composed via array in `core/http/index.ts`
- **Signal-based forms** (`@angular/forms/signals`) — `form()`, `required()`, `pattern()`, `validate()`, `submit()` with `signal<T>()` model, template binds via `[formField]`
- **i18n keys**: Uppercase dot-separated hierarchy (`SECTION.KEY`, e.g., `OVERVIEW.TITLE`, `ADD_BLOG.PUBLISH`)

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

- **Framework**: Vitest (via `@angular/build:unit-test`)
- **Environment**: jsdom
- **Spec files**: Co-located with source (`*.spec.ts`)
- **Test selectors**: Use `data-testid` attributes in templates, query via `querySelector('[data-testid="..."]')`
- **Mock services**: Use `MockProvider(ServiceClass)` from `core/mock-provider.ts` — auto-creates `vi.fn()` spies for all methods
- **Isolate child components**: Override children in tests with `.overrideComponent(Child, { set: { template: '<div>Mocked</div>' } })`
