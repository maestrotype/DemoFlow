# Task 004: Consolidate Modal and Dialog Components into ModalComponent

## Goal
Delete the duplicate `DialogComponent` and consolidate its unique functionality (e.g. title input) into `ModalComponent`. Update all barrel exports to remove references to the deleted dialog component.

## Files to Edit
- `frontend/src/app/shared/ui/modal/modal.component.ts`
- `frontend/src/app/shared/ui/modal/modal.html`
- `frontend/src/app/shared/ui/index.ts`

## Files to Delete
- `frontend/src/app/shared/ui/dialog/dialog.component.ts`
- `frontend/src/app/shared/ui/dialog/dialog.html`
- `frontend/src/app/shared/ui/dialog/dialog.scss`
- `frontend/src/app/shared/ui/dialog/dialog.types.ts`
- `frontend/src/app/shared/ui/dialog/index.ts`

## Context Specs
- Enhance `ModalComponent` to accept an optional `title` input signal (`title = input<string>('')`).
- In `modal.html`, support rendering the title:
  - If a projected `[header]` is present, project it.
  - If no `[header]` is projected, but `title()` has a value, render:
    `<header class="modal-header"><h3>{{ title() }}</h3><button class="close-btn" (click)="closeModal()">×</button></header>`
- Clean up `shared/ui/index.ts` by deleting the `export * from './dialog';` line.

## Definition of Done
1. `DialogComponent` and its entire folder are deleted.
2. `ModalComponent` handles both direct title text and named `<ng-content select="[header]">` slots.
3. `shared/ui/index.ts` does not reference `./dialog`.
4. `npm run build` executes without errors.

## Build Command
```bash
npm run build --prefix frontend
```

## Commit Message
```
refactor(shared): consolidate modal and dialog components into ModalComponent
```
