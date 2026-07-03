# Task 005: Wire Functional AuthGuard to Protected Routes

## Goal
Register the functional `AuthGuard` on the application routes to protect workspace pages and the editor.

## Files to Edit
- `frontend/src/app/app.routes.ts`

## Files Forbidden to Edit
- `frontend/src/app/core/auth/auth.guard.ts`

## Context Specs
- Import `AuthGuard` in `app.routes.ts`.
- Register the guard using `canActivate: [AuthGuard]` on the following routes:
  - The Workspace root path `''` (which wraps `/dashboard` and `/projects`).
  - The Editor root path `'projects/:id/editor'`.
- This ensures users must be authenticated to access these locations.

## Definition of Done
1. `AuthGuard` is imported and registered in `canActivate` arrays for workspace and editor layouts in `app.routes.ts`.
2. Unprotected routes (`/auth/login`, `/auth/register`, `/auth/forgot-password`, and public `/demo/:shareId` player) do NOT have `AuthGuard` assigned.
3. `npm run build` executes without errors.

## Build Command
```bash
npm run build --prefix frontend
```

## Commit Message
```
feat(auth): protect workspace and editor routes using AuthGuard
```
