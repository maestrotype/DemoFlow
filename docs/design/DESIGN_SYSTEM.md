# DemoFlow Design System

This document defines how every UI component must be implemented.

It is the single source of truth for UI architecture.

---

# Principles

DemoFlow is a commercial desktop-class application.

Priorities:

1. readability
2. scalability
3. consistency
4. maintainability

Never optimize for writing fewer lines of code.

Always optimize for long-term maintenance.

---

# Component Architecture

Every component has one responsibility.

Never combine unrelated UI into one component.

Large sections must be split into smaller reusable components.

Example:

ProjectsPage

├── ProjectsHero
├── ProjectStats
├── RecentProjects
├── QuickActions
└── EmptyState

NOT

ProjectsPage
    600 lines
    everything inside

---

# Component Size

Preferred limits.

Component TS

<150 lines

HTML

<120 lines

SCSS

<200 lines

If larger:

split component.

---

# Smart vs Dumb Components

Pages

Responsible for:

routing

page composition

state

Widgets

Responsible for:

feature composition

Entities

Responsible only for rendering entity data.

Shared UI

Contains generic reusable controls.

Never place business logic inside shared/ui.

---

# HTML Rules

Never create large HTML blocks.

Extract repeating blocks into components.

Avoid nesting deeper than 4 levels.

Avoid duplicated markup.

Prefer semantic HTML.

---

# Styling Rules

Never hardcode colors.

Use design tokens.

Never hardcode spacing.

Use spacing variables.

Never duplicate styles.

Extract reusable patterns.

Use Flex before Grid.

Use Grid only when Grid is actually needed.

---

# Mock Data

Temporary mock data is allowed.

Rules:

keep inside component

easy to remove

clearly separated

never mixed with business logic

---

# UI Quality

Every screen should look production-ready.

Avoid:

empty white pages

plain lists

unstyled buttons

placeholder layout

temporary appearance

Even mock screens should feel like a finished product.

---

# Visual Hierarchy

Each page should contain:

Hero section

Content section

Actions

Proper spacing

Clear typography hierarchy

Avoid placing everything in one vertical list.

---

# Responsive

Desktop first.

Support:

Desktop

Tablet

Mobile

Never break layout.

---

# Accessibility

Every input has label.

Buttons have accessible text.

Interactive elements have hover/focus states.

---

# Angular

Use:

Standalone Components

OnPush

Signals

computed()

effect()

input()

output()

Prefer inject().

Avoid decorators when Signals API exists.

---

# FSD

pages

compose widgets

widgets

compose features/entities

features

contain business logic

entities

render domain models

shared

contains reusable UI only

Never violate dependency direction.

---

# Code Quality

Never create components that only work for one screen if they can be reused.

Avoid duplicated HTML.

Avoid duplicated SCSS.

Avoid duplicated TS.

Extract repeated logic.

---

# Before Finishing Any UI Task

Verify:

✓ component is small

✓ HTML readable

✓ SCSS readable

✓ no duplicated markup

✓ no duplicated styles

✓ proper FSD layer

✓ responsive

✓ production-quality appearance

Only after verification consider the task complete.