# DemoFlow Practical Design System

This is a rule-based visual code quality guide. All UI components must conform to these design tokens and principles.

---

## 1. CSS Custom Property Tokens
Use these custom properties directly in your components' SCSS files. Never use hardcoded hex, RGB, or raw HSL values.

### Background & Border Colors
- Base page background: `var(--color-bg-base)`
- Card / Panel background: `var(--color-bg-elevated)`
- Surface elements background: `var(--color-bg-surface)`
- Glass overlay background: `var(--color-bg-glass)`
- Standard border: `var(--color-border)`
- Subtler border: `var(--color-border-subtle)`
- Focus state border: `var(--color-border-focus)`

### Semantic Utility Colors
- Primary Accent: `var(--color-accent)` | hover: `var(--color-accent-hover)`
- Success State: `var(--color-success)` | subtle success: `var(--color-success-subtle)`
- Warning State: `var(--color-warning)` | subtle warning: `var(--color-warning-subtle)`
- Error State: `var(--color-error)` | subtle error: `var(--color-error-subtle)`

### Typography Colors
- Primary text: `var(--color-text-primary)`
- Secondary text: `var(--color-text-secondary)`
- Muted text: `var(--color-text-muted)`
- Placeholder text: `var(--color-text-placeholder)`

---

## 2. Component Composition Rules

- **Smart vs. Dumb Components**:
  - **Smart Components (Pages)**: Responsible for routing, layout composition, and connecting state (signals/inject services).
  - **Dumb Components (Entities/Widgets/Shared)**: Receive inputs via signal-based `input()` and dispatch outputs via `output()`. No direct state mutation or routing.
- **Shared UI First**:
  - Never write raw `<button>` or `<input>` elements in your pages or widgets.
  - Use `<app-button>` from `shared/ui/button` and `<app-input>` from `shared/ui/input`.
- **Strict Typing for Shared UI**:
  - Always match the exact union types for component inputs:
    - `ButtonVariant`: `'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'`
    - `ButtonSize`: `'xs' | 'sm' | 'md' | 'lg'`
    - `BadgeVariant`: `'success' | 'warning' | 'error' | 'info' | 'default'`
    - `InputType`: `'text' | 'password' | 'email' | 'number'`
  - **Build Guard**: Do NOT pass dynamic strings (like entity status strings) directly into variant inputs if they don't match the allowed union types. Map them first, or use the component's status inputs (e.g. `<app-badge [status]="project().status">`).

---

## 3. Structural Constraints
- **Deep nesting**: Maximum of 4 levels deep in HTML templates.
- **Flexbox vs. Grid**: Use Flexbox for alignments and linear components. Use Grid only for tabular card grids.
- **OnPush Change Detection**: Every single component must declare `changeDetection: ChangeDetectionStrategy.OnPush`.
- **Component File Split**: Avoid inline styles and templates. Keep files separated: `.component.ts`, `.html`, `.scss`, `.spec.ts`.
