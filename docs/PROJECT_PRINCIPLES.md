# DemoFlow Project Principles

## Overview

DemoFlow is a commercial-grade, enterprise SaaS platform for collaborative workflows and project management.  
This document defines the immutable architectural rules, coding standards, and development principles that govern all code changes.

> ⚠️ **Quality over speed. Always.**

---

## Core Principles

### 1. Architecture First

- **Never** choose a fast solution over an architectural one.
- No temporary fixes — “*will fix later*” is forbidden.
- Every component/service/module must be maintainable by a Principal Engineer.

### 2. Standalone Components & Modern Angular

- Use Angular 20+ with `standalone: true`.
- Signals-first development:
  - `input()`, `output()`, `model()`, `signal()`, `computed()`, `effect()`.
  - Avoid `ngOnInit` and `subscribe()` where possible.
- Strict `OnPush`, no change detection leaks.

### 3. Feature-Sliced Design (FSD)

```
frontend/src/app/
├── core/           # singleton services, guards, interceptors
├── shared/         # UI primitives (buttons, inputs, icons)
├── entities/       # domain models and basic services
├── features/       # user-driven behavior (e.g., "edit project")
├── widgets/        # composite UI components
├── pages/          # top-level route handlers
└── layouts/        # structural wrappers (auth, workspace, etc.)
```

- Strict dependency direction: `core → shared → entities → features → widgets → pages → layouts`
- No deep imports — always use barrel files (`index.ts`).

### 4. Design System

- Every visual element must come from the design system (no duplicate buttons/modals).
- Use SCSS tokens, CSS variables — never hard-coded colors or margins.
- Use only tokens; prohibit `!important`, inline styles, or `style="..."`.

### 5. SSR & Hydration Safety

- SSR-first mindset: do not use `window`, `document`, `localStorage` without platform guards.
- Use `platform-browser` guards:
  ```ts
  import { isPlatformBrowser } from '@angular/common';
  if (isPlatformBrowser(this.platformId)) {
    // safe to use window/document
  }
  ```

### 6. Backend (NestJS)

- Clean Architecture: Use Cases → Domain.
- Framework independence: domain must know nothing about NestJS.
- Dependency inversion via interfaces.

### 7. Code Standards

- **No `any`**, strict TypeScript.
- Strict null checks enabled.
- Use `readonly`, enums, union types where appropriate.
- Each file must follow single responsibility principle.

---

## File Structure Rules

### Component Template

Each component **must** have:

```
component.ts
component.html
component.scss
component.types.ts  // if needed (public types used in parent)
index.ts            // barrel export
```

Never:
- Inline template/stylesheet.
- Large (>400 LOC) components without decomposition.

### Barrel Files (`index.ts`)

All modules must export public API through `index.ts`:

```ts
export * from './my-widget.component';
export type { MyWidget } from './my-widget.types';
```

---

## Style Guide

### SCSS

- Use SCSS tokens from design system.
- Limit nesting to 3 levels max.
- No duplicate styles — extract mixins where needed.

### TypeScript

- `const`, `readonly` whenever possible.
- Avoid `ngOnInit()` where signal OnInit is available.

---

## Angular Specifics

### Signals & Lifecycle

- Prefer `input()`, `model()` over manual `@Input()`.
- Use `effect()` for side effects.
- Use `computed()` for derived state.

### SSR Routes

- SSR routes with dynamic segments (`:id`) work only when:
  - Standalone bootstrap is used.
  - `app.config.ts` provides correct providers.
  - No SSR-incompatible APIs are used.

---

## Quality Gates

Every PR must pass:

- ✅ Project compiles (`ng build`)
- ✅ No new warnings
- ✅ No `any` or `// @ts-ignore`
- ✅ All imports strict
- ✅ No hard-coded values (use tokens)
- ✅ No temporary code

---

## Development Workflow

1. Before change: read architecture, understand why existing.
2. After error: **do not fix immediately** — find root cause, explain it, propose solution.
3. After success: update `docs/AI_PROGRESS.md`.
4. After session end:
   - Update `AI_PROGRESS.md`
   - Write `SESSION SUMMARY`

---

## Forbidden Patterns

❌ Inline HTML/SCSS  
❌ Deep imports (`../services/...`)  
❌ Double buttons/modals  
❌ Dynamic `innerHTML`, direct DOM manipulation  
❌ Global styles without necessity  
❌ `ng-content` for component composition  
❌ Hardcoded numbers, colors, lengths  

---

*Last updated: 2026-06-26*