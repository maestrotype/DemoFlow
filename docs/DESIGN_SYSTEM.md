# DemoFlow — Design System

> **Version:** 1.0.0
> **Design language:** Dark-first · Glassmorphism · Apple-inspired precision
> **Implementation:** CSS Custom Properties + TailwindCSS utility layer
> **Last updated:** 2026-06-24

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Spacing System](#2-spacing-system)
3. [Typography](#3-typography)
4. [Color System](#4-color-system)
5. [Shadows & Elevation](#5-shadows--elevation)
6. [Border Radius](#6-border-radius)
7. [Motion & Animation](#7-motion--animation)
8. [Glass Surfaces](#8-glass-surfaces)
9. [Component Tokens](#9-component-tokens)
   - 9.1 [Cards](#91-cards)
   - 9.2 [Buttons](#92-buttons)
   - 9.3 [Inputs & Forms](#93-inputs--forms)
   - 9.4 [Badges & Tags](#94-badges--tags)
   - 9.5 [Dialogs & Modals](#95-dialogs--modals)
   - 9.6 [Toasts & Notifications](#96-toasts--notifications)
   - 9.7 [Navigation](#97-navigation)
   - 9.8 [Progress & Loading](#98-progress--loading)
10. [Icons](#10-icons)
11. [Responsive Breakpoints](#11-responsive-breakpoints)
12. [Accessibility Standards](#12-accessibility-standards)
13. [Theme Architecture](#13-theme-architecture)
14. [CSS Token Reference](#14-css-token-reference)

---

## 1. Design Principles

These six principles govern every design decision in DemoFlow.

### 1.1 Dark First, Light Supported
Dark mode is the primary experience. Light mode is a supported alternative, not an afterthought. Every color token has both dark and light values. No component hardcodes a color — all use tokens.

### 1.2 Clarity Over Decoration
Every visual element must earn its place. If removing it makes the UI clearer, remove it. No decorative gradients that don't add meaning. No animations that don't add information.

### 1.3 Precision Spacing
All spacing is on a 4px grid. No exceptions. `17px` margins do not exist. `16px` or `20px`. A consistent rhythm is what separates professional from amateur.

### 1.4 Accessible by Default
Contrast ratios meet WCAG AA at minimum. All interactive elements are keyboard accessible. Focus rings are always visible. No color is the sole carrier of information.

### 1.5 Tokens, Not Values
No hardcoded color values in components. No hardcoded font sizes. No hardcoded spacing. Everything references a CSS Custom Property. This is what makes theming possible.

### 1.6 Motion Has Purpose
Animations are functional: they communicate state changes, hierarchy, and relationships. The default easing is `ease-out` (feels natural, decelerates). Spring easing for elements that enter the viewport. Never animate layout shifts.

---

## 2. Spacing System

Base unit: **4px**. All spacing is a multiple of this.

```
Token         Value    Usage
────────────────────────────────────────────────────────────────
--space-0     0px      Intentional zero
--space-px    1px      Hairline borders, dividers
--space-1     4px      Icon-to-label gap, tight internal padding
--space-2     8px      Badge padding, compact element gaps
--space-3     12px     Small component internal padding
--space-4     16px     Standard padding — buttons, inputs, cards
--space-5     20px     Medium gaps between sibling components
--space-6     24px     Card padding, section internal padding
--space-8     32px     Between content blocks
--space-10    40px     Major section spacing
--space-12    48px     Hero area vertical padding
--space-16    64px     Large layout section gaps
--space-20    80px     Page-level outer padding (large screens)
--space-24    96px     Page-level section separation
--space-32    128px    Maximum — landing page block margins
```

### Usage Guidelines

| Context | Tokens to use |
|---|---|
| Inside a component (padding) | `--space-2` to `--space-6` |
| Between sibling components | `--space-4` to `--space-8` |
| Between layout sections | `--space-10` to `--space-16` |
| Page outer padding (desktop) | `--space-10` to `--space-16` |
| Page outer padding (mobile) | `--space-4` to `--space-6` |
| Inline text-element gap | `--space-1` to `--space-2` |

### Inset Shorthand Patterns

```
Card padding:         --space-5 (20px all sides)
Card padding large:   --space-6 (24px all sides)
Button padding:       --space-2 --space-4 (8px 16px)
Button padding sm:    --space-1 --space-3 (4px 12px)
Input padding:        --space-2 --space-3 (8px 12px)
Badge padding:        --space-1 --space-2 (4px 8px)
Modal padding:        --space-6 (24px all sides)
Sidebar item:         --space-2 --space-3 (8px 12px)
```

---

## 3. Typography

### Font Families

```
--font-sans:  'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
--font-mono:  'JetBrains Mono', 'Fira Code', ui-monospace, monospace
```

Inter Variable is loaded from Google Fonts with `display=swap` and preconnect hint. Only weights 400, 500, 600, 700 are loaded.

### Type Scale

| Token | Size | Line height | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `--text-2xs` | 11px | 1.4 | 400 | +0.01em | Micro labels |
| `--text-xs` | 12px | 1.4 | 400 | +0.01em | Captions, timestamps |
| `--text-sm` | 13px | 1.45 | 400 | +0.005em | Secondary body, hints |
| `--text-base` | 14px | 1.5 | 400 | 0 | Primary body text |
| `--text-md` | 16px | 1.4 | 500 | -0.005em | Label large, nav items |
| `--text-lg` | 18px | 1.35 | 500 | -0.01em | Subtitle, card heading |
| `--text-xl` | 20px | 1.3 | 600 | -0.01em | Section heading |
| `--text-2xl` | 24px | 1.25 | 600 | -0.015em | Page subtitle |
| `--text-3xl` | 30px | 1.2 | 700 | -0.02em | Page title |
| `--text-4xl` | 36px | 1.15 | 700 | -0.025em | Large heading |
| `--text-5xl` | 48px | 1.1 | 700 | -0.03em | Hero (landing only) |
| `--text-6xl` | 60px | 1.05 | 700 | -0.03em | Display (landing only) |

### Semantic Text Roles

| Role | Token | Weight | Use |
|---|---|---|---|
| `display` | `--text-5xl` / `--text-6xl` | 700 | Landing page hero only |
| `page-title` | `--text-3xl` | 700 | H1 of each page |
| `section-title` | `--text-xl` | 600 | Section headings, H2 |
| `card-title` | `--text-lg` | 600 | Card headlines |
| `label` | `--text-md` | 500 | Form labels, nav items |
| `body` | `--text-base` | 400 | All body content |
| `secondary` | `--text-sm` | 400 | Descriptions, meta |
| `caption` | `--text-xs` | 400 | Timestamps, file info |
| `micro` | `--text-2xs` | 400 | Badges, indicators |
| `mono` | `--text-sm` | 400 | Code, shortcuts, IDs |

### Typography Rules

1. **Max 3 size levels per screen** — never show display + page-title + section-title simultaneously
2. **Never set font-size in px directly** — always use a token
3. **Line length cap** — body text max `65ch`, secondary text max `75ch`
4. **Heading hierarchy** — one H1 per page, always
5. **Mono for technical content** — file names, IDs, keyboard shortcuts, code

---

## 4. Color System

All colors are CSS Custom Properties in HSL. Dark theme is default (`[data-theme="dark"]`). Light theme applies `[data-theme="light"]` to `<html>`.

### 4.1 Background Colors

```
Token                   Dark                          Light
──────────────────────────────────────────────────────────────────────
--color-bg-base         hsl(225 14% 5.5%)             hsl(220 20% 97%)
                        #0c0d14  (deepest)             #f3f5fb

--color-bg-elevated     hsl(225 12% 8%)               hsl(0 0% 100%)
                        #10111c  (sidebar/panels)      #ffffff

--color-bg-surface      hsl(225 11% 11%)              hsl(220 20% 99%)
                        #16182a  (cards)               #fafbff

--color-bg-overlay      hsl(225 10% 15%)              hsl(220 15% 95%)
                        #1e2030  (dropdowns)           #f0f2f8

--color-bg-subtle       hsl(225 10% 13%)              hsl(220 20% 96%)
                        #191b2b  (hover bg)            #f1f3fa

--color-bg-glass        hsl(225 14% 18% / 55%)        hsl(0 0% 100% / 70%)
                        (glassmorphism dark)           (glassmorphism light)
```

### 4.2 Border Colors

```
Token                   Dark                          Light
──────────────────────────────────────────────────────────────────────
--color-border          hsl(225 10% 20%)              hsl(220 15% 88%)
--color-border-subtle   hsl(225 10% 14%)              hsl(220 15% 93%)
--color-border-focus    hsl(255 80% 65% / 60%)        hsl(255 80% 55% / 50%)
--color-border-glass    hsl(0 0% 100% / 8%)           hsl(0 0% 0% / 8%)
--color-border-error    hsl(3 85% 62% / 60%)          hsl(3 85% 50% / 50%)
```

### 4.3 Brand & Accent

```
Token                   Value                         Notes
──────────────────────────────────────────────────────────────────────
--color-accent          hsl(255 80% 65%)              #7c5ce7  Primary violet
--color-accent-hover    hsl(255 80% 72%)              Hover state
--color-accent-active   hsl(255 80% 58%)              Pressed state
--color-accent-subtle   hsl(255 80% 65% / 12%)        Background tint
--color-accent-muted    hsl(255 80% 65% / 30%)        Intermediate tint
--color-accent-2        hsl(200 80% 60%)              #33b5e5  Electric blue
--color-accent-3        hsl(280 70% 60%)              #9b59e8  Deep purple
--color-ai-glow         hsl(255 80% 65% / 20%)        AI panel ambient glow
```

### 4.4 Semantic Colors

```
Token                   Dark                          Light
──────────────────────────────────────────────────────────────────────
--color-success         hsl(145 65% 52%)              hsl(145 65% 38%)
--color-success-subtle  hsl(145 65% 52% / 12%)        hsl(145 65% 92%)
--color-warning         hsl(38 90% 58%)               hsl(38 90% 42%)
--color-warning-subtle  hsl(38 90% 58% / 12%)         hsl(38 90% 93%)
--color-error           hsl(3 85% 62%)                hsl(3 85% 48%)
--color-error-subtle    hsl(3 85% 62% / 12%)          hsl(3 85% 94%)
--color-info            hsl(200 80% 60%)              hsl(200 80% 40%)
--color-info-subtle     hsl(200 80% 60% / 12%)        hsl(200 80% 93%)
```

### 4.5 Text Colors

```
Token                    Dark                         Light
──────────────────────────────────────────────────────────────────────
--color-text-primary     hsl(225 10% 95%)             hsl(225 25% 12%)
--color-text-secondary   hsl(225 10% 65%)             hsl(225 15% 38%)
--color-text-muted       hsl(225 10% 42%)             hsl(225 12% 58%)
--color-text-placeholder hsl(225 10% 35%)             hsl(225 12% 65%)
--color-text-disabled    hsl(225 10% 28%)             hsl(225 12% 72%)
--color-text-accent      hsl(255 80% 72%)             hsl(255 80% 48%)
--color-text-inverse     hsl(225 14% 5.5%)            hsl(225 10% 95%)
--color-text-success     hsl(145 65% 60%)             hsl(145 65% 32%)
--color-text-warning     hsl(38 90% 65%)              hsl(38 90% 35%)
--color-text-error       hsl(3 85% 68%)               hsl(3 85% 42%)
```

### 4.6 Color Usage Rules

1. **Never use hex values in components** — only CSS tokens
2. **Background levels** — base → elevated → surface → overlay (each lighter)
3. **Text on glass surfaces** — always `--color-text-primary` or `--color-text-secondary`
4. **Semantic colors** — use `-subtle` variant for backgrounds, main for text/borders
5. **Accent** — only for primary CTAs, active states, focus rings, and AI indicators
6. **Contrast minimum** — text vs background must meet WCAG AA (4.5:1 normal, 3:1 large)

---

## 5. Shadows & Elevation

Shadows communicate elevation — how far above the base layer a surface floats.

```
Token              Value                                              Level
──────────────────────────────────────────────────────────────────────────────
--shadow-xs        0 1px 2px hsl(0 0% 0% / 25%)                    0 — inline
--shadow-sm        0 1px 4px hsl(0 0% 0% / 30%),                   1 — cards
                   0 1px 2px hsl(0 0% 0% / 20%)
--shadow-md        0 4px 12px hsl(0 0% 0% / 35%),                  2 — dropdowns
                   0 2px 4px hsl(0 0% 0% / 20%)
--shadow-lg        0 8px 24px hsl(0 0% 0% / 40%),                  3 — modals
                   0 4px 8px hsl(0 0% 0% / 25%)
--shadow-xl        0 16px 48px hsl(0 0% 0% / 45%),                 4 — floating
                   0 8px 16px hsl(0 0% 0% / 30%)
--shadow-2xl       0 24px 64px hsl(0 0% 0% / 55%),                 5 — max
                   0 12px 24px hsl(0 0% 0% / 35%)

--shadow-inset     inset 0 1px 0 hsl(0 0% 100% / 6%)               Top edge highlight

--shadow-glow-sm   0 0 12px hsl(255 80% 65% / 15%)                 Accent glow subtle
--shadow-glow-md   0 0 24px hsl(255 80% 65% / 22%)                 Accent glow medium
--shadow-glow-lg   0 0 48px hsl(255 80% 65% / 28%)                 Accent glow strong

--shadow-glow-success  0 0 20px hsl(145 65% 52% / 20%)
--shadow-glow-error    0 0 20px hsl(3 85% 62% / 20%)
```

### Elevation Assignment

| Component | Shadow |
|---|---|
| Canvas / page background | None |
| Cards (static) | `--shadow-sm` |
| Cards (hover) | `--shadow-md` |
| Sidebar | None — uses border |
| Topbar | `--shadow-sm` + border |
| Dropdowns / context menus | `--shadow-lg` |
| Modals | `--shadow-xl` |
| Tooltips | `--shadow-2xl` |
| Active primary button | `--shadow-glow-sm` |
| AI panel | `--shadow-glow-sm` + `--shadow-lg` |

---

## 6. Border Radius

```
Token           Value     Use
──────────────────────────────────────────────────────────────────────
--radius-none   0px       Tables, images bleeding to edges
--radius-sm     4px       Badges, tags, code blocks
--radius-md     8px       Buttons, inputs, dropdowns
--radius-lg     12px      Standard cards, panels
--radius-xl     16px      Modals, large panels
--radius-2xl    20px      Glassmorphism surfaces
--radius-3xl    28px      Large hero cards
--radius-full   9999px    Pills, avatars, toggles
```

### Radius Rules

- Interactive elements (buttons, inputs) → `--radius-md`
- Content containers (cards) → `--radius-lg`
- Overlays (modals, slide-overs) → `--radius-xl`
- Glass surfaces → `--radius-2xl` or larger
- Nested components match or use smaller radius than parent

---

## 7. Motion & Animation

### Duration Tokens

```
Token                 Value    Use
──────────────────────────────────────────────────────────────────────
--duration-instant    50ms     State color changes, opacity flips
--duration-fast       120ms    Hover effects, small transitions
--duration-normal     220ms    Most UI transitions
--duration-slow       380ms    Page transitions, panel slides
--duration-slower     550ms    Modal enter, complex sequences
--duration-sluggish   800ms    Onboarding animations only
```

### Easing Tokens

```
Token                 Value                              Use
──────────────────────────────────────────────────────────────────────
--ease-linear         linear                             Progress bars
--ease-in             cubic-bezier(0.4, 0, 1, 1)         Exit animations
--ease-out            cubic-bezier(0, 0, 0.2, 1)         Enter animations (default)
--ease-smooth         cubic-bezier(0.4, 0, 0.2, 1)       General state changes
--ease-spring         cubic-bezier(0.34, 1.56, 0.64, 1)  Elements entering viewport
--ease-bounce         cubic-bezier(0.68,-0.55, 0.27,1.55) Celebratory moments only
```

### Animation Catalog

| Animation | Duration | Easing | Trigger |
|---|---|---|---|
| Button hover lift | `--duration-fast` | `--ease-out` | `:hover` |
| Card hover lift | `--duration-normal` | `--ease-out` | `:hover` |
| Modal enter | `--duration-slower` | `--ease-spring` | Open |
| Modal exit | `--duration-fast` | `--ease-in` | Close |
| Sidebar collapse | `--duration-normal` | `--ease-smooth` | Toggle |
| Toast enter | `--duration-normal` | `--ease-spring` | Push |
| Toast exit | `--duration-fast` | `--ease-in` | Dismiss |
| Page transition | `--duration-slow` | `--ease-out` | Route change |
| Dropdown open | `--duration-fast` | `--ease-spring` | Trigger |
| AI suggestions stagger | `--duration-normal` | `--ease-spring` | +40ms per card |
| Hotspot pulse | 2s | `ease-in-out` | Continuous loop |
| Skeleton shimmer | 1.5s | `linear` | Loading state |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animations must degrade gracefully to an instant state change.

---

## 8. Glass Surfaces

Glassmorphism creates a sense of depth and premium quality. Use it **sparingly** — on at most 3 surfaces visible simultaneously.

### Glass Recipe

```css
.glass-surface {
  background: var(--color-bg-glass);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid var(--color-border-glass);
  box-shadow:
    0 8px 32px hsl(0 0% 0% / 40%),
    inset 0 1px 0 hsl(0 0% 100% / 6%);
  border-radius: var(--radius-2xl);
}
```

### Glass Variants

| Variant | Blur | Opacity | Radius | Use |
|---|---|---|---|---|
| `glass-modal` | 24px | 55% | `--radius-xl` | Dialogs |
| `glass-panel` | 16px | 60% | `--radius-lg` | Side panels |
| `glass-topbar` | 12px | 70% | none | Full-width topbar |
| `glass-toast` | 20px | 55% | `--radius-lg` | Toast stack |
| `glass-tooltip` | 8px | 70% | `--radius-md` | Tooltips |

### Where Glass Is Used

| Surface | Glass? | Reason |
|---|---|---|
| Modals / dialogs | ✅ Yes | Floats above content |
| Onboarding overlay | ✅ Yes | Hero moment |
| AI assistant panel | ✅ Yes | Premium feature feeling |
| Topbar (editor) | ✅ Yes | Overlays canvas |
| Toast notifications | ✅ Yes | Float above everything |
| Context menus | ✅ Yes | Floating panel |
| Sidebar | ❌ No | Solid `--color-bg-elevated` |
| Cards | ❌ No | Solid `--color-bg-surface` |
| Form inputs | ❌ No | Solid `--color-bg-overlay` |
| Canvas background | ❌ No | Pure base color |

### Glass Rules

1. Glass requires a non-uniform background to work — don't use on flat-color areas
2. Always include `border: 1px solid var(--color-border-glass)` — this defines the surface edge
3. `inset 0 1px 0 hsl(0 0% 100% / 6%)` — the top highlight makes it look glassy
4. `backdrop-filter` requires browser support. Fallback: solid `--color-bg-surface`
5. Never nest glass inside glass

---

## 9. Component Tokens

### 9.1 Cards

```
Card (base)
  background:    var(--color-bg-surface)
  border:        1px solid var(--color-border-subtle)
  border-radius: var(--radius-lg)
  padding:       var(--space-5)
  box-shadow:    var(--shadow-sm)

Card (interactive — adds hover)
  cursor:        pointer
  transition:    all var(--duration-normal) var(--ease-out)
  :hover
    border-color: var(--color-border)
    box-shadow:   var(--shadow-md)
    transform:    translateY(-2px)

Card (selected / active)
  border-color: var(--color-accent)
  box-shadow:   var(--shadow-glow-sm), var(--shadow-md)

Card (elevated — floating)
  background:    var(--color-bg-overlay)
  box-shadow:    var(--shadow-lg)
```

### 9.2 Buttons

```
Button base
  height:         36px (default)  |  32px (sm)  |  40px (lg)
  padding:        var(--space-2) var(--space-4)
  border-radius:  var(--radius-md)
  font-size:      var(--text-sm)
  font-weight:    500
  transition:     all var(--duration-fast) var(--ease-out)
  white-space:    nowrap

Primary
  background:   var(--color-accent)
  color:        white
  border:       none
  :hover        background: var(--color-accent-hover), transform: translateY(-1px)
  :active       background: var(--color-accent-active), transform: scale(0.98)
  :focus-visible outline: 2px solid var(--color-border-focus), outline-offset: 2px

Secondary
  background:   var(--color-bg-overlay)
  color:        var(--color-text-primary)
  border:       1px solid var(--color-border)
  :hover        background: var(--color-bg-subtle)

Ghost
  background:   transparent
  color:        var(--color-text-secondary)
  border:       none
  :hover        background: var(--color-bg-subtle), color: var(--color-text-primary)

Danger
  background:   transparent
  color:        var(--color-error)
  border:       1px solid var(--color-error)
  :hover        background: var(--color-error-subtle)
  [confirmed]   background: var(--color-error), color: white

Icon Button
  width = height: 32px (sm) / 36px (md) / 40px (lg)
  background:   transparent
  border-radius: var(--radius-md)
  :hover        background: var(--color-bg-subtle)

Disabled (all variants)
  opacity:      0.4
  cursor:       not-allowed
  pointer-events: none

Loading (all variants)
  Show spinner, maintain size, disable interactions
```

### 9.3 Inputs & Forms

```
Input (base)
  height:        36px
  padding:       var(--space-2) var(--space-3)
  background:    var(--color-bg-overlay)
  border:        1px solid var(--color-border)
  border-radius: var(--radius-md)
  color:         var(--color-text-primary)
  font-size:     var(--text-sm)
  transition:    border-color var(--duration-fast), box-shadow var(--duration-fast)

  :placeholder   color: var(--color-text-placeholder)
  :focus         border-color: var(--color-border-focus)
                 box-shadow: 0 0 0 3px var(--color-accent-subtle)
                 outline: none
  :disabled      opacity: 0.5, cursor: not-allowed
  [error]        border-color: var(--color-border-error)
                 box-shadow: 0 0 0 3px var(--color-error-subtle)

Textarea
  Same as input, min-height: 80px, resize: vertical

Label
  font-size:     var(--text-sm)
  font-weight:   500
  color:         var(--color-text-secondary)
  margin-bottom: var(--space-1)

Helper text / Error text
  font-size:     var(--text-xs)
  margin-top:    var(--space-1)
  Helper color:  var(--color-text-muted)
  Error color:   var(--color-text-error)

Checkbox
  16×16px, border-radius: var(--radius-sm)
  Unchecked: border 1px solid var(--color-border)
  Checked:   background var(--color-accent), white checkmark

Toggle switch
  Width: 36px, height: 20px, border-radius: var(--radius-full)
  Off:   background: var(--color-bg-overlay), border: 1px solid var(--color-border)
  On:    background: var(--color-accent)
  Transition: var(--duration-fast) var(--ease-smooth)
```

### 9.4 Badges & Tags

```
Badge (status indicator)
  padding:       var(--space-1) var(--space-2)
  border-radius: var(--radius-full)
  font-size:     var(--text-2xs)
  font-weight:   500
  text-transform: uppercase
  letter-spacing: +0.02em

Variants:
  default   bg: --color-bg-overlay,    text: --color-text-secondary
  accent    bg: --color-accent-subtle, text: --color-text-accent
  success   bg: --color-success-subtle,text: --color-text-success
  warning   bg: --color-warning-subtle,text: --color-text-warning
  error     bg: --color-error-subtle,  text: --color-text-error

Tag (user-generated label)
  padding:       var(--space-1) var(--space-2)
  border-radius: var(--radius-sm)
  font-size:     var(--text-xs)
  background:    var(--color-bg-overlay)
  border:        1px solid var(--color-border-subtle)
  color:         var(--color-text-secondary)
  [removable]    Show × icon on hover
```

### 9.5 Dialogs & Modals

```
Backdrop
  position:        fixed, inset: 0
  background:      hsl(0 0% 0% / 60%)
  backdrop-filter: blur(4px)
  z-index:         50

Modal card
  class:           glass-modal
  width:           480px (sm) / 560px (md) / 720px (lg)
  max-width:       calc(100vw - var(--space-8))
  max-height:      calc(100vh - var(--space-16))
  overflow-y:      auto
  z-index:         51
  position:        fixed, centered

Structure:
  Header:  padding --space-6, border-bottom 1px solid --color-border-subtle
  Body:    padding --space-6, scrollable
  Footer:  padding --space-4 --space-6, border-top, flex, justify-end, gap --space-2

Animation:
  Enter: opacity 0→1 + scale 0.95→1, --duration-slower, --ease-spring
  Exit:  opacity 1→0 + scale 1→0.95, --duration-fast, --ease-in

Slide-over panel
  Position:    fixed right 0, top 0, bottom 0
  Width:       480px
  Border-left: 1px solid var(--color-border)
  Box-shadow:  var(--shadow-xl)
  Animation:   translateX(100%)→0, --duration-slow, --ease-out
```

### 9.6 Toasts & Notifications

```
Toast container
  Position: fixed, bottom: --space-6, right: --space-6
  z-index:  100
  display:  flex, flex-direction: column-reverse, gap: --space-2

Toast item
  width:         320px
  padding:       var(--space-4)
  border-radius: var(--radius-lg)
  class:         glass-toast
  border-left:   3px solid (variant color)

Variants:
  success   --color-success,  checkmark icon
  error     --color-error,    alert-circle icon
  warning   --color-warning,  alert-triangle icon
  info      --color-info,     info icon
  loading   --color-accent,   spinner (animated)

Auto-dismiss:
  success / info:  4000ms
  warning:         6000ms
  error:           Never (user must close)
  loading:         Resolves to success or error

Max stack: 3 toasts. Oldest dismissed when 4th is pushed.
```

### 9.7 Navigation

```
Sidebar
  Width:         260px (expanded) / 56px (collapsed)
  Background:    var(--color-bg-elevated)
  Border-right:  1px solid var(--color-border-subtle)
  Transition:    width var(--duration-normal) var(--ease-smooth)

Nav item
  Height:        36px
  Padding:       var(--space-2) var(--space-3)
  Border-radius: var(--radius-md)
  Color:         var(--color-text-secondary)
  Font:          var(--text-sm) weight 500

  :hover         background: --color-bg-subtle, color: --color-text-primary
  [active]       background: --color-accent-subtle
                 color: --color-text-accent
                 font-weight: 600

Sidebar section label
  Font:          var(--text-2xs) weight 600
  Color:         var(--color-text-muted)
  Padding:       var(--space-2) var(--space-3)
  Letter-spacing: +0.06em
  Text-transform: uppercase

Topbar
  Height:        52px
  Background:    var(--color-bg-elevated)
  Border-bottom: 1px solid var(--color-border-subtle)
  Padding:       0 var(--space-6)
```

### 9.8 Progress & Loading

```
Linear Progress Bar
  Height:        3px (thin) / 6px (standard)
  Background:    var(--color-bg-overlay)
  Fill:          var(--color-accent)
  Border-radius: var(--radius-full)

Circular Progress Ring (SVG)
  Size:          32px (sm) / 48px (md) / 64px (lg)
  Stroke:        var(--color-accent)
  Track:         var(--color-bg-overlay)

Spinner
  Size:          16px (inline) / 24px (block)
  Animation:     rotate 700ms linear infinite

Skeleton Loader
  background: linear-gradient(
    90deg,
    var(--color-bg-overlay) 25%,
    var(--color-bg-subtle) 50%,
    var(--color-bg-overlay) 75%
  )
  background-size: 200% 100%
  animation: shimmer 1.5s linear infinite
```

---

## 10. Icons

**Primary library:** Lucide (consistent stroke style, tree-shakable)
**Fallback:** Phosphor Icons

### Icon Sizes

| Size | Use |
|---|---|
| 12px | Inline with `--text-xs`, micro indicators |
| 14px | Inline with `--text-sm` |
| 16px | **Default** — buttons, nav items, forms |
| 20px | Card-level icons, section indicators |
| 24px | Empty state icons (small) |
| 32px | Feature icons, onboarding |
| 48px | Empty state illustrations |

### Icon Color Rules

- Icons inherit `currentColor` — always set via parent text color token
- Active/selected: `var(--color-accent)` or `var(--color-text-accent)`
- Disabled: `var(--color-text-disabled)`
- Semantic: use `--color-success`, `--color-error` for status icons
- Never use multiple colors in a single icon

---

## 11. Responsive Breakpoints

```
--breakpoint-sm:    640px    (large phone, landscape)
--breakpoint-md:    768px    (tablet portrait)
--breakpoint-lg:    1024px   (small desktop)
--breakpoint-xl:    1280px   (standard desktop)
--breakpoint-2xl:   1536px   (wide desktop)
```

### Feature Availability by Breakpoint

| Feature | < 768px | 768–1024px | > 1024px |
|---|---|---|---|
| Public demo player | ✅ Full | ✅ Full | ✅ Full |
| Dashboard | ✅ Single col | ✅ 2 col | ✅ 3 col |
| Project list | ✅ List view | ✅ Grid 2 col | ✅ Grid 3+ col |
| Media library | ✅ Grid 2 col | ✅ Grid 3 col | ✅ Grid 4+ col |
| Scene editor | ❌ Blocked | ⚠️ View only | ✅ Full |
| Sidebar | ❌ Bottom nav | ⚠️ Collapsed | ✅ Expanded |
| Properties panel | ❌ Bottom sheet | ⚠️ Slide-over | ✅ Docked |

---

## 12. Accessibility Standards

### Contrast Requirements

| Text type | Minimum ratio | Target |
|---|---|---|
| Body text (< 18px, non-bold) | 4.5:1 (AA) | 7:1 (AAA) |
| Large text (≥ 18px or ≥ 14px bold) | 3:1 (AA) | 4.5:1 |
| UI components (inputs, buttons) | 3:1 | 4.5:1 |
| Focus indicators | 3:1 against adjacent color | — |

### Keyboard Navigation Requirements

- All interactive elements reachable via `Tab`
- Logical tab order matches visual order
- `Escape` closes all modals, dropdowns, panels
- Arrow keys navigate within menus, dropdowns, tabs
- `Enter` / `Space` activate buttons and controls
- Focus trap inside open modals
- Skip-to-content link as first focusable element

### Focus Rings

```css
:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: inherit;
}
```

Never `:focus { outline: none }` without a visible alternative.

### ARIA Requirements

| Element | Required attributes |
|---|---|
| Icon-only buttons | `aria-label` |
| Modals | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Toast alerts | `role="alert"` (error) or `role="status"` (info) |
| Loading states | `aria-busy="true"` on container |
| Progress bars | `role="progressbar"`, `aria-valuenow`, `aria-valuemax` |
| Required fields | `aria-required="true"` |
| Error messages | `aria-describedby` linking field to error |

---

## 13. Theme Architecture

### Angular ThemeService

```
ThemeService (providedIn: 'root')
├── theme:         Signal<'dark' | 'light' | 'system'>
├── resolvedTheme: Signal<'dark' | 'light'>  (computed)
├── setTheme(t):   void → writes localStorage + <html> data-theme
├── toggle():      void
└── init():        called in APP_INITIALIZER

Init sequence:
  1. Read localStorage 'df-theme'
  2. If 'system': check matchMedia('prefers-color-scheme: dark')
  3. Apply [data-theme="dark|light"] to <html>
  4. Listen to OS preference changes
```

### CSS Architecture

```
styles/
  tokens/
    color.css          :root with --color-* tokens (dark default)
    spacing.css        :root with --space-* tokens
    typography.css     :root with --text-*, --font-*, --weight-* tokens
    shadow.css         :root with --shadow-* tokens
    radius.css         :root with --radius-* tokens
    motion.css         :root with --duration-*, --ease-* tokens
  themes/
    dark.css           [data-theme="dark"] { ... }
    light.css          [data-theme="light"] { ... }
  base.css             HTML reset + base element styles
  animations.css       @keyframes definitions
  global.css           @import orchestrator
```

### FOUC Prevention

```html
<!-- In <head>, inline, before CSS loads -->
<script>
  const t = localStorage.getItem('df-theme') || 'dark';
  const r = t === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : t;
  document.documentElement.setAttribute('data-theme', r);
</script>
```

---

## 14. CSS Token Reference

Complete list of all CSS Custom Properties.

```css
/* SPACING */
--space-0: 0px;       --space-px: 1px;    --space-1: 4px;
--space-2: 8px;       --space-3: 12px;    --space-4: 16px;
--space-5: 20px;      --space-6: 24px;    --space-8: 32px;
--space-10: 40px;     --space-12: 48px;   --space-16: 64px;
--space-20: 80px;     --space-24: 96px;   --space-32: 128px;

/* TYPOGRAPHY */
--font-sans: 'Inter Variable', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
--text-2xs: 0.6875rem;  --text-xs: 0.75rem;    --text-sm: 0.8125rem;
--text-base: 0.875rem;  --text-md: 1rem;        --text-lg: 1.125rem;
--text-xl: 1.25rem;     --text-2xl: 1.5rem;     --text-3xl: 1.875rem;
--text-4xl: 2.25rem;    --text-5xl: 3rem;        --text-6xl: 3.75rem;
--weight-normal: 400;   --weight-medium: 500;
--weight-semibold: 600; --weight-bold: 700;

/* BORDER RADIUS */
--radius-none: 0;       --radius-sm: 4px;    --radius-md: 8px;
--radius-lg: 12px;      --radius-xl: 16px;   --radius-2xl: 20px;
--radius-3xl: 28px;     --radius-full: 9999px;

/* MOTION */
--duration-instant: 50ms;    --duration-fast: 120ms;
--duration-normal: 220ms;    --duration-slow: 380ms;
--duration-slower: 550ms;    --duration-sluggish: 800ms;
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.27, 1.55);

/* COLORS — all defined in tokens/color.css, overridden in themes/ */
/* Backgrounds */
--color-bg-base             --color-bg-elevated
--color-bg-surface          --color-bg-overlay
--color-bg-subtle           --color-bg-glass
/* Borders */
--color-border              --color-border-subtle
--color-border-focus        --color-border-glass        --color-border-error
/* Accent */
--color-accent              --color-accent-hover         --color-accent-active
--color-accent-subtle       --color-accent-muted
--color-accent-2            --color-accent-3             --color-ai-glow
/* Semantic */
--color-success             --color-success-subtle
--color-warning             --color-warning-subtle
--color-error               --color-error-subtle
--color-info                --color-info-subtle
/* Text */
--color-text-primary        --color-text-secondary       --color-text-muted
--color-text-placeholder    --color-text-disabled        --color-text-accent
--color-text-inverse        --color-text-success         --color-text-warning
--color-text-error

/* SHADOWS */
--shadow-xs    --shadow-sm    --shadow-md    --shadow-lg    --shadow-xl    --shadow-2xl
--shadow-inset
--shadow-glow-sm    --shadow-glow-md    --shadow-glow-lg
--shadow-glow-success    --shadow-glow-error
```

---

## Design System Token Adoption Audit

> Merged from `FRONTEND_AUDIT.md` (audited 2026-06-25). Tracks actual token usage in component styles.

| Token Category | Defined | Referenced in Components | Coverage |
|---|:---:|:---:|:---:|
| Spacing (`--space-*`) | 15 | 8 (`1,2,3,4,5,6,8,10`) | 53% |
| Typography (`--text-*`) | 12 | 6 (`2xs,xs,sm,base,md,xl,3xl`) | 50% |
| Radius (`--radius-*`) | 7 | 2 (`sm,md`) | 29% |
| Shadows (`--shadow-*`) | 4 | 2 (`lg, glow-accent`) | 50% |
| Colors (semantic) | ~30 | ~12 | 40% |
| Motion (`--duration-*`, `--easing-*`) | 8 | 2 (`fast, smooth`) | 25% |
| Z-index (`--z-index-*`) | 6 | 0 | **0%** |

# Mock Data Quality

Mock data must resemble a real commercial application.

Avoid tutorial names:

❌ Project Alpha
❌ Test Project
❌ Demo

Prefer realistic data:

✓ Marketing Campaign
✓ Product Launch
✓ Podcast Episode
✓ Travel Vlog
✓ YouTube Intro
✓ Client Presentation

Mock data should help evaluate the UI.

**Known gaps:**
- `glass.scss` mixin (`@mixin glass-panel`, `@mixin glass-text`) — defined but never `@include`d anywhere.
- `animations.scss` mixins (`animate-fade-in`, `animate-scale-in`, `animate-slide-up`) — defined but never applied.
- `--shadow-glow-accent` uses raw `rgba(124, 92, 231, 0.2)` instead of HSL token variables.
- Z-index tokens (`--z-index-*`) are defined in `tokens/z-index.scss` but have 0% adoption in templates.

*Update this table after each sprint to track adoption progress.*

---

*Last updated: 2026-06-27*
*Design System version must be bumped whenever tokens are added or changed.*
