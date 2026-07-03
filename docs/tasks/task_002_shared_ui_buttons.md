# Task 002: Adopt Shared UI Buttons and Inputs in AuthFormComponent

## Goal
Replace the raw HTML `<button>` and `<input>` elements in the `AuthFormComponent` with the standardized standalone `<app-button>` and `<app-input>` components from `shared/ui`.

## Files to Edit
- `frontend/src/app/features/auth-form/auth-form.html`
- `frontend/src/app/features/auth-form/auth-form.component.ts`

## Files Forbidden to Edit
- Any file under `frontend/src/app/shared/ui/`

## Context Specs
- Import `ButtonComponent` and `InputComponent` in `AuthFormComponent` (using the path aliases `@shared/ui` or relative paths, e.g., `@shared/ui/button` and `@shared/ui/input`).
- In `auth-form.html`:
  - Replace `<input id="email" ...>` with `<app-input id="email" label="Email Address" type="email" placeholder="you@example.com" ...>`
  - Replace `<input id="password" ...>` with `<app-input id="password" label="Password" type="password" placeholder="••••••••" ...>`
  - Replace `<button type="submit" class="submit-btn">` with `<app-button type="submit" variant="primary">...</app-button>`
- Ensure that forms handle the bindings correctly using Angular's standalone patterns.

## Definition of Done
1. `AuthFormComponent` imports and registers `ButtonComponent` and `InputComponent` in its `imports` array.
2. Raw inputs and buttons are replaced with `<app-input>` and `<app-button>` in `auth-form.html`.
3. `npm run build` executes without errors.

## Build Command
```bash
npm run build --prefix frontend
```

## Commit Message
```
feat(auth): adopt shared UI button and input in auth form component
```
