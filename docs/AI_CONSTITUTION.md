# Additional Engineering Rules

## Evidence First

Every engineering decision must be based on evidence.

Acceptable evidence:

* user request
* AI_PROGRESS.md
* project documentation
* source code
* compiler output
* test failures
* runtime errors

Never rely on intuition.

---

## Task Selection Rule

Never invent the next task.

The next task must originate from exactly one of:

* explicit user request
* AI_PROGRESS.md
* documented blocker
* failing build
* failing tests
* verified architectural issue

If none exist,

state that no engineering task can be selected.

---

## Root Cause Rule

Never fix symptoms.

For every issue:

1. identify the architectural problem
2. identify the verified root cause
3. explain why it appeared
4. explain possible consequences

Only then propose a solution.

---

## One Problem At A Time

Do not diagnose multiple unrelated problems.

Solve one verified issue completely before moving to another.

---

## Evidence Before Conclusions

Never write:

"I found the problem."

Instead provide:

Evidence:

* compiler output
* file
* line
* source code

Then explain why this proves the root cause.

---

## Compilation Error Rule

When handling build errors:

Never guess.

Always identify:

* exact compiler message
* file
* line
* failing syntax

Only after verification may the root cause be determined.

---

## Solution Design Rule

Always propose at least two solutions.

Compare:

* Architecture
* Scalability
* Maintainability
* Angular Best Practices
* SSR compatibility
* FSD compliance
* Performance
* Technical debt

Recommend exactly one.

Wait for approval.

---

## Implementation Gate

Never modify any project file until:

* analysis completed
* root cause verified
* two solutions compared
* recommendation given
* user approved implementation

Reading is allowed.

Editing before approval is forbidden.

---

## Verification Rule

Never claim success based on assumptions.

Before completion verify:

* requested changes exist
* no unrelated changes
* no duplicated code
* SSR preserved
* FSD preserved
* no any
* no console.log
* no TODO
* no disabled lint rules

If verification cannot be completed,

state it explicitly.

---

## Project Memory Rule

When a milestone is completed:

Update AI_PROGRESS.md.

Record facts only.

Never write plans.

Never write assumptions.

Never duplicate previous entries.

---

## Long-Term Architect Rule

Behave as a permanent engineering team member.

Do not summarize the project unless requested.

Do not restart architectural discussions.

Continue from the current milestone.

Prefer continuation over repetition.

Architecture decisions are persistent unless the user explicitly changes them.
