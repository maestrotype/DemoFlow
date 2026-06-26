# AI Constitution — DemoFlow

## Language Policy

- All project files, markdown files, code comments, commit messages and documentation must be written ONLY in English.
- Never mix English and Russian inside project files.
- Chat responses must always use the user's language.
- If the user writes in Russian, answer in Russian.
- If the user writes in English, answer in English.

## File Editing Policy

Before claiming a file was updated:
- Read the file.
- Apply changes.
- Read the file again.
- Verify that the requested changes actually exist.
- Never assume an edit succeeded.
- If editing failed, explicitly say so.

## Truthfulness Policy

Never state that something was fixed unless it has been verified.
Never claim:
- The file is correct
- The issue is fixed
- Compilation succeeded
- Tests passed
unless you have verified it by reading the final file.
Never describe files that were not read during the current session.
The current project files are always the single source of truth.

## Source of Truth Policy

Never state that a file contains something unless it has been read in the current session.
Never describe the contents of a file from memory.
If a file was not read, explicitly state that its contents are unknown.
The current project files are always the single source of truth.

## No Hidden Assumptions

Never invent project state.
Never claim compilation passed unless it actually passed.
Never claim architecture is correct unless verified.

## Self Verification Checklist

Before every final response verify:
- Correct file edited
- No duplicated sections
- English only
- Valid Markdown formatting
- No accidental removals or additions
- User request fully completed
If any item fails, do not finish the task.
Only edit AI_CONSTITUTION.md.
Do not edit any other file.
Stop after the modification.

## Verification Policy

Before reporting success:
- Read the target file.
- Apply the modification.
- Read the file again.
- Verify that the requested changes are actually present.
- Verify that no unrelated content was modified.
- Report success only after successful verification.
- If verification is impossible, explicitly state that verification could not be completed.

## Architecture Decision Policy

Do not redesign the architecture unless explicitly requested.
Prefer improving the existing architecture over replacing it.
Never introduce new architectural patterns, libraries or abstractions without explaining why the current solution is insufficient.
Respect the existing project architecture unless there is a proven architectural issue.

## Architecture Integrity Policy

Follow Feature-Sliced Design.
Every new feature must integrate naturally into the existing architecture.
Avoid architectural fragmentation.
Avoid duplicated logic.
Prefer composition over inheritance.
Never create unnecessary abstractions.

## Minimal Change Policy

Make the smallest possible change required to solve the current task.
Do not refactor unrelated code.
Do not rename files, folders, variables or symbols unless required.
Do not move files unless explicitly requested.
Do not reformat unrelated files.
Modify only the files required for the current task.

## Refactoring Policy

Never perform unrelated refactoring.
Never modify files unrelated to the current task.
Keep code readable, scalable and maintainable.

## Angular Policy

Follow the official Angular Style Guide.
Prefer Angular built-in APIs over third-party libraries.
Prefer Standalone Components.
Prefer Signals when appropriate.
Maintain full SSR compatibility.
Preserve strict typing.
Use OnPush by default unless there is a justified exception.
Keep routing, dependency injection and state management aligned with Angular best practices.

## Styling Policy

Never use `!important` unless explicitly approved.
Prefer Design Tokens over hardcoded values.
Avoid duplicated styles.
Prefer component-local styles.
Do not hardcode colors, spacing, typography or z-index values if design tokens already exist.
Do not introduce CSS hacks or unnecessary specificity.

## UI Policy

Keep components focused and cohesive.
Never introduce temporary solutions.
Never introduce technical debt knowingly.

## Dependency Policy

Never introduce new libraries without approval.

## Performance Policy

Do not optimize prematurely.
Prefer readability unless performance has been measured as a bottleneck.
When modifying performance-critical code, explain the trade-offs.
Avoid unnecessary allocations, subscriptions and re-renders.

## Consistency Policy

Every new solution must match the existing architecture, coding style and project conventions.
The project must evolve as a coherent system rather than a collection of unrelated solutions.
New code should look as if it has always been part of the project.

## Documentation Policy

Use docs/AI_PROGRESS.md as the primary project memory.
After completing each milestone, update AI_PROGRESS.md using factual information only.
Never duplicate information already stored in AI_PROGRESS.md.

## Context Management Policy

Keep responses concise and focused.
Avoid repeating previously explained information.
Never fill the context window with unnecessary explanations or repeated analysis.

## Error Handling Policy

Handle all errors gracefully.
Never leave the application in an invalid state.
Provide clear error messages for debugging.

## Quality Priority

Correctness is always more important than speed.
Architecture is more important than convenience.
Maintainability is more important than short-term implementation.
Scalability is more important than quick fixes.
Never sacrifice code quality for implementation speed unless explicitly requested.

## Honesty Policy

Never claim success based on assumptions.
Never claim that code compiles unless it has actually been compiled.
Never claim that tests pass unless they have actually been executed.
Never claim that a file was updated unless the final contents have been verified.
If you are uncertain, explicitly say so instead of guessing.

## History

2026-06-26 — Created docs/AI_CONSTITUTION.md with permanent rules for AI behavior.

