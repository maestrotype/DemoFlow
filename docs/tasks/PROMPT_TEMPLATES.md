# Qwen-30B Prompt Templates

Use these ultra-short templates in Cline/Aider to drive Qwen3-Coder-30B with maximum efficiency.

---

## 1. Implement Task
```markdown
Read docs/AI_CONSTITUTION.md and docs/PROJECT_STATUS.md.
Read active task spec: [path/to/task.md].
Implement the target changes in the listed files. Run the build command and verify.
```

---

## 2. Fix Build Errors
```markdown
The build failed:
[PASTE BUILD ERROR LOG]
Identify the file and line, resolve the type/syntax conflict, and build again to verify.
Do NOT edit other files.
```

---

## 3. Refactor Component
```markdown
Refactor component [component-name]:
- Maintain OnPush change detection.
- Keep TS < 150 lines, HTML < 120 lines, SCSS < 200 lines.
- Ensure all styled elements use var(--color-*) design tokens.
Run the build command after refactoring.
```

---

## 4. Update Progress
```markdown
Task is successful. Update docs/PROJECT_STATUS.md:
- Mark the current task as completed [x].
- Set the next task in the roadmap as the active task.
Propose a git commit message following Conventional Commits.
```

---

## 5. Stop After Completion
```markdown
The task is finished and build passes. Propose the commit message and STOP. Do not select or begin any new tasks.
```
