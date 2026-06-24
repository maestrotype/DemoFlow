# DemoFlow — Design System v2.0 Specifications

> **Version:** 2.0.0  
> **Status:** Living Specification  
> **Language:** CSS Custom Properties + Custom SCSS Mixins  
> **Design Philosophy:** Dark-first · Glassmorphism · Apple-inspired clarity  
> **Last updated:** 2026-06-24

---

## 1. Color System

DemoFlow's color system uses abstract HSL variables declared at the root level and dynamically overridden by the active theme.

### 1.1 Brand & Semantic Hue Parameters (HSL)
```scss
$accent-h: 255;  // Violet Accent
$accent-s: 80%;
$accent-l: 65%;

$success-h: 145; // Success Green
$warning-h: 38;  // Warning Amber
$error-h: 3;     // Error Red
$info-h: 200;    // Info Blue
```

### 1.2 Global Color Tokens
| Variable Name | Dark Theme Value (Default) | Light Theme Value | Usage |
|:---|:---|:---|:---|
| `--color-bg-base` | `hsl(225 14% 5.5%)` | `hsl(220 20% 97%)` | App background canvas |
| `--color-bg-elevated` | `hsl(225 12% 8%)` | `hsl(0 0% 100%)` | Sidebars, docked panels |
| `--color-bg-surface` | `hsl(225 11% 11%)` | `hsl(220 20% 99%)` | Cards, buttons, static lists |
| `--color-bg-overlay` | `hsl(225 10% 15%)` | `hsl(220 15% 95%)` | Dropdowns, dialog viewports |
| `--color-bg-glass` | `hsl(225 14% 18% / 55%)` | `hsl(0 0% 100% / 70%)` | Shaded glass containers |
| `--color-border` | `hsl(225 10% 20%)` | `hsl(220 15% 88%)` | Standard borders & dividers |
| `--color-border-focus` | `hsl(255 80% 72% / 60%)` | `hsl(255 80% 55% / 50%)` | Focused input focus rings |
| `--color-border-glass` | `hsl(0 0% 100% / 8%)` | `hsl(0 0% 0% / 8%)` | Highlighted borders on glass |
| `--color-text-primary` | `hsl(225 10% 95%)` | `hsl(225 25% 12%)` | Headings, active menu labels |
| `--color-text-secondary`| `hsl(225 10% 65%)` | `hsl(225 15% 38%)` | Body paragraphs, descriptions |
| `--color-text-muted` | `hsl(225 10% 42%)` | `hsl(225 12% 58%)` | Input labels, helper text |

---

## 2. Typography Scale

### 2.1 Font Families
*   **Sans-Serif (`--font-sans`):** `Inter Variable`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif` (Premium readability)
*   **Monospace (`--font-mono`):** `JetBrains Mono`, `Fira Code`, `ui-monospace`, `monospace` (Used for IDs, keyboard shortcuts, logs)

### 2.2 Sizing Scale
| Token | Font Size | Line Height | Usage |
|:---|:---|:---|:---|
| `--text-2xs` | `11px` | `1.4` | Micro indicators, badge labels |
| `--text-xs` | `12px` | `1.4` | Input helper text, timestamps |
| `--text-sm` | `13px` | `1.45` | Standard labels, table content |
| `--text-base` | `14px` | `1.5` | Body text, paragraph copies |
| `--text-md` | `16px` | `1.4` | Large labels, buttons, navigation links |
| `--text-lg` | `18px` | `1.35` | Subtitles, card titles |
| `--text-xl` | `20px` | `1.3` | Section headings, panel headers |
| `--text-3xl` | `30px` | `1.2` | Page primary titles |

---

## 3. Elevation & Shadow System

We use shadows to convey depth and focus:
*   `--shadow-sm`: `0 1px 3px rgba(0, 0, 0, 0.3)` — Used for small interactive components (buttons, badges).
*   `--shadow-md`: `0 4px 16px rgba(0, 0, 0, 0.4)` — Used for elevated container surfaces (recent project cards, tooltips).
*   `--shadow-lg`: `0 12px 40px rgba(0, 0, 0, 0.5)` — Used for massive viewport components (modals, overlays, dropdown panels).
*   `--shadow-glow-accent`: `0 0 30px rgba(124, 92, 231, 0.2)` — Visual focus glow for AI suggestion panels.

---

## 4. Glassmorphism Design Rules

Glassmorphism provides the defining aesthetic layer for DemoFlow.

### 4.1 Implementation Mixin
To apply a glass surface, components use the `@include glass-panel` mixin:
```scss
@mixin glass-panel {
  background: var(--color-bg-glass, rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-border-glass, rgba(255, 255, 255, 0.08));
}
```

### 4.2 Application Guidelines
1.  **Never stack glass on glass:** Stacking multiple blurred containers increases CPU rendering latency.
2.  **Strict border contrast:** Always use `--color-border-glass` for border outlines on glass panels to ensure high contrast against dark base layers.
3.  **Background support:** Ensure the background canvas behind glass contains subtle color shifts or blur artifacts to make the transparency effect pop.

---

## 5. Motion & Animation System

Animations should be short, functional, and natural.

### 5.1 Timings & Curves
*   `--duration-fast`: `150ms` — Used for micro-interactions (button press, dropdown hovers).
*   `--duration-normal`: `250ms` — Used for page transitions, drawer sliders, and alert overlays.
*   `--duration-slow`: `400ms` — Used for image transitions.
*   `--easing-smooth`: `cubic-bezier(0.4, 0, 0.2, 1)` — Standard ease-in-out.
*   `--easing-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)` — Natural elastic rebound bounce.

### 5.2 Global Animation Mixins
*   `@include animate-fade-in`: Transitions element opacity from `0` to `1`.
*   `@include animate-scale-in`: Smooth zoom scale `0.95` to `1` combined with spring easing.
*   `@include animate-slide-up`: Slides elements from `16px` offset up into active page position.

---

## 6. Accessibility & Focus Rules

### 6.1 WCAG AA Compliance
*   **Contrast:** Primary and secondary text on base backgrounds maintains a contrast ratio of `4.5:1` or higher.
*   **No Color-Only Indicators:** Warning states, success messages, and errors include supporting icons or descriptive text labels.

### 6.2 Focus States
All interactive elements include a keyboard-visible focus outline via the `@include focus-ring` mixin:
```scss
@mixin focus-ring {
  outline: none;
  
  &:focus-visible {
    box-shadow: 0 0 0 2px var(--color-bg-base), 0 0 0 4px var(--color-border-focus, #7c5ce7);
  }
}
```
This isolates the focus shadow from standard element borders, preventing content shifts.

---

## 7. Component Specifications

### 7.1 Buttons
*   **Variants:** `primary` (accent bg), `secondary` (surface bg), `ghost` (transparent), `outline` (border-only), `danger` (red bg).
*   **Sizes:** `xs` (micro paddings, 11px text), `sm` (compact, 12px text), `md` (standard, 14px text), `lg` (large call-to-actions, 16px text).

### 7.2 Inputs
*   **States:** `default` (normal border), `success` (green focus ring), `error` (red validation border), `disabled` (lowered opacity, locked pointer).
*   **Forms:** Implements `ControlValueAccessor` to support dynamic state verification in Angular Reactive Forms.

### 7.3 Cards
*   **glass**: Transparent, backdrop blur, thin border.
*   **solid**: Matte background, standard border.
*   **elevated**: Shaded overlay background, drop-shadow elevation.

### 7.4 Modals
*   Enforces backdrop-blur filter on overlay backdrop. Uses `@include animate-scale-in` for elastic modal entry. Fully accessible for focus-trap utility attachments.

---

## 8. Dark Theme Guidelines
*   **Dark is Default:** Ensure all components resolve properly against dark token values.
*   **Light Theme overrides:** Always run theme toggles by appending `[data-theme="light"]` attribute to the root HTML node. Avoid inline inline-style background rewrites.
