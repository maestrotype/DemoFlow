# DemoFlow — Project Skeleton Architectural Review

> **Version:** 1.0.0  
> **Document Type:** Codebase Skeleton & Quality Assurance Review  
> **Reviewer:** Principal Angular 20 & NestJS Architect  
> **Source Directories:** `/frontend/src/app/`, `/backend/src/`  
> **Last updated:** 2026-06-24

---

## Executive Summary

This document reviews the initial code structure of the DemoFlow project skeletons. The frontend layout is evaluated against **Angular 20/21 best practices, Server-Side Rendering (SSR) safety, Signals-first reactivity, and Feature-Sliced Design (FSD)**. The backend layout is evaluated against **NestJS module standards and Clean Architecture** rules.

Overall, the skeleton establishes a highly structured, scalable foundation. The recommendations below focus on eliminating framework dependency leaks in the backend and optimizing the frontend configuration for long-term scalability.

---

## 1. Architectural Checklist & Assessment

| Area | Status | Evaluation |
|---|:---:|:---|
| **1. Standalone Components** | 🟢 Passed | All layouts, pages, widgets, and features are defined as standalone. No legacy `NgModules` are present. |
| **2. FSD compliance** | 🟢 Passed | Strict separation of layers (`core`, `shared`, `entities`, `features`, `widgets`, `pages`, `layouts`). Import directions flow correctly from high layers to low layers. |
| **3. Route architecture** | 🟢 Passed | Lazy loaded structure using `loadComponent` dynamic imports. Routes are logically structured into Auth, Workspace, and Editor zones. |
| **4. Signals-first architecture** | 🟢 Passed | Components use `signal()` and reactive templates for state representation. No legacy RxJS state containers. |
| **5. Clean Architecture** | 🟡 Alert | Clean folder structures exist, but there is a framework dependency leakage in use-case classes. |
| **6. SSR compatibility** | 🟡 Alert | Components templates are SSR-safe, but canvas containers must be guarded before UI engine integrations. |

---

## 2. Identified Problems

### 2.1 Backend: Framework Dependency Leak in Application Use Cases
*   **The Issue:** `CreateProjectUseCase` ([create-project.use-case.ts](file:///Users/andriidanichkin/Documents/myProjects/DemoFlow/backend/src/application/use-cases/create-project.use-case.ts)) uses NestJS decorators (`@Injectable()` and `@Inject('IProjectRepository')`) directly in the application layer.
*   **The Violation:** Clean Architecture dictates that the **Application layer must be completely independent of the framework**. By importing and using NestJS decorators, the business use case is tightly coupled to the NestJS runtime, making it harder to test or reuse outside of NestJS.
*   **Refactoring Recommendation:** Remove the decorators from the class and register the use case as a factory provider in the module instead.

### 2.2 Frontend: Brittle Relative Imports (FSD Transparency)
*   **The Issue:** Import paths are hardcoded as relative paths, e.g., `import { RecentProjectsComponent } from '../../widgets/recent-projects/recent-projects'`.
*   **The Violation:** While technically functional, relative imports make refactoring brittle. If a page or layout slice is moved, all relative imports break. FSD code is much cleaner when slices are accessed via root path aliases.
*   **Refactoring Recommendation:** Configure tsconfig path mapping aliases for each FSD layer.

---

## 3. Key Risks

### 3.1 Frontend: Hydration and DOM Clashes on Canvas Loading
*   **The Risk:** The Editor Page contains a placeholder for a 16:9 canvas. If an interactive canvas library (like PIXI.js, Canvas2D, or Three.js) is initialized during SSR, the build will crash because browser APIs (`window`, `document`, `WebGLRenderingContext`) do not exist on the Node.js server.
*   **Impact:** Hydration errors and server crashes.
*   **Mitigation:** Enforce strict client-side rendering for the editor component or wrap canvas initialization scripts in `afterNextRender` or `isPlatformBrowser` guards.

### 3.2 Backend: Thread Blocking during Synchronous Media Compiling
*   **The Risk:** Without an out-of-process job queue, executing FFmpeg commands directly inside the main NestJS API thread will block the Node.js event loop, preventing the API from handling incoming HTTP requests.
*   **Impact:** High request latency and timeouts for all users during an active export.
*   **Mitigation:** Design a separate worker service or run FFmpeg commands on a separate thread pool using Node worker threads.

---

## 4. Improvements & Refactoring Recommendations

### 4.1 Reconcile NestJS Clean Architecture
To keep the application layer free of framework dependencies, refactor use cases to use plain TypeScript constructors:

```typescript
// Refactored: Pure TS use case, no decorators
export class CreateProjectUseCase {
  constructor(
    private readonly projectRepository: IProjectRepository
  ) {}

  async execute(workspaceId: string, title: string) {
    return this.projectRepository.create({ workspaceId, title });
  }
}
```

Then register it in the NestJS module using a custom provider:

```typescript
// backend/src/modules/project.module.ts
@Module({
  providers: [
    PrismaService,
    {
      provide: 'IProjectRepository',
      useClass: ProjectRepositoryImpl
    },
    {
      provide: CreateProjectUseCase,
      useFactory: (repo: IProjectRepository) => new CreateProjectUseCase(repo),
      inject: ['IProjectRepository']
    }
  ],
  exports: [CreateProjectUseCase]
})
export class ProjectModule {}
```

### 4.2 Configure Path Aliases in `tsconfig.json`
Update `tsconfig.json` path mapping configurations in both `frontend` and `backend` to avoid long relative paths:

```json
"compilerOptions": {
  "baseUrl": "./",
  "paths": {
    "@core/*": ["src/app/core/*"],
    "@shared/*": ["src/app/shared/*"],
    "@entities/*": ["src/app/entities/*"],
    "@features/*": ["src/app/features/*"],
    "@widgets/*": ["src/app/widgets/*"],
    "@pages/*": ["src/app/pages/*"],
    "@layouts/*": ["src/app/layouts/*"]
  }
}
```

### 4.3 Implement Non-Blocking Angular Hydration (Defer Blocks)
Wrap non-critical widgets (like `app-recent-projects` or the media library grids) in Angular `@defer` blocks to speed up initial page loading times:

```html
<!-- dashboard.ts template -->
<div class="dashboard-page">
  <header class="page-header">
    <h1>Dashboard</h1>
  </header>
  
  @defer (on viewport) {
    <app-recent-projects></app-recent-projects>
  } @placeholder {
    <div class="skeleton-loader">Loading projects...</div>
  }
</div>
```
