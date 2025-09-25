![example workflow](https://github.com/hftm-in2023/blogapp-20/actions/workflows/azure-static-web-apps-calm-plant-0066bdd03.yml/badge.svg)
![example workflow](https://github.com/hftm-in2023/blogapp-20/actions/workflows/ng-update.yml/badge.svg)
![example workflow](https://github.com/hftm-in2023/blogapp-20/actions/workflows/codeql.yml/badge.svg)
![example workflow](https://github.com/hftm-in2023/blogapp-20/actions/workflows/dependabot/dependabot-updates/badge.svg)

# Blogapp20

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Production environment

The website is deployed to: `https://calm-plant-0066bdd03.6.azurestaticapps.net`

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Dependency graph

![Dependency graph](https://raw.githubusercontent.com/hftm-in2023/blogapp-20/refs/heads/main/deps/blogapp-20/_all.png)

## Class Diagramm

```mermaid
classDiagram
    %% Components
    class App {
        <<Component>>
        +isLoading: Signal
        +isAuthenticated: Signal
        +userData: Signal
        +roles: Signal
        +title: string
        +onModeChange(event: string): void
        +login(): void
        +logout(): void
    }

    class BlogOverviewPage {
        <<Component>>
        +model: InputSignal~Model~
        +likeBlog(event: {id: number, likedByMe: boolean}): void
    }

    class BlogDetailPage {
        <<Component>>
        +id: InputSignal~number~
    }

    class AddBlogPage {
        <<Component>>
        +submitButtonDisabled: Signal~boolean~
        +state: Signal
        +formTyped: FormGroup
        +customVaidator(control: AbstractControl): ValidationErrors | null
        +customAsyncValidator(control: AbstractControl): Promise~ValidationErrors | null~
        +onSubmit(): void
    }

    class BlogCard {
        <<Component>>
        +model: InputSignal~Blog~
        +routeCommands: InputSignal~[string, number]~
        +likeBlog: OutputEmitter
    }

    class SidebarComponent {
        <<Component>>
        +isAuthenticated: InputSignal~boolean~
        +roles: InputSignal~string[] | null~
        +userData: InputSignal~any~
        +login: OutputEmitter~void~
        +logout: OutputEmitter~void~
        +initials: Signal~string~
        +canAddBlog: Signal~boolean~
        +isHandset: Signal~boolean~
    }

    class HeaderComponent {
        <<Component>>
        +isAuthenticated: InputSignal~boolean~
        +roles: InputSignal~string[] | null~
        +userData: InputSignal~any~
        +login: OutputEmitter~void~
        +logout: OutputEmitter~void~
        +initials: Signal~string~
        +canAddBlog: Signal~boolean~
    }

    class PageNotFound {
        <<Component>>
    }

    class Demo {
        <<Component>>
        +mode: ModelSignal~ProgressBarMode~
        +value: ModelSignal~number~
        +bufferValue: number
    }

    %% Services
    class AuthStore {
        <<Service>>
        +isAuthenticated: Signal~boolean~
        +userData: Signal
        +auth: Signal
        +token: Signal~string~
        +roles: Signal~string[] | null~
        +login(): void
        +logout(): Promise
    }

    class RouterStore {
        <<Service>>
        +isLoading: Signal~boolean~
        +dispatcher: Dispatcher
        -setLoadingState(value: boolean): void
    }

    class BlogBackend {
        <<Service>>
        +getBlogPosts(): Observable~Entries~
    }

    class Dispatcher {
        <<Service>>
        +action$: Observable~Action~unknown~~
        +dispatch(action: Action~unknown~): void
    }

    class BlogStore {
        <<Service>>
        +state: Signal~BlogState~
        +addBlog(blog: CreatedBlog): Promise~void~
    }

    class GlobalErrorHandler {
        <<Service>>
        +handleError(error: Error): void
        +postCustomData(error: Error, message: string): Promise~void~
    }

    class AddBlogService {
        <<Service>>
        +addBlog(blog: CreatedBlog): Promise
    }

    %% Relationships
    App --> AuthStore : uses
    App --> RouterStore : uses
    App --> SidebarComponent : contains

    BlogOverviewPage --> BlogCard : contains

    AddBlogPage --> BlogStore : uses
    AddBlogPage --> Dispatcher : uses

    SidebarComponent --> BreakpointObserver : uses

    BlogStore --> AddBlogService : uses
    BlogStore --> Router : uses
    BlogStore --> Dispatcher : uses

    RouterStore --> Router : uses
    RouterStore --> Dispatcher : uses

    AuthStore --> OidcSecurityService : uses
```
