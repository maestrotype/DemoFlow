# DemoFlow AI Constitution
> **Optimized for Qwen3-Coder-30B**

## 1. Startup & Context Management
- **Read ONLY 3 files at start**:
  1. `docs/AI_CONSTITUTION.md` (this file)
  2. `docs/PROJECT_STATUS.md` (current status & roadmap)
  3. The active task file specified in `PROJECT_STATUS.md` (e.g. `docs/tasks/task_XXX.md`)
- **Do NOT read other documentation files** (e.g. files in `docs/reference/`).
- **Do NOT scan the repository** recursively. Only read the files explicitly listed in the active task file.
- **Do NOT execute planning phases** or write solution comparisons. Begin coding immediately.

## 2. Coding Restrictions
- **No Architectural Changes**: Propose no refactorings, renames, or folder movements unless explicitly commanded by the active task file.
- **Keep Components Small**:
  - TypeScript logic: `< 150` lines of code.
  - HTML template: `< 120` lines of code.
  - SCSS styling: `< 200` lines of code.
- **No Duplicate UI**: Always check `shared/ui/` first before creating buttons, inputs, modals, cards, badges, or spinners.
- **Strict Typing**:
  - Always use explicit types. Never use `any`.
  - Use exact enums and union variants defined in `shared/ui/` components (e.g. `BadgeVariant`, `ButtonVariant`).
- **No Placeholders or Logs**:
  - Do NOT write `console.log`, `TODO`, `FIXME`, or temporary mock structures.
  - Write complete production-ready code.

## 3. Scope Boundaries
- **Edit ONLY files** listed in the "Files to edit" section of the active task.
- **NEVER edit files** listed in the "Files forbidden to edit" section.
- **Do NOT modify documentation files** (except for updating the progress status in `docs/PROJECT_STATUS.md` upon completion).

## 4. Compile, Fix & Verify
- **Compile After Changes**: Immediately run the build command listed in the active task file (e.g., `npm run build` in the `frontend/` or `backend/` directory).
- **Fix Compilation Errors Instantly**:
  - If the build fails, stop immediately, read the error message, identify the file and line number, and fix the syntax or type conflict.
  - Do NOT modify other unrelated code while fixing build errors.
- **Commit Format**: Prepare a commit message exactly matching the active task spec template (Conventional Commits format).