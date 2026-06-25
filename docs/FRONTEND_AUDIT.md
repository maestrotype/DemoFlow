# Frontend Audit — DemoFlow

> **Audited:** 2026-06-25  
> **Stack:** Angular 21.x · Standalone · SSR (`@angular/ssr`) · Signals API · SCSS Design Tokens  
> **Scope:** Every file under `frontend/src/`  
> **Total source files:** 116 (15 shared-ui components, 3 features, 4 widgets, 3 layouts, 7 pages, 3 entities, 2 core services, 7 token files, 2 theme files, 3 mixins, app scaffolding)

---

## Scores

| Dimension | Score | Rationale |
|---|:---:|---|
| **ThemeForest Readiness** | **32 / 100** | 15 shared-ui components exist but **zero are imported anywhere**. All pages re-implement ad-hoc buttons/inputs inline. The default Angular scaffold template (`app.html` — 345 lines of "Hello, frontend" boilerplate) is still shipping. No routing works via SPA links. No theme switching wired. No a11y. Not reviewable as a product. |
| **Architecture** | **62 / 100** | FSD layer structure is correct and import directions are clean. However: no barrel exports outside `shared/ui`, `AuthGuard` uses deprecated class API, `authInterceptor` is never registered, `ThemeService` is disconnected, `EditorPage` absorbs layout responsibility. |
| **Maintainability** | **55 / 100** | Consistent token usage is a strong foundation, but the complete disconnect between shared-ui layer and consuming components means any future change requires hunting through inline styles. `any` types in entity models, zero test coverage beyond the scaffold spec, and duplicated overlay components (modal + dialog) add friction. |

---

## 1. Strengths

### 1.1 Clean FSD Layer Hierarchy
The directory tree faithfully implements all seven FSD layers (`core → shared → entities → features → widgets → layouts → pages`). Import directions follow the rule: **pages → widgets/features → entities → shared**. No cross-layer or upward imports were found.

### 1.2 Shared UI Foundation is Well-Designed
The 15 components in `shared/ui/` are the strongest code in the project:
- Every component uses `ChangeDetectionStrategy.OnPush`
- Modern signal-based inputs (`input()`, `input.required()`, `computed()`, `output()`)
- Proper barrel exports with `index.ts` per component and a root `shared/ui/index.ts`
- Separated concerns: `.ts`, `.html`, `.scss`, `.types.ts`
- `ButtonComponent` — 5 variants × 4 sizes, focus-ring mixin, transition animations

### 1.3 Design Token System
Complete token coverage across 7 files:
| Token file | Variables |
|---|---|
| `tokens/colors.scss` | 5 HSL brand color sets |
| `tokens/spacing.scss` | 15 spacing values (`--space-0` → `--space-32`) |
| `tokens/typography.scss` | Font stacks + 12 size values |
| `tokens/radius.scss` | 7 radius values |
| `tokens/shadows.scss` | 4 shadow values incl. glow accent |
| `tokens/motion.scss` | 4 durations + 4 easing curves |
| `tokens/z-index.scss` | 6 z-index layers |

### 1.4 Theme System Exists
Both `themes/dark.scss` and `themes/light.scss` are fully populated. `styles.scss` correctly imports all tokens and both themes globally. The body element picks up base dark-theme variables.

### 1.5 Routing is Lazy-Loaded
All routes in `app.routes.ts` use `loadComponent()` for code-splitting. The three layout zones (Auth, Workspace, Editor) are properly structured with nested `<router-outlet>`.

### 1.6 Inline Styles Reference Tokens
Even though components duplicate button/input styles, **most** inline styles correctly reference CSS custom properties with fallbacks:
```css
background: var(--color-bg-surface, #16182a);   /* ✓ */
padding: var(--space-6, 24px);                   /* ✓ */
border-radius: var(--radius-md, 10px);           /* ✓ */
```

---

## 2. Violations

### 2.1 FSD Compliance

| # | Severity | File | Issue |
|---|---|---|---|
| F1 | 🔴 High | All pages, features, widgets | **No barrel exports** — only `shared/ui/` has `index.ts`. Layers `entities/`, `features/`, `widgets/`, `layouts/`, `pages/` have no public API contracts. Any file can import any deep path. |
| F2 | 🟡 Medium | `pages/editor/editor.ts` L16-32 | **Layout logic in page** — the three-panel layout (sidebar-left, canvas, sidebar-right) belongs in `EditorLayoutComponent`, which currently is a thin pass-through. The page absorbs layout responsibility. |
| F3 | 🟡 Medium | `pages/projects/projects.ts` L14 | **Widget misuse** — `ProjectsPageComponent` imports `RecentProjectsComponent` (designed for dashboard "recent" display) to render "all projects". Should have a dedicated `ProjectListWidget` or parameterize the existing one. |
| F4 | 🟢 Low | `entities/` layer | **No entity services** — entity models exist but there are no repository/API services in the entities layer. All data is empty `signal([])` mocks with no data-fetching infrastructure. |

### 2.2 Standalone Compliance

| # | Severity | File | Issue |
|---|---|---|---|
| S1 | 🔴 High | `core/auth/auth.guard.ts` L1-14 | **Deprecated class-based guard** — uses `@Injectable` + `implements CanActivate` which was deprecated in Angular 15. Must migrate to functional `CanActivateFn`. |
| S2 | 🔴 High | `core/auth/auth.guard.ts` L2 | **Deprecated import** — `CanActivate` is imported from `@angular/router` but the class-based guard interface was deprecated. |
| S3 | 🟡 Medium | `features/auth-form/auth-form.ts` L54 | **Uses `@Input()` decorator** instead of `input()` signal. Inconsistent with `ProjectCardComponent` (`input.required<>()`) and all shared-ui components. |
| S4 | 🟡 Medium | `app.html` L1-345 | **Default Angular scaffold template still present** — 345 lines of "Hello, frontend" boilerplate rendered alongside `<router-outlet>`. This ships to production. |
| S5 | 🟡 Medium | `app.spec.ts` L21 | **Broken test assertion** — expects `<h1>` containing "Hello, frontend" which only exists in the scaffold template, not the routed app. |

### 2.3 SSR Compliance

| # | Severity | File | Issue |
|---|---|---|---|
| R1 | 🔴 Critical | `app.routes.server.ts` L3-8 | **Wildcard prerender will crash** — `path: '**', renderMode: RenderMode.Prerender` applies prerender to parameterized routes (`projects/:id/editor`, `demo/:shareId`). Angular SSR cannot resolve `:id` or `:shareId` at build time. Must use `RenderMode.Server` or `RenderMode.Client` for dynamic segments. |
| R2 | 🔴 High | `app.config.ts` L7-12 | **`provideHttpClient()` is missing** — without it, any `HttpClient` injection will throw at runtime. The `authInterceptor` is defined but can never execute. |
| R3 | 🔴 High | `app.config.ts` L7-12 | **`authInterceptor` never registered** — the functional interceptor exists in `core/auth/auth.interceptor.ts` but is never passed to `withInterceptors([authInterceptor])` in the provider config. |
| R4 | 🟡 Medium | `core/theme/theme.service.ts` L6-13 | **Theme signal disconnected from DOM** — `ThemeService` holds a `signal<'dark'\|'light'>('dark')` and `toggleTheme()`, but **never applies `data-theme` attribute** to `document.documentElement`. The light theme in `themes/light.scss` targets `[data-theme="light"]` which is never set. Additionally, `ThemeService` is not injected anywhere. |
| R5 | 🟡 Medium | `pages/player/player.ts` L25-27 | **Hardcoded colors bypass theme** — `background: #000`, `background: #111`, `color: #fff`, `color: #888`, `border: 1px solid #333`. Should use `--color-bg-*` and `--color-text-*` tokens. |
| R6 | 🟡 Medium | `pages/editor/editor.ts` L84 | **Hardcoded `background: black`** on `.virtual-canvas`. Should use a token. |

### 2.4 Signal Usage

| # | Severity | File | Issue |
|---|---|---|---|
| G1 | ✅ Good | `core/theme/theme.service.ts` L8 | `currentTheme = signal<'dark'\|'light'>('dark')` — correct signal usage |
| G2 | ✅ Good | `app.ts` L11 | `title = signal('frontend')` — correct (though value is unused in routed app) |
| G3 | ✅ Good | `widgets/recent-projects/recent-projects.ts` L47 | `projects = signal<Project[]>([])` — correct |
| G4 | ✅ Good | `widgets/timeline/timeline.ts` L76 | `scenes = signal<Scene[]>([])` — correct |
| G5 | ✅ Good | `entities/project/project-card/project-card.ts` L59 | `project = input.required<Project>()` — correct signal input |
| G6 | ✅ Good | All 15 `shared/ui/` components | Consistently use `input()`, `computed()`, `output()` — exemplary |
| G7 | 🟡 Violation | `features/auth-form/auth-form.ts` L54 | `@Input() mode` — only component using decorator-based input. Should use `input<>()`. |
| G8 | 🟡 Gap | Entire codebase | **No `effect()` usage** — `ThemeService.toggleTheme()` updates the signal but no `effect()` reacts to apply the DOM change. |
| G9 | 🟡 Gap | Entire codebase | **No reactive data fetching** — all widget signals hold `[]` with no `toSignal()`, `rxResource()`, or service calls. |

### 2.5 Component Boundaries

| # | Severity | File | Issue |
|---|---|---|---|
| B1 | 🔴 Critical | Entire codebase | **Zero shared-ui components are imported outside `shared/ui/`** — grep for `shared/ui` in all `.ts` files outside shared returns 0 results. Pages redefine `.submit-btn`, `.create-btn`, `.trigger-btn`, `.action-btn`, `.back-btn`, `.export-btn`, `.play-btn`, `.add-scene-btn` with inline styles instead of using `<app-button>`. |
| B2 | 🟡 Medium | `shared/ui/modal/` + `shared/ui/dialog/` | **Duplicate overlay components** — `ModalComponent` and `DialogComponent` are near-identical (both: backdrop click, `isOpen` input, `close` output, size variants). Should be consolidated into one. |
| B3 | 🟡 Medium | `features/auth-form/auth-form.ts` L56-58 | **No output events** — `onSubmit()` calls `event.preventDefault()` and nothing else. Parent pages have no way to receive form data. No `@Output()` / `output()` for submit events. |
| B4 | 🟡 Medium | `features/auth-form/auth-form.ts` L9-10 | **No shared-ui usage** — uses raw `<input>` and `<button>` elements instead of `<app-input>` and `<app-button>`. Re-implements input/button styling inline (L36-50). |
| B5 | 🟢 Low | `features/create-project/create-project.ts` | **Empty feature** — renders a single button with no behavior. No modal, no form, no service injection. |
| B6 | 🟢 Low | `features/media-upload/media-upload.ts` | **Empty feature** — renders "Drag files here" text. No file input, no drag-and-drop handlers, no upload logic. |

### 2.6 UI Consistency

| # | Severity | File | Issue |
|---|---|---|---|
| U1 | 🔴 Critical | `app.html` L1-345 | **Scaffold template renders in production** — the entire Angular "Hello, frontend" welcome page with Angular logo SVG, social links, and pill buttons renders above `<router-outlet>`. This is visible to users. |
| U2 | 🔴 High | `widgets/sidebar/sidebar.ts` L10-12 | **Uses `<a href>` instead of `routerLink`** — causes full page reload, destroys SPA state, breaks client-side routing. Same issue in: `pages/login/login.ts` L13-14, `pages/register/register.ts` L13, `pages/forgot-password/forgot-password.ts` L14. |
| U3 | 🟡 Medium | 8+ components | **Ad-hoc button styling** — at least 8 different `.btn-*` classes defined inline across pages/features/widgets, each slightly different from `shared/ui/button`. No component reuse. |
| U4 | 🟡 Medium | `pages/player/player.ts` L25-27, 52 | **Hardcoded hex colors** — `#000`, `#111`, `#333`, `#888` instead of design tokens. Player page will not respond to theme switching. |
| U5 | 🟡 Medium | `widgets/topbar/topbar.ts` L8-9 | **Static text instead of interactive elements** — "Search projects..." is a plain `<div>`, not an `<input>` or `<app-input>`. "Workspace Profile" is a plain `<div>`, not a profile dropdown. |

### 2.7 Accessibility

| # | Severity | File | Issue |
|---|---|---|---|
| A1 | 🔴 Critical | `features/auth-form/auth-form.ts` L9-10 | **Labels not associated with inputs** — `<label>` elements have no `for` attribute and `<input>` elements have no `id`. Screen readers cannot associate labels with fields. |
| A2 | 🔴 High | `shared/ui/modal/modal.html`, `shared/ui/dialog/dialog.html` | **No ARIA on overlays** — modals/dialogs lack `role="dialog"`, `aria-modal="true"`, `aria-labelledby`. No focus trap. No `Escape` key handler. Close button `×` has no `aria-label`. |
| A3 | 🔴 High | `widgets/sidebar/sidebar.ts` L7-13 | **No landmark roles** — `<aside>` has no `role="navigation"`, no `aria-label`. `<nav>` is used but without any active-state indication or `aria-current`. |
| A4 | 🟡 Medium | `widgets/timeline/timeline.ts` L10 | **Emoji as button text** — `▶ Play` uses a Unicode character; some screen readers may not announce this consistently. Missing `aria-label="Play"`. |
| A5 | 🟡 Medium | Entire codebase | **No skip-navigation link** — users cannot bypass sidebar/topbar to reach main content. |
| A6 | 🟡 Medium | Entire codebase | **No focus management** — navigating between routes does not programmatically move focus to the new page's main content. |
| A7 | 🟡 Medium | Entire codebase | **No `prefers-reduced-motion` media query** — animation mixins and transitions run unconditionally. |
| A8 | 🟢 Low | `entities/project/project-card/project-card.ts` L11 | `alt="Project preview"` on `<img>` — generic alt text, should describe the specific project. |

### 2.8 Design System Adoption

| # | Severity | File | Issue |
|---|---|---|---|
| D1 | 🔴 Critical | Entire consuming layer | **0% adoption of shared-ui components** — none of the 15 shared-ui components (`app-button`, `app-input`, `app-textarea`, `app-select`, `app-dropdown`, `app-badge`, `app-avatar`, `app-tooltip`, `app-dialog`, `app-toast`, `app-tabs`, `app-skeleton`, `app-spinner`, `app-card`, `app-modal`) are imported by any page, feature, widget, or layout. |
| D2 | 🔴 High | `core/theme/theme.service.ts` | **Theme service orphaned** — defined with `providedIn: 'root'` but never injected by any component. `toggleTheme()` has no consumer. No UI toggle exists. |
| D3 | 🟡 Medium | `shared/styles/mixins/glass.scss` | **Glass mixin unused** — `@mixin glass-panel` and `@mixin glass-text` are defined but never `@include`d anywhere. The auth-layout comment says "Centered glassmorphic card container" but no glass styles are applied. |
| D4 | 🟡 Medium | `shared/styles/mixins/animations.scss` | **Animation mixins unused** — `animate-fade-in`, `animate-scale-in`, `animate-slide-up` are defined but never `@include`d. No entry/exit animations on any component. |
| D5 | 🟢 Low | `shared/styles/tokens/shadows.scss` L5 | **Shadow glow uses raw rgba** — `--shadow-glow-accent: 0 0 30px rgba(124, 92, 231, 0.2)` hardcodes the accent color instead of referencing `$accent-h, $accent-s, $accent-l`. |

---

## 3. Technical Debt

### 3.1 Critical Debt

| Item | Location | Impact |
|---|---|---|
| Default scaffold template ships | `app.html` (345 lines) | Users see Angular welcome page above actual app |
| `provideHttpClient()` missing | `app.config.ts` | All HTTP-based features will crash at runtime |
| Wildcard prerender on dynamic routes | `app.routes.server.ts` | SSR build will fail on `:id` and `:shareId` routes |
| Shared UI never consumed | All consuming layers | Design system exists on paper only; all styling is duplicated |

### 3.2 High Debt

| Item | Location | Impact |
|---|---|---|
| `<a href>` instead of `routerLink` | sidebar, login, register, forgot-password | Full page reload on every navigation; SPA is broken |
| `AuthGuard` deprecated API | `core/auth/auth.guard.ts` | Will be removed in future Angular versions; guard is never actually used in routes anyway |
| `authInterceptor` unregistered | `app.config.ts` | Auth token injection is a no-op |
| `ThemeService` disconnected | `core/theme/theme.service.ts` | Light theme can never activate |
| No a11y on forms | `features/auth-form/auth-form.ts` | Login/register/forgot-password are inaccessible to screen readers |

### 3.3 Medium Debt

| Item | Location | Impact |
|---|---|---|
| `any` types in entity models | `entities/scene/scene.model.ts` L7-9 | `layers: any[]`, `transitions: any`, `settings: any` — no type safety |
| Duplicate modal/dialog components | `shared/ui/modal/` + `shared/ui/dialog/` | Maintenance burden; both have identical backdrop-click + close logic |
| No tests | Entire codebase (only `app.spec.ts` exists, and it's broken) | Zero test coverage; the one test expects scaffold HTML |
| No `prefers-reduced-motion` | `shared/styles/mixins/animations.scss` | Accessibility violation for motion-sensitive users |
| Empty feature components | `create-project.ts`, `media-upload.ts` | Pure stubs with no logic, events, or service wiring |

---

## 4. Refactoring Recommendations (Prioritized)

### P0 — Must Fix Before Any Feature Work

| # | Action | Files Affected |
|---|---|---|
| 1 | **Delete scaffold template** from `app.html` — keep only `<router-outlet />` | `app.html` |
| 2 | **Register `provideHttpClient(withInterceptors([authInterceptor]))`** in `app.config.ts` | `app.config.ts`, `core/auth/auth.interceptor.ts` |
| 3 | **Fix SSR route config** — use `RenderMode.Server` for `projects/:id/editor` and `demo/:shareId`, `RenderMode.Prerender` only for static routes | `app.routes.server.ts` |
| 4 | **Replace all `<a href>`** with `[routerLink]`** and import `RouterLink` in the component's `imports` array | `sidebar.ts`, `login.ts`, `register.ts`, `forgot-password.ts` |

### P1 — Architecture Integrity

| # | Action | Files Affected |
|---|---|---|
| 5 | **Wire `ThemeService`** — inject in `App` component, use `effect()` to set `document.documentElement.dataset['theme']`, guard with `isPlatformBrowser()` for SSR | `app.ts`, `core/theme/theme.service.ts` |
| 6 | **Adopt shared-ui components** — replace inline `<button>`, `<input>` with `<app-button>`, `<app-input>` across all pages/features/widgets | All pages, features |
| 7 | **Migrate `AuthGuard`** to functional `CanActivateFn` and register on protected routes | `core/auth/auth.guard.ts`, `app.routes.ts` |
| 8 | **Migrate `@Input()`** to `input()` in `AuthFormComponent`; add `output()` for form submission | `features/auth-form/auth-form.ts` |
| 9 | **Add barrel exports** (`index.ts`) for `entities/`, `features/`, `widgets/`, `layouts/`, `pages/` layers | New files |
| 10 | **Consolidate modal + dialog** into a single overlay component with flexible content projection | `shared/ui/modal/`, `shared/ui/dialog/` |

### P2 — Accessibility & Theme

| # | Action | Files Affected |
|---|---|---|
| 11 | **Associate labels with inputs** — add `id` to inputs, `for` to labels in `AuthFormComponent` | `features/auth-form/auth-form.ts` |
| 12 | **Add ARIA to overlays** — `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, `Escape` handler | `shared/ui/modal/`, `shared/ui/dialog/` |
| 13 | **Replace hardcoded colors** in player page with design tokens | `pages/player/player.ts` |
| 14 | **Add `prefers-reduced-motion`** wrapper to animation mixins | `shared/styles/mixins/animations.scss` |
| 15 | **Add skip-nav link** to workspace layout | `layouts/workspace-layout/workspace-layout.ts` |
| 16 | **Add `aria-label`** to icon-only and emoji buttons (Play, Close) | Various |

### P3 — Code Quality

| # | Action | Files Affected |
|---|---|---|
| 17 | **Add `ChangeDetectionStrategy.OnPush`** to all components (currently only shared-ui has it) | All pages, features, widgets, layouts |
| 18 | **Replace `any` types** in `Scene` model with proper interfaces | `entities/scene/scene.model.ts` |
| 19 | **Move editor layout panels** into `EditorLayoutComponent` | `layouts/editor-layout/editor-layout.ts`, `pages/editor/editor.ts` |
| 20 | **Fix/remove broken test** — `app.spec.ts` asserts scaffold HTML | `app.spec.ts` |
| 21 | **Apply glass mixin** to auth-layout card (as the comment promises) | `layouts/auth-layout/auth-layout.ts` |
| 22 | **Apply animation mixins** for page transitions (fadeIn, slideUp) | Various |

---

## 5. Quick Remediation Checklist (First 2 Weeks)

- [ ] Delete `app.html` scaffold content (keep only `<router-outlet />`)
- [ ] Add `provideHttpClient(withInterceptors([authInterceptor]))` to `app.config.ts`
- [ ] Fix `app.routes.server.ts` — explicit `RenderMode` per route
- [ ] Replace `<a href>` → `[routerLink]` in sidebar + auth pages
- [ ] Wire `ThemeService` via `effect()` in root component
- [ ] Replace 1 inline button usage with `<app-button>` as a proof-of-concept
- [ ] Add `for`/`id` to auth-form labels/inputs
- [ ] Add `role="dialog"` + `aria-modal` to modal/dialog
- [ ] Remove or fix `app.spec.ts`
- [ ] Add `OnPush` to all non-shared-ui components

---

## 6. File-by-File Inventory

### Core
| File | Lines | Status | Key Issue |
|---|:---:|---|---|
| `core/auth/auth.guard.ts` | 15 | ⚠️ Deprecated API | Class-based `CanActivate`; never used in routes |
| `core/auth/auth.interceptor.ts` | 7 | ⚠️ Disconnected | Functional `HttpInterceptorFn`; never registered |
| `core/theme/theme.service.ts` | 14 | ⚠️ Orphaned | Signal exists but no DOM binding; never injected |

### Shared UI (15 components)
| Component | OnPush | Signal Inputs | Barrel | Notes |
|---|:---:|:---:|:---:|---|
| `button` | ✅ | ✅ | ✅ | 5 variants, focus-ring mixin, excellent |
| `input` | ✅ | ✅ | ✅ | — |
| `textarea` | ✅ | ✅ | ✅ | — |
| `select` | ✅ | ✅ | ✅ | — |
| `dropdown` | ✅ | ✅ | ✅ | — |
| `badge` | ✅ | ✅ | ✅ | — |
| `avatar` | ✅ | ✅ | ✅ | — |
| `tooltip` | ✅ | ✅ | ✅ | — |
| `dialog` | ✅ | ✅ | ✅ | Duplicate of modal; lacks a11y |
| `toast` | ✅ | ✅ | ✅ | — |
| `tabs` | ✅ | ✅ | ✅ | — |
| `skeleton` | ✅ | ✅ | ✅ | — |
| `spinner` | ✅ | ✅ | ✅ | — |
| `card` | ✅ | ✅ | ✅ | — |
| `modal` | ✅ | ✅ | ✅ | Duplicate of dialog; lacks a11y |

**Adoption: 0/15 consumed** 🔴

### Entities
| File | Lines | Notes |
|---|:---:|---|
| `entities/project/project.model.ts` | 11 | Clean interface |
| `entities/project/project-card/project-card.ts` | 61 | Uses `input.required()` ✅ |
| `entities/scene/scene.model.ts` | 13 | Contains `any[]` and `any` (L7-9) ⚠️ |
| `entities/media/media.model.ts` | 14 | Clean interface with union type |

### Features
| File | Lines | OnPush | Signal Inputs | Status |
|---|:---:|:---:|:---:|---|
| `features/auth-form/auth-form.ts` | 60 | ❌ | ❌ (`@Input`) | Uses raw HTML inputs, no outputs |
| `features/create-project/create-project.ts` | 23 | ❌ | N/A | Empty stub |
| `features/media-upload/media-upload.ts` | 22 | ❌ | N/A | Empty stub |

### Widgets
| File | Lines | OnPush | Signals | Status |
|---|:---:|:---:|:---:|---|
| `widgets/sidebar/sidebar.ts` | 41 | ❌ | ❌ | Uses `<a href>` |
| `widgets/topbar/topbar.ts` | 28 | ❌ | ❌ | Static text, no interactivity |
| `widgets/recent-projects/recent-projects.ts` | 49 | ❌ | ✅ `signal([])` | Good structure |
| `widgets/timeline/timeline.ts` | 78 | ❌ | ✅ `signal([])` | Good structure |

### Layouts
| File | Lines | OnPush | Status |
|---|:---:|:---:|---|
| `layouts/auth-layout/auth-layout.ts` | 32 | ❌ | Comment says "glassmorphic" but no glass mixin used |
| `layouts/workspace-layout/workspace-layout.ts` | 42 | ❌ | Clean composition |
| `layouts/editor-layout/editor-layout.ts` | 25 | ❌ | Too thin — layout panels are in the page instead |

### Pages
| File | Lines | OnPush | Shared UI Used | Status |
|---|:---:|:---:|:---:|---|
| `pages/login/login.ts` | 39 | ❌ | ❌ | `<a href>` instead of `routerLink` |
| `pages/register/register.ts` | 36 | ❌ | ❌ | `<a href>` instead of `routerLink` |
| `pages/forgot-password/forgot-password.ts` | 43 | ❌ | ❌ | `<a href>` instead of `routerLink` |
| `pages/dashboard/dashboard.ts` | 29 | ❌ | ❌ | Clean, delegates to widget |
| `pages/projects/projects.ts` | 44 | ❌ | ❌ | Inline button styling |
| `pages/editor/editor.ts` | 105 | ❌ | ❌ | Layout panels misplaced here |
| `pages/player/player.ts` | 64 | ❌ | ❌ | Hardcoded hex colors |

### App Root
| File | Lines | Key Issue |
|---|:---:|---|
| `app.ts` | 13 | Clean, minimal |
| `app.html` | 345 | 🔴 **Angular scaffold template must be deleted** |
| `app.scss` | 1 | Empty |
| `app.config.ts` | 13 | Missing `provideHttpClient` |
| `app.config.server.ts` | 13 | Properly merges configs |
| `app.routes.ts` | 64 | Clean lazy-loaded routes; no guards registered |
| `app.routes.server.ts` | 9 | 🔴 Wildcard prerender on dynamic routes |
| `app.spec.ts` | 24 | Broken — asserts scaffold content |
| `styles.scss` | 17 | Correctly imports all tokens + themes ✅ |

---

## 7. Appendix: Design System Token Usage Audit

Tokens defined vs. tokens actually referenced in component styles:

| Token Category | Defined | Referenced in Components | Coverage |
|---|:---:|:---:|:---:|
| Spacing (`--space-*`) | 15 | 8 (`1,2,3,4,5,6,8,10`) | 53% |
| Typography (`--text-*`) | 12 | 6 (`2xs,xs,sm,base,md,xl,3xl`) | 50% |
| Radius (`--radius-*`) | 7 | 2 (`sm,md`) | 29% |
| Shadows (`--shadow-*`) | 4 | 2 (`lg, glow-accent`) | 50% |
| Colors (semantic) | ~30 | ~12 | 40% |
| Motion (`--duration-*`, `--easing-*`) | 8 | 2 (`fast, smooth`) | 25% |
| Z-index (`--z-index-*`) | 6 | 0 (none used in templates) | 0% |

---

## 8. Conclusion

DemoFlow's frontend skeleton has an **architecturally sound foundation** — FSD layers are correctly structured, routing is lazy-loaded, and a comprehensive design-token/theme/component system exists in `shared/`. However, the skeleton suffers from a critical **adoption gap**: the entire shared-ui layer (15 components) goes completely unused. Every page and feature re-implements its own ad-hoc styled elements.

The most urgent fixes are:
1. **Delete the scaffold `app.html`** — it currently ships to users
2. **Register `provideHttpClient()`** — nothing HTTP-based can work without it
3. **Fix SSR route config** — wildcard prerender will crash on dynamic routes
4. **Replace `<a href>` with `routerLink`** — the SPA is fundamentally broken without this

Once these P0 items are addressed, the project can begin the P1 work of actually connecting the well-built design system to the consuming layers.
