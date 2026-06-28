# AI Progress — DemoFlow

## Architecture
- Angular 21 (Standalone Components)
- Feature-Sliced Design (FSD)
- SSR enabled
- NestJS backend

## Completed
- Workspace architecture created
- Auth layouts created
- Editor layouts created
- Sidebar / Topbar / RecentProjects widgets
- Project structure aligned with FSD
- SSR configuration cleaned
- Routing restored after broken app.routes.ts
- SSR prerender fixed for dynamic routes using mixed rendering mode (Prerender + Server)
- Theme system implemented with SSR support
- Theme toggle component created and registered in shared UI barrel exports
- AuthGuard migrated from deprecated class-based CanActivate to functional CanActivateFn

## Current Status
SSR build succeeds with mixed rendering mode:
- Static routes (`/`, `/dashboard`, `/projects`) use Prerender for SEO benefits
- Dynamic routes (`/projects/:id/editor`, `/demo/:shareId`) use Server rendering
- Auth routes and fallback routes use Server rendering

Theme system implemented:
- ThemeService with dark/light/system modes
- CSS custom properties for theme tokens (32 variables)
- System preference detection via `prefers-color-scheme`
- Local storage persistence for user preferences
- SSR-safe implementation using `PLATFORM_ID` and `isPlatformBrowser()`
- ThemeToggleComponent with OnPush change detection
- ResolvedTheme computed signal for reactive theme application
- Media query listener for system theme changes (system mode only)
AuthGuard migrated to functional API:
- Replaced class-based CanActivate with functional CanActivateFn
- Uses inject() for Router dependency injection
- Compatible with Angular 21 standalone APIs

## Completed (Latest Update)
- P0: Fixed href issues in register.ts and forgot-password.ts by replacing `<a href>` with `[routerLink]`
- P0: Registered `provideHttpClient(withInterceptors([authInterceptor]))` in app.config.ts
- P0: Updated test to reflect current state of app.html (only `<router-outlet />`)
- P0: Verified SSR build succeeds with mixed rendering mode
- P0: All tests passing

### P0 — Must Fix Before Any Feature Work

- [x] **Delete scaffold `app.html`** — 345 lines of Angular "Hello, frontend" boilerplate still ships to production. Keep only `<router-outlet />`.
- [x] **Register `provideHttpClient(withInterceptors([authInterceptor]))`** in `app.config.ts` — without it, all HTTP features crash at runtime. The `authInterceptor` exists but is never registered.
- [x] **Fix SSR route config** (`app.routes.server.ts`) — wildcard `RenderMode.Prerender` on `projects/:id/editor` and `demo/:shareId` crashes the build. Use `RenderMode.Server` or `RenderMode.Client` for dynamic segments.
- [x] **Replace all `<a href>` with `[routerLink]`** in `sidebar.ts`, `login.ts`, `register.ts`, `forgot-password.ts` — causes full page reload, destroys SPA state.

> ✅ All P0 tasks completed. Build and tests passing.

### Component Structure Normalization (Batch 1 - Completed)
- [x] **Normalize ThemeToggleComponent** — converted inline template/styles to external files (`theme-toggle.html`, `theme-toggle.scss`)
- [x] **Normalize RegisterPageComponent** — converted inline template/styles to external files (`register.html`, `register.scss`)
- [x] **Normalize ForgotPasswordPageComponent** — converted inline template/styles to external files (`forgot-password.html`, `forgot-password.scss`)
- [x] **Normalize ProjectCardComponent** — converted inline template/styles to external files (`project-card.html`, `project-card.scss`)

> ✅ Batch 1 completed: All components follow proper Angular structure with external template and style files. Build verified successful, SSR compatibility preserved, no behavior changes made.

## Frontend Fixes Required (from FRONTEND_AUDIT.md — 2026-06-25)

> Audit score: ThemeForest Readiness 32/100 · Architecture 62/100 · Maintainability 55/100
> Shared UI adoption: **0/15 components consumed** (critical).

### P1 — Architecture Integrity

- [ ] **Wire `ThemeService`** — inject in `App` component, use `effect()` to apply `document.documentElement.dataset['theme']`, guard with `isPlatformBrowser()`. Currently defined but never injected anywhere.
- [ ] **Adopt shared-ui components** — replace all inline `<button>`, `<input>` with `<app-button>`, `<app-input>` across pages/features/widgets. At least 8 different ad-hoc `.btn-*` classes defined inline.
- [ ] **Migrate `AuthGuard`** from deprecated class-based `CanActivate` to functional `CanActivateFn`. Register on protected routes (currently not used in any route).
- [ ] **Migrate `@Input()` to `input()`** in `AuthFormComponent`. Add `output()` for form submission (currently `onSubmit()` does nothing).
- [ ] **Add barrel exports** (`index.ts`) for `entities/`, `features/`, `widgets/`, `layouts/`, `pages/` layers — only `shared/ui/` has them.
- [ ] **Consolidate modal + dialog** — `ModalComponent` and `DialogComponent` are near-identical. Merge into one overlay component.

### P2 — Accessibility & Theme

- [ ] Associate labels with inputs in `AuthFormComponent` (add `id` to inputs, `for` to labels)
- [ ] Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, Escape handler to modal/dialog
- [ ] Replace hardcoded hex colors in `pages/player/player.ts` (`#000`, `#111`, `#333`, `#888`) with design tokens
- [ ] Add `prefers-reduced-motion` wrapper to `shared/styles/mixins/animations.scss`
- [ ] Add skip-nav link to workspace layout

## History
2026-06-26 — Created docs/AI_PROGRESS.md (this file)
2026-06-26 — Fixed SSR prerender failures for dynamic routes using mixed rendering mode
2026-06-27 — Merged frontend audit open issues from FRONTEND_AUDIT.md
2026-06-27 — Implemented complete theme system with SSR support, ThemeToggleComponent, and system preference detection
2026-06-27 — Migrated AuthGuard from class-based CanActivate to functional CanActivateFn
2026-06-27 — Completed P0 tasks: fixed href issues, registered HttpClient with authInterceptor, updated tests, verified build and tests passing
2026-06-28 — Completed component structure normalization (Batch 1): converted ThemeToggle, Register, ForgotPassword, and ProjectCard components from inline templates/styles to proper external file structure per Angular Style Guide

