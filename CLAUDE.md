# CLAUDE.md - AI Assistant Guide for blogapp-20

## Project Overview

**blogapp-20** is a modern Angular 21 blog application demonstrating best practices for enterprise-grade web development. The application features OIDC authentication via Keycloak, signal-based state management, and a comprehensive CI/CD pipeline.

- **Framework**: Angular 21 (standalone components)
- **Language**: TypeScript 5.9.3 (strict mode)
- **UI**: Angular Material (azure-blue theme)
- **Authentication**: OIDC via angular-auth-oidc-client (Keycloak)
- **State Management**: Custom Signal-based stores
- **Build System**: Angular CLI with esbuild
- **Testing**: Jasmine + Karma
- **Deployment**: Azure Static Web Apps
- **Production URL**: https://calm-plant-0066bdd03.6.azurestaticapps.net

## Architecture and Tech Stack

### Core Technologies

```json
{
  "framework": "@angular/core@21.0.1",
  "ui": "@angular/material@21.0.0",
  "auth": "angular-auth-oidc-client@20.0.0",
  "i18n": "@ngx-translate/core@17.0.0",
  "validation": "zod@4.1.5",
  "state": "Angular Signals (built-in)",
  "routing": "@angular/router@21.0.1"
}
```

### Architectural Patterns

1. **Standalone Components** - No NgModules, all components are standalone
2. **Signal-Based Reactivity** - Using Angular Signals throughout for state management
3. **OnPush Change Detection** - All components use `ChangeDetection.OnPush`
4. **Lazy Loading** - All routes lazy-load components using dynamic imports
5. **Functional Patterns** - Guards, resolvers, and interceptors use functional approach
6. **Custom Store Pattern** - Signal-based stores for state management
7. **Event Dispatcher** - Central event bus for cross-cutting concerns

## Directory Structure

```
blogapp-20/
├── .github/workflows/          # CI/CD pipelines
│   ├── ci-build.yml           # Tests and build on PR/push
│   ├── azure-static-web-apps-*.yml  # Azure deployment
│   ├── codeql.yml             # Security scanning
│   └── ng-update.yml          # Automated Angular updates
├── .husky/                     # Git hooks (pre-commit, commit-msg)
├── .vscode/                    # VS Code configuration
├── public/i18n/                # Translation files (en.json, de.json)
├── src/
│   ├── app/
│   │   ├── core/               # Core application functionality
│   │   │   ├── auth/           # OIDC authentication (state, guard, config)
│   │   │   ├── blog/           # Blog backend service & resolver
│   │   │   ├── error/          # Global error handling
│   │   │   ├── events/         # Event dispatcher pattern
│   │   │   ├── http/           # HTTP interceptors (logging, correlation)
│   │   │   ├── layout/         # Layout components (header, sidebar)
│   │   │   ├── state/          # Router state management
│   │   │   └── static/         # Static pages (404)
│   │   ├── feature/            # Feature modules (pages)
│   │   │   ├── add-blog/       # Add blog page (protected route)
│   │   │   ├── blog-detail/    # Blog detail view
│   │   │   ├── blog-overview/  # Blog list/overview
│   │   │   └── demo/           # Demo components
│   │   ├── shared/             # Shared/reusable components
│   │   │   └── blog-card/      # Blog card component
│   │   ├── app.ts              # Root component
│   │   ├── app.config.ts       # Application providers
│   │   └── app.routes.ts       # Root routing configuration
│   ├── environments/           # Environment configurations
│   │   ├── environment.ts      # Production config
│   │   └── environment.development.ts  # Development config
│   ├── main.ts                 # Application bootstrap
│   ├── styles.scss             # Global styles
│   └── silent-renew.html       # OIDC silent token renewal
├── angular.json                # Angular CLI configuration
├── eslint.config.js            # ESLint configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── staticwebapp.config.json    # Azure Static Web App config
```

### Directory Organization Principles

- **core/** - Singleton services, stores, guards, and app-wide features (never imported in shared/)
- **feature/** - Page-level components (routed components), can use core/ and shared/
- **shared/** - Reusable presentational components (can only depend on other shared/)

## Key Patterns and Conventions

### 1. Signal-Based State Management

All state stores follow this pattern:

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleStore {
  // Private signal for internal state
  readonly #state = signal<StateType>(initialState);

  // Public computed selectors (readonly)
  readonly someValue = computed(() => this.#state().someValue);

  constructor() {
    // Attach to store logger for debugging
    storeLogger.attachState(this.#state, { name: 'ExampleStore' });
  }

  // Actions mutate state
  updateState(newValue: string) {
    this.#state.update(state => ({ ...state, someValue: newValue }));
  }
}
```

**Key Conventions**:
- Private state signals use `#` prefix
- Public selectors are computed signals
- Always use `asReadonly()` or computed for public API
- Register with `storeLogger` for debugging
- State updates use `.update()` or `.set()`

**Existing Stores**:
- `AuthStore` (`src/app/core/auth/state.ts`) - Authentication state from OIDC
- `RouterStore` (`src/app/core/state/router.ts`) - Router loading state
- Feature stores in respective feature directories

### 2. Component Patterns

All components follow these conventions:

```typescript
import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './example.html',
  styleUrl: './example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {
  // Signal inputs (required or optional)
  title = input.required<string>();
  count = input<number>(0);

  // Signal outputs
  clicked = output<void>();

  // Computed signals for derived state
  displayText = computed(() => `${this.title()}: ${this.count()}`);

  handleClick() {
    this.clicked.emit();
  }
}
```

**Key Conventions**:
- **Always** use `ChangeDetection.OnPush`
- **Always** use `standalone: true`
- Use signal inputs: `input()` or `input.required<T>()`
- Use signal outputs: `output<T>()`
- Use `computed()` for derived values
- Lazy-loaded components use **default export**
- Shared components use **named export**
- File naming: kebab-case matching component selector
- Template deferral: Use `@defer` for images and heavy components

### 3. Routing Patterns

Routes defined in `app.routes.ts`:

```typescript
export const APP_ROUTES: Routes = [
  {
    path: 'example/:id',
    loadComponent: () => import('./feature/example/example-page'),
    canActivate: [() => import('./core/auth/guard')],
    resolve: { data: () => import('./core/example/resolver') },
  },
];
```

**Key Conventions**:
- All routes use lazy loading with dynamic imports
- Guards use functional pattern: `CanActivateFn`
- Resolvers use functional pattern: `ResolveFn`
- Route params automatically bound to component inputs via `withComponentInputBinding()`
- Protected routes use `authGuard` (checks authentication + 'user' role)

**Existing Routes**:
- `/` → redirects to `/overview`
- `/overview` → Blog list (always runs resolver)
- `/detail/:id` → Blog detail (`:id` bound to component input)
- `/add-blog` → Add blog form (protected by `authGuard`)
- `/demo` → Demo components
- `/error` → Error page
- `/**` → 404 page

### 4. Authentication Pattern

OIDC authentication using `angular-auth-oidc-client`:

```typescript
// AuthStore wraps OidcSecurityService
export class AuthStore {
  // Convert OIDC observable to signal
  readonly #authentication = toSignal(
    this.#oidcSecurityService.checkAuth(),
    { initialValue: initialState }
  );

  // Computed selectors
  isAuthenticated = computed(() => this.#authentication().isAuthenticated);
  token = computed(() => this.#authentication().accessToken);

  // Decode JWT to extract roles
  roles = computed(() => {
    const token = this.token();
    if (!token) return null;
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken?.realm_access?.roles || [];
  });

  // Actions
  login() {
    this.#oidcSecurityService.authorize();
  }

  logout() {
    return lastValueFrom(this.#oidcSecurityService.logoff());
  }
}
```

**Auth Guard Pattern**:

```typescript
export const authGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const roles = await authStore.roles();
  return authStore.isAuthenticated() && roles?.includes('user')
    ? true
    : (authStore.login(), false);
};
```

**Configuration**:
- Provider: Keycloak OIDC
- Flow: Authorization Code with PKCE
- Silent token renewal via iframe (`silent-renew.html`)
- Token renewal 10 seconds before expiration
- Scopes: `openid profile email offline_access`

### 5. HTTP and Backend Integration

Backend services use this pattern:

```typescript
import { HttpClient } from '@angular/common/http';
import { z } from 'zod';
import { lastValueFrom } from 'rxjs';

// Zod schemas for runtime validation
const EntrySchema = z.object({
  id: z.number(),
  title: z.string(),
  // ... more fields
});

type Entry = z.infer<typeof EntrySchema>;

@Injectable({ providedIn: 'root' })
export class ExampleBackend {
  readonly #http = inject(HttpClient);
  readonly #serviceUrl = inject(ENVIRONMENT).serviceUrl;

  getEntries() {
    return this.#http.get(`${this.#serviceUrl}/entries`).pipe(
      // Runtime validation with Zod
      map(data => EntriesSchema.parse(data))
    );
  }

  async createEntry(entry: CreateEntry) {
    return lastValueFrom(
      this.#http.post(`${this.#serviceUrl}/entries`, entry)
    );
  }
}
```

**HTTP Interceptors** (functional pattern):
1. **Logging Interceptor** - Logs all requests/responses
2. **Correlation Interceptor** - Adds `x-correlation-id` header
3. **Auth Interceptor** - Adds bearer token (from OIDC library)

**Key Conventions**:
- Always use Zod schemas for API response validation
- Use `z.infer<>` to derive TypeScript types
- Private service fields use `#` prefix
- Convert observables to promises with `lastValueFrom()` when needed
- Environment-based URLs via `inject(ENVIRONMENT)`

### 6. Forms Pattern

Reactive forms with signal integration:

```typescript
export class FormComponent {
  readonly #fb = inject(FormBuilder);

  formTyped = this.#fb.group({
    title: this.#fb.control('', [Validators.required]),
    content: this.#fb.control('', [
      Validators.required,
      this.customValidator
    ], [this.customAsyncValidator]),
  });

  // Computed from form state
  submitButtonDisabled = computed(() =>
    this.formTyped.invalid || this.formTyped.pristine
  );

  customValidator(control: AbstractControl): ValidationErrors | null {
    return control.value?.length > 100 ? { tooLong: true } : null;
  }

  async customAsyncValidator(control: AbstractControl) {
    // Async validation logic
    return null;
  }

  onSubmit() {
    if (this.formTyped.valid) {
      const value = this.formTyped.value;
      // Submit logic
    }
  }
}
```

### 7. Testing Patterns

Tests follow AAA pattern (Arrange-Act-Assert):

```typescript
describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ExampleComponent,
        MockComponent(OtherComponent),
      ],
      providers: [
        MockProvider(ExampleService),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });

  it('should display title', () => {
    // Arrange
    fixture.componentRef.setInput('title', 'Test Title');

    // Act
    fixture.detectChanges();

    // Assert
    const element = fixture.nativeElement.querySelector('[data-testid="title"]');
    expect(element.textContent).toContain('Test Title');
  });
});
```

**Testing Utilities**:
- `MockComponent()` - Auto-generates component mocks with signal inputs/outputs
- `MockProvider()` - Auto-generates service mocks with Jasmine spies
- Use `data-testid` attributes for test selectors
- Set signal inputs via `fixture.componentRef.setInput()`

## Development Workflow

### Initial Setup

```bash
# Install dependencies
npm ci

# Start development server
npm start
# App runs at http://localhost:4200

# Run tests in watch mode
npm test

# Run tests for CI (headless)
npm run test:ci

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

### Git Workflow

This project uses **Husky** for Git hooks and enforces quality standards:

**Pre-commit Hook** (`.husky/pre-commit`):
- Runs `lint-staged` on staged files
- Automatically runs ESLint with `--fix`
- Automatically runs Prettier formatting
- Staged files: `*.{ts,js,html,css,scss,less,md}`

**Commit Message Hook** (`.husky/commit-msg`):
- Enforces Conventional Commits format
- Format: `type(scope): message`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Examples:
  - `feat: add blog filtering`
  - `fix: resolve auth token refresh issue`
  - `refactor: simplify router store logic`
  - `chore: update dependencies`

**Commit Workflow**:
```bash
# Stage files
git add .

# Commit (will trigger hooks)
git commit -m "feat: add new feature"

# If hooks fail, fix issues and retry
npm run format  # Fix formatting
npm run lint    # Fix linting
git add .
git commit -m "feat: add new feature"
```

### Branch Strategy

- **main** - Production branch (protected)
- **feature/** - Feature branches
- **fix/** - Bug fix branches
- **chore/** - Maintenance branches

### Making Changes

When implementing features or fixes:

1. **Read Before Modifying** - Always read existing code before making changes
2. **Follow Existing Patterns** - Match the patterns shown in this guide
3. **Use Signals** - All new state should use Angular Signals
4. **OnPush Only** - All components must use `OnPush` change detection
5. **Test Your Changes** - Add/update tests for new functionality
6. **Run Checks** - Ensure tests pass and linting is clean before committing

### Code Generation

Use Angular CLI schematics for consistency:

```bash
# Generate component (creates standalone component with OnPush)
ng generate component feature/example-page

# Generate service
ng generate service core/example/example-backend

# Generate guard (functional)
ng generate guard core/auth/role-guard

# Generate resolver (functional)
ng generate resolver core/data/data-resolver
```

## Testing Guidelines

### Test Structure

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName, ...dependencies],
      providers: [...mockProviders],
    }).compileComponents();
  });

  it('should do something specific', () => {
    // Arrange - setup test data and conditions

    // Act - execute the behavior being tested

    // Assert - verify expected outcomes
  });
});
```

### Testing Best Practices

1. **Test Behavior, Not Implementation** - Focus on what the component does, not how
2. **Use data-testid** - Add `[attr.data-testid]="'element-name'"` to elements for reliable selection
3. **Mock Dependencies** - Use `MockComponent()` and `MockProvider()` utilities
4. **Test Signal Inputs** - Use `fixture.componentRef.setInput('name', value)`
5. **Test Outputs** - Spy on output emissions
6. **Trigger Change Detection** - Call `fixture.detectChanges()` after state changes
7. **Test Edge Cases** - Cover error states, empty states, loading states

### Running Tests

```bash
# Watch mode (interactive)
npm test

# CI mode (headless, with coverage)
npm run test:ci

# Coverage report generated in coverage/
```

### Coverage Requirements

- Maintain high coverage for critical paths
- Focus on business logic and user interactions
- All new features should include tests

## Deployment Process

### CI/CD Pipeline

**On Push/PR to main**:
1. **CI Build** (`.github/workflows/ci-build.yml`):
   - Node 20.19.1
   - `npm ci` - Clean install
   - `npm run test:ci` - Run tests with coverage
   - `npm run build` - Production build

2. **CodeQL** - Security scanning
3. **Azure Static Web Apps** - Automated deployment
   - Build: `npm run build`
   - Output: `dist/blogapp-20/browser`
   - Deploy to production
   - Preview deployments for PRs

**Automated Updates**:
- **Dependabot** - Weekly dependency updates
- **ng-update** - Automated Angular framework updates

### Build Configuration

**Production Build**:
```bash
npm run build
```

**Output**: `dist/blogapp-20/browser/`

**Build Budgets** (enforced):
- Initial bundle: 500kB warning, 1MB error
- Component styles: 4kB warning, 8kB error

**Environment Files**:
- Production: `src/environments/environment.ts`
- Development: `src/environments/environment.development.ts`

File replacement happens automatically based on configuration.

### Deployment Targets

- **Production**: https://calm-plant-0066bdd03.6.azurestaticapps.net
- **Backend API**: Azure Container Apps (configured in environment files)

## Code Quality Standards

### Linting Rules (ESLint)

```javascript
// Key rules enforced:
{
  "@typescript-eslint/consistent-type-definitions": ["error", "type"],  // Use 'type' not 'interface'
  "@angular-eslint/directive-selector": ["error", { prefix: "app" }],
  // + all typescript-eslint recommended rules
  // + all angular-eslint recommended rules
  // + template accessibility rules
}
```

### Formatting (Prettier)

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for TypeScript
- **Line Width**: 80 characters (default)
- **Trailing Commas**: ES5
- **Semicolons**: Always

### TypeScript Configuration

**Strict Mode Enabled**:
```json
{
  "strict": true,
  "noImplicitOverride": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "strictNullChecks": true,
  "strictPropertyInitialization": true
}
```

### Code Conventions

**Naming**:
- **Components**: PascalCase (e.g., `BlogCard`, `BlogOverviewPage`)
- **Files**: kebab-case (e.g., `blog-card.ts`, `blog-overview-page.ts`)
- **Services**: PascalCase with suffix (e.g., `BlogBackend`, `AuthStore`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `APP_ROUTES`, `ERROR_ROUTES`)
- **Private fields**: `#` prefix (e.g., `#state`, `#http`)

**File Organization**:
```typescript
// 1. Imports (grouped: Angular, 3rd party, local)
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ExampleService } from './example.service';

// 2. Constants and types
const INITIAL_STATE = {};
type StateType = {};

// 3. Component/Service/Class
@Component({...})
export class ExampleComponent {
  // 3a. Injected dependencies
  readonly #service = inject(ExampleService);

  // 3b. Signal inputs/outputs
  title = input.required<string>();
  clicked = output<void>();

  // 3c. Local state signals
  #count = signal(0);

  // 3d. Computed signals
  displayText = computed(() => `Count: ${this.#count()}`);

  // 3e. Lifecycle hooks
  ngOnInit() {}

  // 3f. Public methods
  handleClick() {}

  // 3g. Private methods
  #updateCount() {}
}

// 4. Default export (for lazy-loaded components)
export default ExampleComponent;
```

## Common Tasks and Commands

### Development

```bash
# Start dev server
npm start

# Start dev server on different port
ng serve --port 4300

# Build for development
npm run watch

# Generate dependency graph
npm run analyze:deps:all
```

### Testing

```bash
# Run tests (watch mode)
npm test

# Run tests (CI mode)
npm run test:ci

# Run tests with coverage
ng test --code-coverage
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
ng lint --fix

# Format code
npm run format

# Format specific files
npx prettier --write ./src/app/feature/example/*
```

### Building

```bash
# Production build
npm run build

# Development build
ng build --configuration=development

# Build with stats
ng build --stats-json
```

### Debugging

The application includes a custom **Store Logger** for debugging signal state:

- Open browser console
- State changes automatically logged in development
- Shows store name and current state
- Registered stores: `AuthStore`, `RouterStore`, feature stores

## Important Notes for AI Assistants

### When Making Changes

1. **Always Read First** - Never modify code without reading it first
2. **Match Existing Patterns** - Follow the patterns documented here
3. **Use Signals** - All new reactive state must use Angular Signals
4. **No NgModules** - This is a standalone component architecture
5. **OnPush Required** - All components must use `ChangeDetection.OnPush`
6. **Type Safety** - Use Zod for runtime validation, strict TypeScript for compile-time
7. **Test Coverage** - Add tests for new functionality
8. **Lazy Loading** - All routes should lazy-load their components

### Common Pitfalls to Avoid

1. **Don't use NgModules** - Use standalone components with `imports` array
2. **Don't use services for component state** - Use local signals in components
3. **Don't use BehaviorSubject/Subject for state** - Use Angular Signals
4. **Don't skip change detection strategy** - Always specify `OnPush`
5. **Don't create barrel exports (index.ts) unnecessarily** - Only where needed
6. **Don't use `interface`** - ESLint enforces `type` definitions
7. **Don't forget Zod validation** - All API responses should be validated
8. **Don't use relative imports for core/** - Use `@angular/*` or full paths

### Signal vs RxJS

**When to use Signals**:
- Component state
- Store state
- Derived values (computed)
- Inputs/outputs

**When to use RxJS**:
- HTTP requests
- Complex async operations
- Event streams
- Time-based operations

**Converting between them**:
- Observable → Signal: `toSignal(observable$, { initialValue })`
- Signal → Observable: `toObservable(signal)`

### Authentication Flow

When working with authenticated routes:

1. User not authenticated → `authGuard` triggers `login()`
2. User redirected to Keycloak
3. After successful auth, redirected back with tokens
4. Token stored and auto-renewed before expiration
5. Token decoded to extract roles from `realm_access.roles`
6. Components check `isAuthenticated()` and `roles()` for UI rendering

### Debugging Tips

1. **Store State** - Check console for store logger output
2. **Router Events** - Watch for NavigationStart/End events
3. **HTTP Requests** - Logging interceptor logs all requests
4. **Auth Issues** - Check `AuthStore` signals in console
5. **Form Validation** - Check form controls: `formGroup.controls.fieldName.errors`

## Key Files Reference

| Purpose | File Path |
|---------|-----------|
| **App Config** | `src/app/app.config.ts` |
| **Routes** | `src/app/app.routes.ts` |
| **Auth Store** | `src/app/core/auth/state.ts` |
| **Auth Guard** | `src/app/core/auth/guard.ts` |
| **Auth Config** | `src/app/core/auth/auth.config.ts` |
| **Router Store** | `src/app/core/state/router.ts` |
| **Event Dispatcher** | `src/app/core/events/dispatcher.ts` |
| **Blog Backend** | `src/app/core/blog/blog-backend.ts` |
| **Error Handler** | `src/app/core/error/global-error-handler.ts` |
| **HTTP Interceptors** | `src/app/core/http/*.ts` |
| **Test Utilities** | `src/app/core/testing/*.ts` (if exists) |
| **Environment** | `src/environments/environment*.ts` |
| **Angular Config** | `angular.json` |
| **TypeScript Config** | `tsconfig.json` |
| **ESLint Config** | `eslint.config.js` |
| **Package Info** | `package.json` |

## Additional Resources

- **README.md** - Basic setup and running instructions
- **Class Diagram** - See README.md for Mermaid diagram of architecture
- **Dependency Graph** - `deps/blogapp-20/_all.png`
- **Angular Docs** - https://angular.dev
- **Material Design** - https://material.angular.io
- **OIDC Client** - https://github.com/damienbod/angular-auth-oidc-client

---

**Last Updated**: 2025-12-10
**Angular Version**: 21.0.1
**Node Version**: 20.19.1
