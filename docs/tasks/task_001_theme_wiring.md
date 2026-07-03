# Task 001: Verify and Complete ThemeService Integration

## Goal
Verify the integration of `ThemeService` within `AppComponent` to ensure that:
1. The theme changes dynamically and resolves correctly in both light/dark modes.
2. The dataset attribute `data-theme` is reactively updated on `document.documentElement` when the service signals a change.
3. The build compiles successfully.

## Files to Edit
- `frontend/src/app/app.component.ts`

## Files Forbidden to Edit
- `frontend/src/app/core/theme/theme.service.ts`
- Any files under `shared/ui/`

## Context Specs
- The `ThemeService` resolves theme state to `'dark' | 'light'` via `resolvedTheme()` signal.
- The `AppComponent` constructor must reactively track `resolvedTheme()` using `effect()` (guarded by `isPlatformBrowser(platformId)` check) and set `document.documentElement.dataset['theme']`.

## Definition of Done
1. `AppComponent` successfully injects `ThemeService` and `PLATFORM_ID`.
2. An `effect()` runs on the browser to apply the theme dataset.
3. `npm run build` executes without errors.

## Build Command
```bash
npm run build --prefix frontend
```

## Commit Message
```
feat(theme): verify reactive theme application in root app component
```
