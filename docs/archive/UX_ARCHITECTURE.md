# DemoFlow — UX / UI Architecture

> **Version:** 1.0.0  
> **Role:** Senior Product Designer · UX Architect · SaaS Founder  
> **Status:** Living Document  
> **Design Language:** Premium Dark-First SaaS · Glassmorphism · Apple-Inspired Clarity

---

## Table of Contents

1. [Information Architecture](#1-information-architecture)
2. [User Roles](#2-user-roles)
3. [User Flows](#3-user-flows)
4. [Pages — Full Inventory](#4-pages--full-inventory)
5. [Dashboard UX](#5-dashboard-ux)
6. [Editor UX](#6-editor-ux)
7. [Design System](#7-design-system)
8. [Mobile Strategy](#8-mobile-strategy)
9. [Premium SaaS Features](#9-premium-saas-features)
10. [MVP Scope Matrix](#10-mvp-scope-matrix)

---

## 1. Information Architecture

### 1.1 Application Zones

The application is divided into four distinct zones, each with a separate visual context and purpose:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ZONE 1: PUBLIC                                                         │
│  Marketing site, pricing, public demo player, shared demo links        │
│  → No auth required. SSR rendered. SEO optimized.                      │
├─────────────────────────────────────────────────────────────────────────┤
│  ZONE 2: AUTH                                                           │
│  Login, Register, Magic Link, Forgot Password                          │
│  → Minimal chrome. Centered card. Brand identity focus.                │
├─────────────────────────────────────────────────────────────────────────┤
│  ZONE 3: WORKSPACE APP                                                  │
│  Dashboard, Projects, Media Library, Templates, Settings, Billing      │
│  → Sidebar navigation. Persistent topbar. Content area.                │
├─────────────────────────────────────────────────────────────────────────┤
│  ZONE 4: EDITOR                                                         │
│  Scene Editor — full-screen, no sidebar, dedicated toolbar             │
│  → Maximum canvas space. Panels dock to edges. Zero distraction.       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 1.2 Navigation Hierarchy

```
DemoFlow
│
├── Public Zone
│   ├── / (Landing Page)
│   ├── /pricing
│   ├── /features
│   ├── /templates (public preview)
│   ├── /demo/:shareId (public player)
│   └── /blog (future)
│
├── Auth Zone
│   ├── /auth/login
│   ├── /auth/register
│   ├── /auth/magic-link
│   └── /auth/forgot-password
│
├── Workspace App Zone  [AuthGuard]
│   │
│   ├── / → /dashboard
│   ├── /dashboard
│   ├── /projects
│   │   └── /projects/:id
│   ├── /media
│   ├── /templates
│   ├── /exports
│   ├── /settings
│   │   ├── /settings/profile
│   │   ├── /settings/workspace
│   │   ├── /settings/members
│   │   ├── /settings/ai
│   │   ├── /settings/billing
│   │   └── /settings/danger
│   └── /onboarding  [shown once to new users]
│
└── Editor Zone  [AuthGuard + ProjectGuard]
    └── /projects/:id/editor
```

---

### 1.3 Workspace Structure

Each workspace is a multi-user tenant unit. The hierarchy inside a workspace is:

```
Workspace (e.g., "Acme Corp")
│
├── Members
│   ├── Owner (1)
│   ├── Admins (0–N)
│   └── Members (0–N)
│
├── Projects (0–N)
│   ├── Project: "Q1 Feature Launch"
│   │   ├── Type: Feature Announcement
│   │   ├── Scenes (1–N)
│   │   │   └── Layers (JSONB embedded)
│   │   └── Exports (0–N)
│   └── Project: "Onboarding Flow v2"
│
├── Media Library (shared across projects)
│   ├── Screenshots
│   ├── Screen Recordings
│   └── Images / GIFs
│
├── Templates (applied to create projects)
│
└── Settings
    ├── Brand Kit (color, logo)
    ├── AI Provider Configuration
    └── Billing / Plan
```

---

### 1.4 Sidebar Navigation Structure

Primary navigation lives in a collapsible sidebar (260px expanded / 56px collapsed icon-only):

```
┌─────────────────────┐
│  ◈ DemoFlow         │  ← Logo + workspace switcher
├─────────────────────┤
│  ⌘ Dashboard        │  ← Home
│  □ Projects         │  ← All projects
│  ◎ Media            │  ← Media library
│  ◧ Templates        │  ← Template gallery
│  ↓ Exports          │  ← Export center
├─────────────────────┤
│  AI Status  ●       │  ← AI provider health dot
├─────────────────────┤
│  ⚙ Settings         │
│  ? Help             │
│  [Avatar] Andrii ▾  │  ← User menu
└─────────────────────┘
```

---

## 2. User Roles

### 2.1 Guest (Unauthenticated)

A guest has access to the public zone only.

**Can do:**
- View the landing page and feature pages
- Browse the public template gallery (preview only — no use)
- View any shared demo via `/demo/:shareId` link
- Register for an account
- Log into an existing account

**Cannot do:**
- Access the workspace app
- Create or edit anything
- Download exports
- Access the editor

**UX note:** Public demo player shown to guests should display a subtle "Made with DemoFlow" badge with a CTA to register. This is the primary viral acquisition loop.

---

### 2.2 Member (Authenticated, Workspace Member)

The standard authenticated user. Can build and export demos within their workspace.

**Can do:**
- Create, edit, and delete their own projects
- Upload and manage media (within workspace quota)
- Use all editor features (canvas, layers, AI, annotations)
- Trigger AI analysis on media assets
- Create and manage exports (within plan limits)
- Share demos via public links
- Apply templates to create new projects
- View workspace media library (all members' uploads)
- Update their own profile and notification preferences

**Cannot do:**
- Edit other members' projects (unless shared within workspace)
- Invite or remove workspace members
- Change workspace settings (name, logo, brand)
- Access billing
- Manage AI provider configuration
- Delete the workspace

---

### 2.3 Team Admin (Workspace Admin or Owner)

Elevated permissions for workspace management.

**Can do (everything a Member can, plus):**
- Edit any project in the workspace
- Invite and remove workspace members
- Set member roles (promote to Admin, demote to Member)
- Update workspace settings (name, logo, brand color)
- Configure AI provider (Ollama endpoint, model selection)
- Access and manage billing and subscription
- View workspace-wide usage analytics
- Delete any project (with confirmation)
- Manage template library (add/remove workspace-specific templates)
- Delete the workspace (Owner only, with hard confirmation)

**UX note:** Admin-only sections in Settings are visually gated. Non-admins see them with a lock icon and "Upgrade role" tooltip — not hidden entirely, which helps members understand what capabilities exist.

---

## 3. User Flows

### 3.1 Registration Flow

**Entry points:** Landing page CTA, pricing page, shared demo player CTA, direct URL

```
Step 1: Register Page
  ├── Input: Full name
  ├── Input: Email address
  ├── Input: Password (optional — can use magic link)
  └── CTA: "Create account"
       ↓
Step 2: Email Verification
  ├── "Check your inbox" screen
  ├── Show email address used
  ├── Resend option (after 60 seconds)
  └── Auto-advance if magic link clicked
       ↓
Step 3: Workspace Setup (inline, 1 screen)
  ├── Input: Workspace name ("What's your company or project name?")
  ├── Auto-generate slug preview
  └── CTA: "Create workspace"
       ↓
Step 4: Redirect → /onboarding
```

**Errors:**
- Email already registered → show "Sign in instead" link inline
- Weak password → real-time strength indicator
- Slug taken → suggest auto-corrected alternatives

---

### 3.2 First Onboarding Flow

Shown exactly once to new users immediately after workspace creation. Dismissable at any step.

```
Step 1: Welcome Screen
  ├── Full-screen overlay with glassmorphism card
  ├── "Welcome to DemoFlow, [Name]"
  ├── 1-sentence value proposition
  └── CTA: "Let's build your first demo" / "Skip for now"
       ↓
Step 2: Choose Starting Point
  ├── Option A: "Start from a template" (recommended)
  │   └── Shows 3 featured templates inline
  ├── Option B: "Upload my media and start fresh"
  └── Option C: "Give me a tour first"
       ↓
Step 3: AI Setup Check  (shown if Ollama not detected)
  ├── "AI features make DemoFlow magical"
  ├── Status: AI Online ✓ / AI Offline ✗
  ├── If offline: Collapsible setup instructions
  └── CTA: "Continue without AI" / "Set up AI"
       ↓
Step 4: Create First Project (if template or blank selected)
  └── → Project created → redirect to Editor
       ↓
Step 5: Editor Tooltips
  ├── Sequential coach marks highlighting:
  │   1. Canvas area
  │   2. Media upload button
  │   3. AI assistant panel
  │   4. Scene timeline
  │   5. Export button
  └── "Got it" dismisses each mark
```

**Design principle:** Onboarding never blocks — every step has a clear "Skip" escape. Progress is saved so returning users don't re-see it.

---

### 3.3 Create First Demo Flow

```
Entry: Dashboard → "New Project" button or Projects → "+"

Step 1: Project Creation Modal
  ├── Input: Project title
  ├── Select: Project type
  │   (Feature Announcement / Onboarding / Changelog / Showcase / Custom)
  ├── Select: Start from template or blank canvas
  └── CTA: "Create Project"
       ↓
Step 2: Template Picker (if template selected)
  ├── Grid of templates filtered by project type
  ├── Hover: animated preview plays
  ├── Click: full preview modal with "Use this template"
  └── ← Back to blank option
       ↓
Step 3: Editor Opens
  ├── Template scenes pre-populated (or 1 empty scene)
  ├── Onboarding coach marks (if first ever project)
  └── AI panel prompts: "Upload a screenshot to get started"
```

---

### 3.4 Upload Media Flow

**Entry points:** Editor toolbar, Media Library page, drag-drop anywhere

```
Step 1: Trigger Upload
  ├── Method A: Click "Upload" button in editor toolbar
  ├── Method B: Drag files onto canvas or media panel
  ├── Method C: Media Library page → Upload zone
  └── Method D: Paste from clipboard (screenshots)
       ↓
Step 2: File Drop / Picker
  ├── Accepts: PNG, JPG, WebP, GIF, MP4, MOV, WebM
  ├── Multiple files supported
  ├── File size shown with plan limit indicator
  └── Invalid files: gentle inline error per file
       ↓
Step 3: Upload Progress
  ├── Each file shows animated progress bar
  ├── Thumbnail generated as upload completes
  └── Files available in media panel immediately on completion
       ↓
Step 4: AI Analysis Prompt (auto-triggered for screenshots)
  ├── "Analyze with AI?" banner per asset
  ├── One-click: "Analyze" button
  └── Initiates AI job → progress shown in AI panel
       ↓
Step 5: Asset Available
  ├── Appears in media library panel
  ├── Drag onto canvas to add as layer
  └── AI suggestions appear when analysis completes
```

---

### 3.5 Create Scene Flow

```
Step 1: Add Scene
  ├── Method A: Click "+" in scene timeline strip
  ├── Method B: Right-click scene → "Insert scene after"
  └── Method C: Duplicate existing scene
       ↓
Step 2: Choose Scene Content
  ├── Blank scene: empty canvas
  ├── From media: picker opens to select an asset
  └── From template scene: choose a scene layout
       ↓
Step 3: Scene Activated
  ├── Scene appears in timeline
  ├── Canvas shows the scene
  ├── Duration set to default (3 seconds)
  └── Transition selector appears between scenes
       ↓
Step 4: Configure Scene
  ├── Set title (optional)
  ├── Adjust duration (drag handle in timeline)
  ├── Select transition type
  └── Add layers (see 3.6 and annotation flows)
```

---

### 3.6 Add Annotations Flow

```
Entry: Active scene in Editor → select annotation tool from toolbar

Step 1: Select Annotation Type
  ├── Arrow
  ├── Hotspot (pulsing circle)
  ├── Callout / Speech bubble
  ├── Text box
  ├── Shape (rectangle, circle)
  ├── Blur region
  └── Zoom area
       ↓
Step 2: Draw on Canvas
  ├── Click to place (hotspots, callouts)
  ├── Click-drag to draw (shapes, blur, zoom, text)
  └── Handles appear for resize/reposition
       ↓
Step 3: Configure in Properties Panel
  ├── Text: content, font, size, color, alignment
  ├── Arrow: style, color, thickness, head type
  ├── Callout: text, background, border, pointer direction
  ├── Hotspot: color, pulse animation, label
  ├── Blur: intensity, border radius
  └── Zoom area: zoom level, animation style
       ↓
Step 4: Set Timing (optional)
  ├── Layer timeline bar: drag start/end handles
  └── "Show at start / Hide at end" toggles
       ↓
Step 5: Confirm
  └── Layer visible in Layer Panel, canvas, and timeline
```

---

### 3.7 AI-Assisted Generation Flow

```
Entry: Editor → AI Assistant panel (right side, collapsible)

Step 1: Select Media Asset
  ├── Asset must be in the current project
  ├── AI panel shows: "Select a screenshot or recording to analyze"
  └── Click asset in media panel → AI panel activates for it
       ↓
Step 2: Trigger Analysis
  ├── "Analyze with AI" button
  ├── If Ollama offline: shows setup guidance inline
  └── Job submitted → spinner with estimated time
       ↓
Step 3: Analysis Progress
  ├── Progress shown as animated ring
  ├── Phase labels: "Reading interface..." / "Identifying steps..." / "Writing copy..."
  └── WebSocket updates in real time
       ↓
Step 4: Suggestions Appear
  ├── Title suggestion (editable inline)
  ├── Description suggestion (editable inline)
  ├── Step-by-step suggestions (each as a card):
  │   ├── Suggested scene title
  │   ├── Suggested description text
  │   ├── Zoom area overlay preview (shown on canvas)
  │   └── Highlight area overlay preview
  └── Tags suggestion
       ↓
Step 5: Accept / Edit / Reject Each Suggestion
  ├── "Accept" → applies suggestion as scene content
  ├── "Edit" → opens inline text edit
  ├── "Reject" → dismisses that card
  └── "Accept All" → bulk applies all suggestions as new scenes
       ↓
Step 6: Review Applied Suggestions
  └── New scenes appear in timeline with AI badge (◈)
      indicating they were AI-generated (removable tag)
```

---

### 3.8 Export Video Flow

```
Entry: Editor toolbar → "Export" button  OR  Projects list → "Export" menu

Step 1: Export Modal Opens
  ├── Project title confirmation
  ├── Scene count + estimated duration shown
  └── Plan limits shown (e.g., "3 exports remaining this month")
       ↓
Step 2: Select Format
  ├── MP4 (always available)
  ├── GIF (PRO+)
  └── Web / Embed (PRO+)
       ↓
Step 3: Configure Settings (per format)
  ├── Resolution: 720p / 1080p / 1440p / 4K (capped by plan)
  ├── Frame rate: 24 / 30 / 60fps
  ├── Quality: Draft / Standard / High
  ├── Audio: None / Background music (file upload or preset)
  └── Watermark: On (FREE) / Off (PRO+)
       ↓
Step 4: Confirm & Queue
  ├── Estimated file size shown
  ├── Estimated processing time shown
  └── CTA: "Start Export"
       ↓
Step 5: Export Progress (modal transforms to progress state)
  ├── Animated progress ring (0–100%)
  ├── Phase label: Rendering / Encoding / Uploading
  ├── "Notify me when done" toggle (email notification)
  └── "Continue editing" — closes modal, export continues in background
       ↓
Step 6: Export Complete
  ├── Toast notification: "Export ready!"
  ├── Download button (direct)
  ├── Copy link button (signed CDN URL)
  └── Share options appear (see 3.9)
```

---

### 3.9 Share Demo Flow

```
Entry: Editor → "Share" button  OR  Project card → "Share" menu

Step 1: Share Modal Opens
  ├── Share link displayed (read-only input)
  ├── Toggle: Public / Private
  ├── Copy link button
  └── QR code (for mobile sharing) — future
       ↓
Step 2: Configure Share Settings
  ├── Password protection: toggle + set password
  ├── Link expiry: Never / 7d / 30d / Custom
  ├── Allow download: toggle
  ├── Show DemoFlow branding: toggle (PRO can disable)
  ├── Custom CTA: text + URL (PRO+)
  └── Auto-play: toggle
       ↓
Step 3: Publish
  ├── If project is DRAFT: "Publish and share" button
  └── If already PUBLISHED: changes apply immediately
       ↓
Step 4: Share Channels
  ├── Copy link button (primary)
  ├── Open in new tab (preview as viewer)
  └── Embed code (for web export, future)
       ↓
Step 5: Analytics (accessible later in Share settings)
  ├── View count
  ├── Completion rate
  └── Geographic distribution (country level)
```

---

### 3.10 Team Collaboration Flow

```
Entry: Settings → Members

Step 1: Invite Member
  ├── Input: Email address(es) — comma separated
  ├── Select: Role (Admin / Member)
  └── CTA: "Send invitation"
       ↓
Step 2: Invitation Sent
  ├── Pending invitation row appears in member list
  ├── Email sent with magic link invite
  └── Resend option after 24 hours
       ↓
Step 3: Invitee Accepts
  ├── Clicks link in email
  ├── If no account: register flow then join workspace
  └── If has account: direct join with one-click confirm
       ↓
Step 4: Collaboration in Workspace
  ├── Shared media library: all members see all uploads
  ├── Projects: members see projects they created
  │   Admins see all workspace projects
  ├── Last edited indicator on project cards
  └── No simultaneous editing (v1) — project is locked when another user is in the editor
       ↓
Step 5: Manage Members (Admin)
  ├── Change role
  ├── Remove member (with confirmation)
  └── Transfer ownership (Owner only)
```

---

## 4. Pages — Full Inventory

### 4.1 `/auth/login` — Login Page

**Purpose:** Authenticate existing users.

**Layout:**  
Full-screen dark background with subtle animated gradient noise. Centered 400px glassmorphism card. Logo at top. Footer with "Don't have an account? Sign up" link.

**Components:**
- Logo mark + wordmark
- Email input
- Password input with show/hide toggle
- "Forgot password?" link (inline, below password)
- Submit button ("Sign in")
- Divider: "or"
- Magic link button ("Email me a sign-in link")
- OAuth buttons (Google — future)

**User actions:** Sign in with password, request magic link, navigate to register.

**Empty state:** N/A — form always shown.

**Error states:**
- Invalid credentials → red inline banner below form: "Email or password incorrect."
- Account not found → "No account found. Create one?" with link.
- Rate limited → "Too many attempts. Try again in 5 minutes."
- Email unverified → "Please verify your email first." with resend option.

---

### 4.2 `/auth/register` — Register Page

**Purpose:** Create a new user account.

**Layout:** Same as login. Card is slightly taller.

**Components:**
- Full name input
- Email input
- Password input with strength indicator
- "I agree to Terms and Privacy Policy" checkbox
- Submit button ("Create account")
- Divider + magic link option

**Error states:**
- Email already exists → "An account with this email already exists. Sign in instead?"
- Weak password → real-time strength bar (red → amber → green)
- Invalid email → inline under the field

---

### 4.3 `/onboarding` — First-Run Onboarding

**Purpose:** Guide new users to their first success within 3 minutes.

**Layout:**  
Full-screen modal overlay over a blurred empty dashboard. Multi-step card (4 steps). Progress dots at bottom. Background: animated gradient with floating card shadows.

**Components:**
- Progress dots (step indicator)
- Step content (title, illustration, description)
- Primary CTA (advances step)
- Secondary CTA ("Skip" or "Skip for now")
- Back button (step 2+)

**Steps:**
1. Welcome + value prop
2. Start method picker
3. AI status check
4. First project creation inline

---

### 4.4 `/dashboard` — Dashboard

**Purpose:** Command center. See what matters, act fast.

**Layout:**  
Full sidebar + topbar. Content area in 12-column grid. Responsive: 3-column on wide, 2 on medium, 1 on narrow desktop.

See full Dashboard UX design in [Section 5](#5-dashboard-ux).

---

### 4.5 `/projects` — Project List

**Purpose:** Browse, search, filter, and manage all projects.

**Layout:**  
Sidebar + topbar. Main content: filter bar at top, project grid/list below. Toggle between grid and list views.

**Components:**
- Search input (debounced)
- Filter: Type, Status, Date range
- Sort: Last edited, Created, Alphabetical
- View toggle: Grid / List
- "New Project" button (topbar right)
- Project cards (see Project Card component)
- Bulk select mode (checkbox on hover)
- Bulk actions: Delete, Archive, Duplicate

**Empty state:**  
Centered illustration (empty clipboard), title "No projects yet", description "Create your first demo in minutes", CTA "Create project".

**Filter empty state:**  
"No projects match your filters." with "Clear filters" link.

**Error state:**  
Failed to load → "Could not load projects" + Retry button.

---

### 4.6 `/projects/:id` — Project Detail

**Purpose:** Project overview before entering the editor. Shows metadata, scenes thumbnails, export history.

**Layout:**  
Full-width header (project thumbnail + title + meta). Two-column body: left = scene thumbnails strip, right = activity sidebar (exports, AI analyses).

**Components:**
- Project hero: thumbnail, title (editable inline), type badge, status badge
- Quick actions: "Open Editor", "Export", "Share", "Duplicate"
- Scene strip: horizontal scroll of scene thumbnails (4 visible)
- Export history: last 5 exports with download links
- Project settings: type, created date, last edited

**Empty state (no scenes):**  
"This project has no scenes yet. Open the editor to get started."

---

### 4.7 `/projects/:id/editor` — Scene Editor

**Purpose:** Core product — build the demo presentation.

**Layout:**  
Full-screen, no sidebar. See full Editor UX in [Section 6](#6-editor-ux).

---

### 4.8 `/media` — Media Library

**Purpose:** Central repository for all workspace media. Upload, organize, analyze.

**Layout:**  
Sidebar + topbar. Left: filter panel (200px). Right: main grid of media assets.

**Components:**
- Upload dropzone (top of grid — drag files anywhere on page)
- Search input
- Filter panel: Type (screenshot / recording / image / video / GIF), Date, Tags, AI analyzed / not
- Sort: Recent, Size, Name
- View toggle: Grid (default) / List
- Media grid: thumbnails with type badge, duration badge (video), AI badge
- Media item actions (hover): Preview, Add to project, Analyze with AI, Delete
- Selection mode: multi-select + bulk delete/tag

**Empty state (first upload):**  
Large dropzone illustration with pulsing dashed border, "Drop files here or click to upload", list of accepted file types below.

**Error states:**
- File too large → per-file error badge in upload queue
- Unsupported format → inline error
- Storage full → banner at top: "Storage limit reached. Upgrade to continue uploading."

---

### 4.9 `/media/:id` — Media Asset Detail (slide-over panel)

**Purpose:** View, manage, and review AI analysis for a single asset. Appears as a right slide-over panel — never a full page navigation (preserves media grid context).

**Layout:**  
Slide-over panel (480px) over media grid. Overlay backdrop.

**Components:**
- Asset preview (image or video player)
- Metadata: filename, size, dimensions, upload date, uploader
- Tags: editable tag list
- AI Analysis section:
  - "Analyze with AI" button if not analyzed
  - Analysis status (queued / processing / complete)
  - Suggestions preview (collapsed list)
  - "Apply to project" button
- Used in: list of projects where this asset appears
- Actions: Download, Delete, Replace

---

### 4.10 `/templates` — Template Gallery

**Purpose:** Browse and preview templates to start projects from.

**Layout:**  
Sidebar + topbar. Full-width gallery grid. Category filter tabs at top.

**Components:**
- Category tabs: All / Feature / Onboarding / Changelog / Showcase / Walkthrough
- Search (debounced)
- Template cards: preview image, name, scene count, "PRO" badge if premium
- Hover state: short preview video autoplays (muted)
- Click: Template preview modal

**Template preview modal:**
- Full preview with scene navigation arrows
- Template name + description
- Scene count, estimated duration
- "Use this template" CTA → project creation
- "Preview full screen" link

**Empty state (search/filter no results):**  
"No templates found" with "Clear filters" link. Suggest browsing all templates.

---

### 4.11 `/exports` — Export Center

**Purpose:** Manage all export jobs across projects. Download completed exports.

**Layout:**  
Sidebar + topbar. Full table/list of export jobs.

**Components:**
- Active jobs section (if any): animated progress rows
- Export history table: project, format, status, file size, created, download
- Filter: Status (all / processing / completed / failed), Format, Date
- Sort: Recent, Project name
- Plan usage bar: "8 of 10 exports used this month"

**Empty state:**  
"No exports yet. Create your first demo and export it." with "Browse projects" CTA.

---

### 4.12 `/settings/profile` — Profile Settings

**Components:** Avatar upload, display name, email (view-only), change password, notification preferences.

---

### 4.13 `/settings/workspace` — Workspace Settings

**Components:** Workspace name, slug (with URL preview), logo upload, brand color picker.  
**Access:** Admin + Owner only.

---

### 4.14 `/settings/members` — Team Members

**Components:** Member list with role badges, "Invite member" button, pending invitations section, role change dropdown, remove member action.  
**Access:** Admin + Owner only.

---

### 4.15 `/settings/ai` — AI Configuration

**Components:**
- AI provider selector: Ollama (default) / OpenAI (future)
- Ollama: endpoint URL input, model selector, test connection button, status indicator
- Hardware info (Apple Silicon detection, Metal support)
- Monthly usage counter: "142 / 500 analyses used"
- Re-analyze options

**Access:** Admin + Owner only.

---

### 4.16 `/settings/billing` — Billing

**Components:**
- Current plan card with feature list
- Usage summary (storage, exports, members)
- "Upgrade" CTA (if not on highest plan)
- Payment method (last 4 + brand logo)
- Billing history table (invoices + download links)
- Cancel subscription (danger zone)

**Access:** Owner only.

---

### 4.17 `/settings/danger` — Danger Zone

**Components:**
- "Delete workspace" button (requires typing workspace name to confirm)
- "Export all data" button (GDPR)

---

### 4.18 `/demo/:shareId` — Public Demo Player

**Purpose:** The shareable presentation viewed by end-users. This is the product's primary output.

**Layout:**  
Full-screen dark background. No sidebar, no topbar. Centered presentation canvas. Minimal controls at bottom.

**Components:**
- Presentation canvas (16:9 default)
- Controls bar (fade in on hover):
  - Play / Pause
  - Scene dots navigation
  - Scene counter: "Scene 3 of 7"
  - Fullscreen toggle
  - Progress bar
- "Made with DemoFlow" badge (bottom-right, removable on PRO+)
- Custom CTA button (if configured)
- Password gate (if password-protected)

**Password gate state:**  
Blur overlay, password input centered, "Enter password to view" label.

**Expired state:**  
"This demo link has expired. Contact the creator for a new link."

**Not found state:**  
Clean 404: "Demo not found or no longer available."

---

## 5. Dashboard UX

### 5.1 Philosophy

The dashboard is a **productivity cockpit**, not a marketing homepage. It answers: "What do I need right now?" Every element earns its space.

**Design principles:**
- Show what's in-progress first
- Surface AI suggestions proactively
- Make the most common action (create project, continue editing) one click away
- Show system status (AI, export queue) without navigating elsewhere

---

### 5.2 Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  TOPBAR                                                         │
│  Dashboard          [+ New Project]  [Notifications]  [Avatar]  │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│ SIDE   │  ┌──────────────────────────────────────────────────┐  │
│ BAR    │  │  GREETING + QUICK ACTIONS ROW                    │  │
│        │  │  "Good morning, Andrii ☀"  [+ New] [Upload] [↓] │  │
│        │  └──────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ┌─────────────────┐  ┌─────────────────┐            │
│        │  │  STATS WIDGET   │  │  AI STATUS       │            │
│        │  │  3 projects     │  │  ● Online        │            │
│        │  │  2 exports      │  │  qwen2.5-vl:7b   │            │
│        │  │  1.2GB used     │  │  Analyze media → │            │
│        │  └─────────────────┘  └─────────────────┘            │
│        │                                                        │
│        │  ┌──────────────────────────────────────────────────┐  │
│        │  │  RECENT PROJECTS                     [View all →]│  │
│        │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │  │
│        │  │  │  P1  │ │  P2  │ │  P3  │ │  P4  │           │  │
│        │  │  └──────┘ └──────┘ └──────┘ └──────┘           │  │
│        │  └──────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ┌────────────────────┐  ┌───────────────────────┐    │
│        │  │  EXPORT QUEUE      │  │  AI SUGGESTIONS        │    │
│        │  │  ▶ Rendering...    │  │  3 assets ready        │    │
│        │  │  ░░░░░░░░░░  68%   │  │  "Analyze Q1 Launch →" │    │
│        │  │  + 2 queued        │  │                        │    │
│        │  └────────────────────┘  └───────────────────────┘    │
│        │                                                        │
│        │  ┌──────────────────────────────────────────────────┐  │
│        │  │  STORAGE USAGE                                   │  │
│        │  │  ████████░░░░░░░░░░  1.2 GB / 5 GB  (Free plan) │  │
│        │  │  "Upgrade for 50GB"                              │  │
│        │  └──────────────────────────────────────────────────┘  │
└────────┴────────────────────────────────────────────────────────┘
```

---

### 5.3 Dashboard Widgets

#### Quick Actions Row
Always visible below the greeting. Three icon+label buttons:
- **+ New Project** → project creation modal
- **Upload Media** → opens media upload dropzone (modal)
- **Export** → opens export center

#### Stats Widget
Three pill-shaped cards in a row:
- Total projects (with trend vs last month)
- Exports this month (with plan limit)
- Storage used (with % and absolute value)

#### Recent Projects
Horizontal scroll of the last 6 touched projects. Each card shows:
- Scene thumbnail (first scene)
- Project title
- Project type badge
- "Last edited X ago"
- Status badge (Draft / Published)
- Hover: "Open Editor" overlay button

#### Export Queue Widget
Shown only when exports are active or recently completed (last 24hrs):
- Active job: animated progress ring + phase label + project name
- Queued jobs count
- Most recent completed: download link
- Hidden when queue is empty — replaced by "No active exports" placeholder text

#### AI Suggestions Widget
Shown when there are unanalyzed media assets or pending suggestions:
- Count of assets ready for analysis
- List of up to 3 asset names with "Analyze →" buttons
- "AI is offline" state if Ollama unavailable
- Hides when no suggestions are pending

#### Storage Widget
Horizontal progress bar with:
- Used / Total in human-readable units
- Color: green < 60%, amber 60–85%, red 85%+
- Upgrade CTA shown when > 70% full (FREE plan)
- Hidden for unlimited plans

---

### 5.4 Dashboard Empty State (Brand New User)

First-time dashboard shows a structured empty state instead of empty widgets:

```
"Your workspace is ready. Let's build your first demo."

Three option cards:
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 📎 Use a        │  │ ↑ Upload media   │  │ □ Start blank   │
│    template     │  │   and get AI     │  │                 │
│                 │  │   suggestions    │  │                 │
│ [Browse →]      │  │ [Upload →]       │  │ [Create →]      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 6. Editor UX

### 6.1 Editor Philosophy

The editor is the core product. It must feel effortless. The user should never feel like they are "editing a video" — they are **building a story** from their product's screenshots.

**Design principles:**
- Canvas is the hero. Everything else is a supporting panel.
- Panels are collapsible. The user controls their own workspace.
- No modal dialogs inside the editor — everything is inline or slide-overs.
- AI panel always accessible — it is a creative partner, not a feature.
- Undo is always available. No action is irreversible without explicit confirmation.

---

### 6.2 Editor Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TOOLBAR (48px height)                                                  │
│  ← Back  |  Project Title (editable)  |  undo  redo  |  Export  Share  │
├────────────┬────────────────────────────────────────┬───────────────────┤
│            │                                        │                   │
│  LAYERS    │                                        │  PROPERTIES       │
│  PANEL     │           CANVAS                       │  PANEL            │
│  (220px)   │         (fluid width)                  │  (280px)          │
│            │                                        │                   │
│  Layer 1   │   ┌──────────────────────────────┐    │  Transform        │
│  Layer 2   │   │                              │    │  x: 0  y: 0       │
│  ▼ Layer 3 │   │    Scene rendering area      │    │  w: 100 h: 56     │
│  Layer 4   │   │                              │    │  Rotation: 0°     │
│            │   └──────────────────────────────┘    │                   │
│  [+ Layer] │                                        │  Animation        │
│            │   Zoom: 100%  [−] [+]  [Fit]          │  In / Out / Loop  │
├────────────┴────────────────────────────────────────┴───────────────────┤
│  SCENE TIMELINE (96px height)                      AI PANEL (toggle →) │
│  [+]  [ Scene 1 ]──[ Scene 2 ]──[ Scene 3 ]──+                         │
│       ↑ active      3.0s          2.5s        add scene                 │
├────────────────────────────────────────────────────────────────────────┤
│  MEDIA PANEL (collapsible drawer at bottom, or detached)               │
│  [Screenshots] [Recordings] [Upload +]                                 │
│  [ img ] [ img ] [ img ] [ img ] [ img ] [ img ] ...                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 6.3 Canvas

**Why it exists:** The canvas is the workspace where users compose scenes. It is the physical representation of what the final output will look like.

**Behavior:**
- Fixed aspect ratio container (16:9 default, configurable per project)
- Background is configurable: solid color, gradient, image
- Pan: Space + drag (mouse), two-finger drag (trackpad)
- Zoom: Scroll wheel, Cmd+Plus/Minus, zoom buttons in bottom bar
- Fit: Cmd+0 resets to fit canvas in viewport
- Rulers: optional toggle, show pixel position
- Grid: optional toggle, snap-to-grid assist
- Selection: click a layer to select, Cmd+click for multi-select, drag for marquee select
- Context menu: right-click selected layer → copy, paste, duplicate, delete, lock, bring to front

**Layer interaction:**
- Drag to move
- Corner handles to resize (proportional hold Shift)
- Rotation handle above selection (circular handle)
- Double-click text layer to enter edit mode inline

---

### 6.4 Scene Timeline

**Why it exists:** Users need to see the full sequence of their demo and navigate between scenes. The timeline is the "story map."

**Components:**
- Scene thumbnails (auto-generated from canvas): 80×45px with scene number
- Duration label below each scene (e.g., "3.0s")
- Active scene: highlighted with accent border + slightly larger
- Transition indicator between scenes: thin icon between scene cards
- "+" button at the end to add a new scene
- Drag to reorder (CDK drag-drop, smooth animation)
- Right-click scene → Duplicate, Insert after, Delete

**Keyboard:** Arrow keys navigate between scenes. Delete key removes active scene (with undo).

---

### 6.5 Layer Panel

**Why it exists:** Complex scenes can have many overlapping layers. The layer panel gives users spatial and visual control over composition without clicking through layers on canvas.

**Components:**
- Layer list (top = front, bottom = back, matching z-index)
- Layer type icon (media, text, arrow, hotspot, etc.)
- Layer name (editable by double-clicking)
- Visibility toggle (eye icon)
- Lock toggle (lock icon)
- Drag handle (drag to reorder)
- Selected layer: accent highlight
- Layer thumbnail (tiny preview): on hover

**Actions:**
- Click to select
- Drag to reorder (z-index)
- Eye icon: show/hide layer
- Lock icon: lock layer (prevents selection on canvas)
- "+" button: add layer from type picker

---

### 6.6 Properties Panel

**Why it exists:** Every selected layer has configurable properties. The properties panel surfaces the relevant controls for whatever is selected — context-aware.

**States (based on selection):**

| Selection | Panel shows |
|---|---|
| Nothing selected | Scene settings (bg color, duration, transition) |
| Media layer | Position, size, opacity, crop, corner radius |
| Text layer | Position, size, font, weight, size, color, alignment, line height |
| Shape layer | Position, size, fill, stroke, opacity, corner radius |
| Arrow layer | Start/end position, color, thickness, head style |
| Hotspot layer | Position, size, color, pulse speed, label text |
| Zoom area | Position, size, zoom level, animation style |
| Blur layer | Position, size, blur intensity, border radius |
| Callout layer | Position, size, text, background, pointer direction |
| Multiple selected | Common properties only (position offset, opacity) |

**Design:** Clean, section-grouped. Each section collapsible. No more than 4 controls visible per section before collapse. Uses compact inputs: number steppers, color swatches, icon-button groups for alignment.

---

### 6.7 AI Assistant Panel

**Why it exists:** AI is the key differentiator. The panel gives users an always-available creative partner that can turn a screenshot into a structured, professional demo in seconds.

**Panel layout (right side, 320px, toggle visible/hidden):**

```
┌──────────────────────────────┐
│  ◈ AI Assistant    [×]       │
│  ● Qwen VL — Online          │
├──────────────────────────────┤
│  Selected asset:             │
│  [screenshot_v2.png] ···     │
├──────────────────────────────┤
│  [  Analyze with AI  ]       │
│                              │
│  ─── Suggestions ────        │
│                              │
│  ✦ Title                     │
│  "Dashboard Overview"    ✓ ✗ │
│                              │
│  ✦ Step 1                    │
│  Navigate to Analytics   ✓ ✗ │
│  → Creates zoom on chart     │
│                              │
│  ✦ Step 2                    │
│  Review monthly metrics  ✓ ✗ │
│                              │
│  [Accept All]                │
│                              │
│  ─── Custom Prompt ──────    │
│  Ask AI anything about       │
│  this interface...           │
│  [__________________] [Send] │
└──────────────────────────────┘
```

**States:**
- No asset selected: Prompt to select or upload media
- Asset selected, not analyzed: Single "Analyze" button
- Analysis in progress: Spinner with phase label and cancel option
- Analysis complete: Suggestion cards with accept/edit/reject per card
- AI offline: Yellow warning, setup guide link, manual mode only

---

### 6.8 Editor Toolbar

**Persistent top bar in the editor:**

```
← Back  |  "Q1 Feature Launch"  |  ↩ ↪  |  Tools: ◻ T → ○ ⊕ ⊘  |  100%  |  [Export ↓]  [Share →]
```

| Element | Purpose |
|---|---|
| ← Back | Return to project detail (auto-saves) |
| Project title | Editable inline on click |
| Undo / Redo | Standard undo stack |
| Select tool | Default cursor for selecting and moving layers |
| Text tool | Click canvas to place text layer |
| Arrow tool | Draw directional arrow |
| Shape tool | Draw rectangle or circle |
| Hotspot tool | Place animated hotspot |
| Zoom tool | Define zoom area region |
| Blur tool | Draw redaction/blur region |
| Zoom % | Canvas zoom with popover for input |
| Export | Opens export modal |
| Share | Opens share modal |

---

## 7. Design System

### 7.1 Spacing System

Base unit: **4px**. All spacing values are multiples of this unit. This creates a consistent rhythm across every component.

```
Scale:
  space-0:   0px      (intentional zero)
  space-1:   4px      (tight separation — icon gap, input padding horizontal)
  space-2:   8px      (compact elements — badge padding, small gaps)
  space-3:   12px     (standard inner padding for small components)
  space-4:   16px     (base padding — cards, inputs, buttons)
  space-5:   20px     (medium gaps between components)
  space-6:   24px     (section separation, card padding large)
  space-8:   32px     (content block separation)
  space-10:  40px     (major section spacing)
  space-12:  48px     (hero padding, page-level spacing)
  space-16:  64px     (large layout gaps)
  space-20:  80px     (page-level outer padding on large screens)
  space-24:  96px
  space-32:  128px    (max — page section margin)

Inline spacing (within text): space-1, space-2
Component internal: space-2 to space-4
Between components: space-4 to space-8
Between sections: space-8 to space-16
Page outer padding: space-6 (mobile), space-10 (tablet), space-16 (desktop)
```

---

### 7.2 Typography Hierarchy

**Font:** Inter Variable (Google Fonts). Monospace: JetBrains Mono (code blocks, file names, shortcuts).

```
Display / Hero
  Size: 48–60px  Weight: 700  Leading: 1.1  Tracking: -0.03em
  Use: Landing page headlines only

Title 1
  Size: 30px  Weight: 700  Leading: 1.2  Tracking: -0.02em
  Use: Page titles, modal headlines

Title 2
  Size: 24px  Weight: 600  Leading: 1.25  Tracking: -0.015em
  Use: Section headings, card titles (large)

Title 3
  Size: 20px  Weight: 600  Leading: 1.3  Tracking: -0.01em
  Use: Widget headings, dialog titles, sidebar section headers

Label Large
  Size: 16px  Weight: 500  Leading: 1.4  Tracking: -0.005em
  Use: Navigation items (active), prominent labels

Label Medium (Body)
  Size: 14px  Weight: 400  Leading: 1.5  Tracking: 0
  Use: Body text (primary), form labels, card descriptions

Label Small
  Size: 13px  Weight: 400  Leading: 1.45  Tracking: 0.005em
  Use: Secondary descriptions, helper text, meta information

Caption
  Size: 12px  Weight: 400  Leading: 1.4  Tracking: 0.01em
  Use: Timestamps, file sizes, status text, input hints

Mono
  Size: 12–13px  Weight: 400  Family: JetBrains Mono
  Use: Code, shortcut badges (Kbd), file paths, IDs

Hierarchy rule: Never more than 3 size levels visible simultaneously on one screen.
```

---

### 7.3 Color System

All colors defined as HSL CSS Custom Properties. Theme applied via `[data-theme]` attribute on `<html>`.

#### Dark Theme (Default)

```
Backgrounds (darkest to lightest):
  --bg-base:        hsl(225, 14%, 5.5%)    #0c0d14  Canvas, page background
  --bg-elevated:    hsl(225, 12%, 8%)      #10111c  Sidebar, persistent panels
  --bg-surface:     hsl(225, 11%, 11%)     #16182a  Cards, dropdowns, modals
  --bg-overlay:     hsl(225, 10%, 15%)     #1e2030  Popovers, context menus
  --bg-glass:       hsl(225 14% 18% / 55%) —        Glassmorphism surfaces

Borders:
  --border-default: hsl(225, 10%, 20%)     Visible dividers, card outlines
  --border-subtle:  hsl(225, 10%, 14%)     Barely visible — section dividers
  --border-focus:   hsl(255, 80%, 65% / 60%) Input focus ring
  --border-glass:   hsl(0, 0%, 100% / 8%)  Glass surface border

Brand / Accent:
  --accent:         hsl(255, 80%, 65%)     #7c5ce7  Primary CTA, active states
  --accent-hover:   hsl(255, 80%, 72%)     Hover state
  --accent-subtle:  hsl(255, 80%, 65% / 12%) Accent background tint

Semantic:
  --success:        hsl(145, 65%, 52%)     #3edf7c
  --warning:        hsl(38, 90%, 58%)      #f5a623
  --error:          hsl(3, 85%, 62%)       #f05050
  --info:           hsl(200, 80%, 60%)     #33b5e5

Text:
  --text-primary:   hsl(225, 10%, 95%)     #f0f0f7  Headings, primary body
  --text-secondary: hsl(225, 10%, 65%)     #96a0b8  Descriptions, meta
  --text-muted:     hsl(225, 10%, 42%)     #5c6480  Hints, placeholders
  --text-disabled:  hsl(225, 10%, 28%)     #3d4260  Disabled states
  --text-accent:    hsl(255, 80%, 72%)     #a388f5  Accent-colored labels
  --text-inverse:   hsl(225, 14%, 5.5%)   On accent/light backgrounds

AI indicator:
  --ai-glow:        hsl(255, 80%, 65% / 20%)        AI panel glow effect
```

#### Light Theme

```
  --bg-base:        hsl(220, 20%, 97%)     #f3f5fb
  --bg-elevated:    hsl(0, 0%, 100%)       #ffffff
  --bg-surface:     hsl(220, 20%, 99%)     #fafbff
  --bg-glass:       hsl(0, 0%, 100% / 70%) —
  --border-default: hsl(220, 15%, 88%)
  --text-primary:   hsl(225, 25%, 12%)
  --text-secondary: hsl(225, 15%, 38%)
```

---

### 7.4 Glass Surfaces

Glassmorphism is used selectively — for modals, panels, and hero elements that float above a complex background. Overuse kills the effect.

**Glass Recipe:**
```
background:   var(--bg-glass)
backdrop-filter: blur(24px) saturate(150%)
border:       1px solid var(--border-glass)
box-shadow:   0 8px 32px hsl(0 0% 0% / 40%),
              inset 0 1px 0 hsl(0 0% 100% / 6%)
border-radius: var(--radius-xl) or larger
```

**Where glass is used:**
- Modals and dialogs (always)
- Onboarding overlay card
- AI assistant panel
- Topbar (with subtle blur + border)
- Notification toasts
- Context menus (subtle)

**Where glass is NOT used:**
- Regular cards (use `--bg-surface` instead)
- Sidebar (use `--bg-elevated`)
- Editor canvas background (no glass)
- Form inputs (clean surface, no blur)

---

### 7.5 Cards

Four card variants, each for a specific context:

```
Card Base       bg: --bg-surface
                border: 1px solid --border-subtle
                radius: --radius-lg (12px)
                padding: space-5 (20px)
                Use: Content containers, project summaries

Card Hover      transition: all 220ms ease-out
                border-color: --border-default
                box-shadow: var(--shadow-md)
                transform: translateY(-2px)
                Use: Clickable cards that navigate

Card Active     border-color: --accent
                box-shadow: var(--shadow-glow-sm)
                Use: Selected template, active project

Card Elevated   box-shadow: var(--shadow-lg)
                Use: Popovers, dropdowns floating over content
```

---

### 7.6 Buttons

```
Primary
  bg:      --accent
  text:    white
  radius:  --radius-md (8px)
  height:  36px (default), 32px (small), 40px (large)
  padding: space-3 space-5 (12px 20px)
  hover:   --accent-hover + slight lift
  active:  scale: 0.98

Secondary
  bg:      --bg-overlay
  border:  1px solid --border-default
  text:    --text-primary
  hover:   --bg-surface

Ghost
  bg:      transparent
  text:    --text-secondary
  hover:   bg --bg-overlay, text --text-primary
  Use:     Low-emphasis actions, cancel buttons

Danger
  bg:      transparent (default) / --error (confirm state)
  border:  1px solid --error (default)
  text:    --error
  Use:     Destructive actions — always requires confirmation

Icon Button
  width = height = 32px (default)
  radius: --radius-md
  content: centered icon
  hover:   --bg-overlay

Loading State (all button types)
  Show spinner in place of icon/label
  Disable interactions
  Keep same size — no layout shift

Disabled State
  opacity: 0.4
  cursor: not-allowed
```

---

### 7.7 Forms

```
Input Field
  height:      36px
  bg:          --bg-overlay
  border:      1px solid --border-default
  radius:      --radius-md
  text:        --text-primary
  placeholder: --text-muted
  padding:     space-2 space-3 (8px 12px)
  
  States:
    Focus:    border-color --border-focus, box-shadow 0 0 0 3px --accent/15%
    Error:    border-color --error, error message below in --error color
    Disabled: opacity 0.5, cursor not-allowed
    Readonly: bg --bg-surface, no focus ring

Textarea
  Same as input, min-height 80px, resize: vertical only

Select / Dropdown
  Same as input + chevron icon right-aligned
  Opens a styled dropdown panel (not native select)

Checkbox / Toggle
  Custom styled — never use browser default
  Checkbox: 16×16px square, accent fill + white checkmark when checked
  Toggle: 36×20px pill, thumb slides, accent fill when on

Labels
  Size: 13px  Weight: 500  Color: --text-secondary
  Margin-bottom: space-1 above input

Helper text
  Size: 12px  Color: --text-muted
  Shown below input

Error text
  Size: 12px  Color: --error
  Shown below input, replaces helper text

Form layout rule: Max 2 columns on any form. Single column preferred.
```

---

### 7.8 Dialogs & Modals

```
Modal
  backdrop:     fixed overlay, hsl(0 0% 0% / 60%) with backdrop-blur: 4px
  card:         glass surface, max-width 480px (default), 560px (large), 720px (xl)
  radius:       --radius-2xl (20px)
  padding:      space-6 (24px)
  
  Structure:
    Header:  Title (Title 3) + optional subtitle + close button [×]
    Body:    Content area, scrollable if needed
    Footer:  Right-aligned actions (Cancel, Confirm)

  Animation:
    Enter: scale from 0.95 + fade in, 220ms --ease-spring
    Exit:  scale to 0.95 + fade out, 150ms --ease-in

  Multi-step modals:
    Show step indicator (dots or number: "Step 2 of 4")
    Back button appears from step 2+
    Progress must be preserved if modal is closed and reopened

Confirmation dialogs
  Max-width: 400px
  Always describe the consequence, not just the action
  Correct:   "Delete 'Q1 Launch' permanently? This cannot be undone."
  Incorrect: "Are you sure?"
  Danger confirm: input field requiring user to type resource name

Slide-over panels
  Width: 480px (right edge)
  backdrop: semi-transparent, click to close
  Animation: slide in from right, 280ms --ease-out
  Use for: Media asset detail, member detail, template preview
```

---

### 7.9 Notifications & Toasts

```
Toast (global notification)
  Position:   Bottom-right, stack from bottom up
  Width:      320px
  Padding:    space-4
  Radius:     --radius-lg
  Surface:    glass variant
  Max stack:  3 simultaneous (oldest auto-dismissed)
  
  Variants:
    Success: green left border + checkmark icon
    Error:   red left border + X icon
    Warning: amber left border + ! icon
    Info:    blue left border + i icon
    Loading: animated spinner (for async ops)
  
  Auto-dismiss: 4 seconds (success/info), never (error, until user closes)
  Actions:  Optional "Undo" or "View" link in toast
  
  Animation:
    Enter: slide in from right + fade, 220ms spring
    Exit:  fade + collapse height, 180ms ease-in

Inline validation
  Shown below form fields — never as toasts
  Appears on blur (not on every keystroke)

Banner notifications
  Full-width, below topbar
  Use for: Storage limit warning, plan downgrade notice, AI offline
  Color: matches severity (warning = amber bg, error = red bg)
  Dismissable with [×]

AI progress notification (special)
  Appears as a mini-card docked to bottom of AI panel
  Shows analysis progress with ring + phase text
  Persists until complete
```

---

## 8. Mobile Strategy

### 8.1 Philosophy

DemoFlow is a **desktop-first creation tool**. The editor requires precision input (drag, resize, multi-select) that is impractical on mobile. However, mobile users have real use cases that must be served.

---

### 8.2 Desktop-Only Features

These features will **not** be available on mobile (screen width < 768px). Users are shown a friendly message: "DemoFlow's editor works best on a desktop or laptop."

- Scene Editor (canvas, layers, properties panel)
- AI analysis triggering (analysis results viewable on mobile)
- Export configuration (complex form)
- Template builder

---

### 8.3 Mobile-Optimized Features

The following are fully functional on mobile, with dedicated mobile layouts:

| Feature | Mobile Behavior |
|---|---|
| **Dashboard** | Single column, stacked widgets, quick action buttons |
| **Project list** | Card list view (grid disabled on mobile) |
| **Media library** | Browse and view, uploads from camera roll supported |
| **Public demo player** | Fully responsive — this is a primary use case (sharing demos to mobile viewers) |
| **Share settings** | Full share link management |
| **Settings** | All settings pages — profile, workspace, billing |
| **Notifications** | Full notification center |
| **Team management** | Invite members, manage roles |

---

### 8.4 Public Demo Player — Mobile First

The player at `/demo/:shareId` is consumed by viewers who receive share links. These viewers are often on mobile. The player must be:

- Fully responsive (fluid width)
- Touch-optimized controls (large tap targets, swipe between scenes)
- No horizontal scroll
- Autoplay-safe (muted by default, user activates audio)
- Lightweight (fast load, no heavy JS)
- Open Graph / Twitter Card meta tags for rich link previews

---

### 8.5 Responsive Breakpoints

```
mobile:   320px – 767px    (single column, no editor, player only)
tablet:   768px – 1023px   (limited editor access — view only mode)
desktop:  1024px – 1439px  (full app)
wide:     1440px+          (expanded panels, wider canvas)
```

---

## 9. Premium SaaS Features

Features that signal quality, build trust, and justify a higher price point:

### 9.1 Perceived Value Features

| Feature | Why it feels premium |
|---|---|
| **AI one-click scene generation** | Turns 2 hours into 30 seconds. Wow moment on first use. |
| **Smooth scene transitions** | 10 transition types with easing curves. Outputs look professional even with basic content. |
| **Zoom & highlight AI suggestions** | AI doesn't just write copy — it suggests where to zoom. Unique capability. |
| **Real-time export progress** | WebSocket progress ring is more satisfying than "email when done". |
| **Instant share links** | Publish and share in 2 clicks. Demo is live in under a minute. |
| **Custom CTA on demos** | Add "Book a demo" button to presentations — direct revenue link. |
| **Brand Kit** | White-labeling the output makes demos feel like the company's own product. |
| **Template marketplace** | Curated, premium templates designed by professionals signal quality. |
| **Presentation analytics** | Know if your demo was watched. Know where people drop off. Actionable insight. |

---

### 9.2 Workflow Features

| Feature | Value |
|---|---|
| **Keyboard shortcut system** | Power users feel at home. Shows product maturity. |
| **Command Palette** (Cmd+K) | Instant access to any action without navigating menus. Linear-like. |
| **Auto-save every 2 seconds** | Zero data loss. Eliminates "Save" cognitive overhead. |
| **Version history** (PRO) | "I want the version from yesterday" is a common request. |
| **Duplicate project** | Starting from a working demo is faster than from scratch. |
| **Export presets** | Save commonly-used export settings (resolution, quality, audio). |
| **Bulk export** | Export multiple projects at once — useful for agencies. |

---

### 9.3 Collaboration Features

| Feature | Value |
|---|---|
| **Workspace shared media library** | No re-uploading the same screenshots across projects. |
| **Project locking** (v1) | Prevents two people accidentally overwriting each other. |
| **Comments on scenes** (v2) | Stakeholder feedback directly on the demo. Linear-like. |
| **Project sharing within team** | Share a draft with internal reviewers before publishing publicly. |
| **Activity log** | "Who deleted that scene?" — answers the question before it becomes a support ticket. |

---

### 9.4 Trust & Credibility Features

| Feature | Value |
|---|---|
| **Usage dashboard** | Transparency about storage, export count — reduces cancellation anxiety. |
| **AI provider choice** | "Local AI, your data never leaves your machine." Appeals to enterprise security teams. |
| **Export in 3 formats** | MP4 + GIF + Web. Three output formats shows product depth. |
| **Custom domain for share links** | `demos.yourbrand.com` instead of `demoflow.io/demo/xyz` — enterprise-grade. |
| **Password-protected demos** | Control who sees the demo before it goes public. |
| **Audit log** | Enterprise compliance requirement. Unlocks procurement approval. |

---

## 10. MVP Scope Matrix

### Priority Key
- **Must Have** — Product does not function without this
- **Should Have** — Significant user value, build in v1
- **Nice To Have** — Improves experience, not essential for launch
- **Future** — Post-v1, requires separate planning

---

### Authentication & Onboarding

| Feature | Priority |
|---|---|
| Email + password registration | Must Have |
| Magic link login | Must Have |
| Email verification | Must Have |
| Workspace creation on signup | Must Have |
| First-run onboarding flow | Should Have |
| Password reset | Must Have |
| Persistent sessions (refresh tokens) | Must Have |
| Google OAuth | Future |
| SSO / SAML | Future |

---

### Dashboard

| Feature | Priority |
|---|---|
| Recent projects widget | Must Have |
| Quick action buttons | Must Have |
| Storage usage widget | Must Have |
| Export queue widget | Should Have |
| AI suggestions widget | Should Have |
| Usage stats (monthly) | Should Have |
| Activity feed | Nice To Have |
| Workspace analytics | Future |

---

### Projects

| Feature | Priority |
|---|---|
| Create / edit / delete projects | Must Have |
| Project types (5 types) | Must Have |
| Project status (draft / published) | Must Have |
| Duplicate project | Should Have |
| Soft delete + recovery | Should Have |
| Bulk operations (delete, archive) | Nice To Have |
| Project comments | Future |
| Version history | Future |

---

### Media Library

| Feature | Priority |
|---|---|
| Upload screenshots and recordings | Must Have |
| Drag-and-drop upload | Must Have |
| Clipboard paste (screenshots) | Should Have |
| Auto-thumbnail generation | Must Have |
| Media search | Should Have |
| Media tags | Nice To Have |
| Media replace (same slot) | Nice To Have |
| Bulk delete | Should Have |
| Camera roll upload (mobile) | Nice To Have |

---

### Scene Editor

| Feature | Priority |
|---|---|
| Canvas with layers | Must Have |
| Scene timeline (add, reorder, delete) | Must Have |
| Media layer | Must Have |
| Text layer | Must Have |
| Arrow annotation | Must Have |
| Hotspot / callout | Must Have |
| Zoom area layer | Must Have |
| Blur / redaction layer | Should Have |
| Shape layer | Should Have |
| Cursor layer | Nice To Have |
| Scene transitions (10 types) | Should Have |
| Layer animation (in / out / loop) | Should Have |
| Undo / Redo (50 steps) | Must Have |
| Auto-save | Must Have |
| Keyboard shortcuts | Should Have |
| Command Palette | Nice To Have |
| Snap-to-grid | Nice To Have |
| Rulers | Nice To Have |
| Layer grouping | Future |
| Smart guides | Future |

---

### AI Integration

| Feature | Priority |
|---|---|
| AI title suggestion | Must Have |
| AI description suggestion | Must Have |
| AI step-by-step suggestions | Must Have |
| AI zoom area suggestions | Should Have |
| AI highlight area suggestions | Should Have |
| Ollama + Qwen VL provider | Must Have |
| Degraded mode (no AI) | Must Have |
| AI offline indicator | Must Have |
| Custom AI prompt | Should Have |
| Apple Silicon (Metal) optimization | Should Have |
| OpenAI provider | Future |
| AI voiceover (TTS) | Future |
| AI background removal | Future |

---

### Export Engine

| Feature | Priority |
|---|---|
| MP4 export | Must Have |
| Export progress (WebSocket) | Must Have |
| Download link | Must Have |
| Export history | Must Have |
| GIF export | Should Have |
| Web / HTML export | Should Have |
| Audio background track | Nice To Have |
| Custom resolution | Should Have |
| Watermark (FREE plan) | Must Have |
| Watermark removal (PRO) | Must Have |
| Export presets | Nice To Have |
| Bulk export | Future |
| 4K export | Future |

---

### Sharing

| Feature | Priority |
|---|---|
| Public share link | Must Have |
| Enable / disable share | Must Have |
| Password protection | Should Have |
| Link expiry | Should Have |
| Allow download toggle | Should Have |
| Custom CTA | Nice To Have |
| View analytics | Nice To Have |
| Custom domain | Future |
| Embed code | Future |
| Open Graph / Twitter cards | Should Have |

---

### Templates

| Feature | Priority |
|---|---|
| 10 starter templates (seeded) | Must Have |
| Template gallery with categories | Must Have |
| Template preview (hover video) | Should Have |
| Create project from template | Must Have |
| PRO template flag | Should Have |
| User-saved templates | Future |
| Template marketplace (sell/buy) | Future |

---

### Team & Workspace

| Feature | Priority |
|---|---|
| Invite members by email | Must Have |
| Role management (Owner/Admin/Member) | Must Have |
| Remove members | Must Have |
| Workspace name and logo | Must Have |
| Brand color | Nice To Have |
| Transfer ownership | Should Have |
| Shared media library | Must Have |
| Project locking (one editor at a time) | Must Have |
| Real-time collaboration | Future |
| Project comments | Future |

---

### Settings & Billing

| Feature | Priority |
|---|---|
| Profile settings | Must Have |
| Password change | Must Have |
| AI configuration | Must Have |
| Billing page | Must Have |
| Plan upgrade (Stripe) | Must Have |
| Invoice download | Should Have |
| Usage dashboard | Should Have |
| Workspace deletion | Must Have |
| Data export (GDPR) | Should Have |
| Audit log | Nice To Have |

---

### Design System & UX

| Feature | Priority |
|---|---|
| Dark mode (default) | Must Have |
| Light mode | Should Have |
| System theme detection | Nice To Have |
| Responsive (mobile view-only) | Must Have |
| Responsive editor (desktop only) | Must Have |
| Animations and transitions | Should Have |
| Toast notifications | Must Have |
| Loading states (skeletons) | Should Have |
| Empty states (all pages) | Must Have |
| Error states (all pages) | Must Have |
| Keyboard navigation | Should Have |
| ARIA / accessibility | Should Have |

---

*Last updated: 2026-06-24*  
*Maintained by: DemoFlow Product Team*  
*This is a living document — update as product decisions evolve*
