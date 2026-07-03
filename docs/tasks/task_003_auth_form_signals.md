# Task 003: Migrate AuthFormComponent Inputs/Outputs to Signals

## Goal
Migrate inputs in `AuthFormComponent` to the modern Angular Signals-based `input()` API, declare a form submission `output()`, and bind them so that form values are reactively captured and emitted on submit.

## Files to Edit
- `frontend/src/app/features/auth-form/auth-form.component.ts`
- `frontend/src/app/features/auth-form/auth-form.html`

## Files Forbidden to Edit
- Any file under `frontend/src/app/shared/ui/`

## Context Specs
- The `mode` input is already a signal `input<AuthFormMode>('login')`.
- Add a new Signal `output<{ email: string; password?: string }>()` named `submitForm`.
- Bind the input fields to local model signals or form group controls using Angular's forms module (inject `FormsModule` or `ReactiveFormsModule`).
- On form submission (`onSubmit`), emit the current email and password values via `submitForm.emit(...)`.

## Definition of Done
1. `AuthFormComponent` declares `submitForm = output<{ email: string; password?: string }>()`.
2. Form input values are correctly captured reactively using Signals or angular form controls.
3. Submitting the form calls `submitForm.emit` with the email and password values.
4. `npm run build` executes without errors.

## Build Command
```bash
npm run build --prefix frontend
```

## Commit Message
```
refactor(auth): migrate inputs/outputs to Signals and emit credentials on submit
```
