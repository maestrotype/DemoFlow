# DemoFlow — Feature Specifications

> **Version:** 1.0.0  
> **Document Type:** Product Feature Matrix & Specifications  
> **Last Updated:** 2026-06-24  
> **Reference Documents:** [MVP.md](file:///Users/andriidanichkin/Documents/myProjects/DemoFlow/docs/MVP.md), [ROADMAP.md](file:///Users/andriidanichkin/Documents/myProjects/DemoFlow/docs/ROADMAP.md), [UX_ARCHITECTURE.md](file:///Users/andriidanichkin/Documents/myProjects/DemoFlow/docs/UX_ARCHITECTURE.md), [DATABASE.md](file:///Users/andriidanichkin/Documents/myProjects/DemoFlow/docs/DATABASE.md)

---

## Document Purpose

This document provides a detailed breakdown of all user-facing and backend features for DemoFlow. For each module, it defines the User Experience (UX), backend mechanics, and release phasing (MVP vs. post-launch iterations). Use this as the definitive guide for product scope and development specifications.

---

## Table of Contents

1. [Authentication & Security](#1-authentication--security)
2. [Dashboard & Project Management](#2-dashboard--project-management)
3. [Scene Editor](#3-scene-editor)
4. [Media Library](#4-media-library)
5. [AI Assistant](#5-ai-assistant)
6. [Export Engine](#6-export-engine)
7. [Sharing & Hosting](#7-sharing--hosting)
8. [Workspace & Team Collaboration](#8-workspace--team-collaboration)
9. [Subscription & Billing](#9-subscription--billing)
10. [Feature Phase Matrix Summary](#10-feature-phase-matrix-summary)

---

## 1. Authentication & Security

### 1.1 Register
*   **UX / UI:** A sleek, glassmorphic auth page with a single-column layout. Forms feature instant inline validation (strength meter for passwords, email format verification). Includes a clear transition to the login page.
*   **Backend System:**
    *   Creates a `User` record with password hashing (bcrypt, 10 salt rounds).
    *   Auto-creates an initial `Workspace` owned by the user (named `"Personal Workspace"` or custom based on the user's name).
    *   Creates a `WorkspaceMember` record linking the user to the workspace with the `OWNER` role.
    *   Issues an HTTP-only, Secure, SameSite=Strict cookie containing the initial JSON Web Token (JWT).
*   **Phase:** 🔴 **MVP (Week 1)**

### 1.2 Login
*   **UX / UI:** Match registration aesthetic. Clean email and password inputs, with an option to remember the session.
*   **Backend System:**
    *   Verifies credentials against the `User` table.
    *   Generates a cryptographically secure access token (valid for 15 minutes) and a refresh token (valid for 7 days).
    *   Signs tokens using RS256 private key configuration.
*   **Phase:** 🔴 **MVP (Week 1)**

### 1.3 Refresh Token
*   **UX / UI:** Invisible to the user. Silent token exchange prevents disruption during active sessions.
*   **Backend System:**
    *   Validates the incoming refresh token from the client's HTTP-only cookie.
    *   Compares the hash of the token against `refresh_token_hash` stored in the `User` database record.
    *   Issues a new access token and updates the refresh token in the cookie (rotation strategy).
*   **Phase:** 🔴 **MVP (Week 1)**

### 1.4 Forgot Password
*   **UX / UI:** Simple "Forgot Password?" link on the login form. Transitions to a form requesting email. On submission, displays a notification toast with instructions.
*   **Backend System:**
    *   Validates existence of the email in the DB.
    *   Generates a single-use token with a 1-hour expiry, stored in the `PasswordResetToken` table.
    *   Sends a password reset email via Nodemailer containing a signed secure link.
    *   Exposes a password change form that consumes the token, updates the password hash, and invalidates the token.
*   **Phase:** 🔴 **MVP (Week 1)**

### 1.5 Magic Link Login
*   **UX / UI:** Input email, click "Send Magic Link", check inbox, click link to auto-authenticate without a password.
*   **Backend System:** Generates a short-lived token (15 mins), emails link, validates on click, and issues a standard JWT.
*   **Phase:** 🟡 **v1.0 (Week 10)**

### 1.6 Single Sign-On (SSO / SAML)
*   **UX / UI:** "Sign in with SSO" button on the login screen. Redirects to external corporate identity providers (Okta, Google Workspace, Azure AD).
*   **Backend System:** SAML 2.0 integration via Passport.js configuration. Maps corporate groups to roles in corporate workspace.
*   **Phase:** ⚫ **v2.0 (Weeks 18–20)**

---

## 2. Dashboard & Project Management

```
┌────────────────────────────────────────────────────────────────────────┐
│  DemoFlow  [ Search projects... (Cmd+K) ]            Workspace (PRO)   │
├────────────────────────────────────────────────────────────────────────┤
│  📁 Recent Projects                                   [+ Create Demo]   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │ Project Alpha    │  │ Project Beta     │  │ Project Gamma    │      │
│  │ (3 scenes, 45s)  │  │ (10 scenes, 2m)  │  │ (1 scene, 15s)   │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│                                                                        │
│  📁 Media Library  [Upload New]                                        │
│  [■] screenshot1.png  [▶] onboarding.mp4  [■] settings_ui.jpg          │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Recent Projects
*   **UX / UI:** Grid layout showing recent projects with generated 16:9 thumbnails, title, scene count, duration, and last edited date. Displays empty state with a "Create Demo" button if no projects exist.
*   **Backend System:** Queries the `Project` table filtered by `workspaceId` and sorted by `updatedAt` descending. Returns paginated results (limit: 6 for widgets, 24 for main list).
*   **Phase:** 🔴 **MVP (Week 2)**

### 2.2 Create Demo
*   **UX / UI:** Clickable card or primary button. Opens a dialog to name the project, choose a format (interactive web vs. video template), and select a workspace.
*   **Backend System:** Creates a new `Project` record in PostgreSQL with default values and blank scene. Generates a unique CUID identifier.
*   **Phase:** 🔴 **MVP (Week 2)**

### 2.3 Search
*   **UX / UI:** Real-time search bar at the top of the dashboard. Highlights matching keywords in title or description. Debounced keyboard inputs.
*   **Backend System:** Uses a PostgreSQL index on `title` and `description` to run a case-insensitive sub-string search.
*   **Phase:** 🔴 **MVP (Week 2)**

### 2.4 Project Duplication
*   **UX / UI:** "Duplicate" option in project context menus. Instantly clones the project, appending `" (Copy)"` to the title.
*   **Backend System:** Deep-copies the `Project`, its related `Scene` records, and all corresponding `Layer` records in a single database transaction.
*   **Phase:** 🟡 **v1.0 (Week 9)**

### 2.5 Template Gallery
*   **UX / UI:** A section showing predefined layouts (e.g., Onboarding Tutorial, Feature Showcase, Quick Change Log). User previews a layout and applies it to create a pre-populated project.
*   **Backend System:** Clones rows from a system-owned read-only `Template` schema to the user's workspace.
*   **Phase:**
    *   **3 Hardcoded Starters:** 🔴 **MVP (Week 8)**
    *   **Full Template Gallery Page (5+ Categories):** 🟡 **v1.0 (Week 10)**

---

## 3. Scene Editor

The creative engine. Consists of a full-screen layout divided into: Canvas (Center), Timeline (Bottom), Layer panel (Left), Properties panel (Right), and AI suggestions (Overlay).

```
┌────────────────────────────────────────────────────────────────────────┐
│  [← Back]  Project: Landing Demo      [Preview]  [Share]  [Export ▼]   │
├─────────────┬────────────────────────────────────────────┬─────────────┤
│ Layers      │                                            │ Properties  │
│ [x] Text    │          ┌──────────────────────┐          │             │
│ [x] Arrow   │          │  *Canvas View*       │          │ Text Size:  │
│ [x] Screen  │          │  (16:9 Aspect Ratio) │          │ [ 16px ]    │
│             │          └──────────────────────┘          │             │
│             │                                            │ Color:      │
│             │                                            │ [ #7c5ce7 ] │
├─────────────┴────────────────────────────────────────────┴─────────────┤
│ Timeline: [▶]  [Scene 1 (10s)]  [Scene 2 (15s)]  [Scene 3 (5s)]  [+]   │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Canvas
*   **UX / UI:** Absolute center of the editor. Enforces a 16:9 aspect ratio regardless of monitor size using viewport containment scaling (letterboxing where needed). Responsive grid lines.
*   **Backend System:** Client-only rendering container using Angular elements. Saves absolute coordinate positions (in percentages `0-100%` of canvas width/height) to preserve responsive scalability.
*   **Phase:** 🔴 **MVP (Week 3)**

### 3.2 Timeline
*   **UX / UI:** Located at the bottom of the editor. Represents sequential scenes. Supports drag-and-drop to reorder, individual scene duration adjustment input (in seconds), duplicate scene button, and delete scene button.
*   **Backend System:** Reorders scenes in database via order indices. Adjusts the `durationMs` field on the corresponding `Scene` record.
*   **Phase:** 🔴 **MVP (Week 4)**

### 3.3 Layers System
*   **UX / UI:** The left panel lists all layers inside the currently selected scene. Click to select, toggle eye icon for visibility, drag-and-drop vertically to adjust z-index.
*   **Backend System:** Persists layer configuration as a serialized JSON array (`JSONB` column on the `Scene` table or separate `Layer` records).
*   **Phase:** 🔴 **MVP (Week 3)**

### 3.4 Annotation Layer Types
*   **Media Layer:** Drag screenshots/recordings from library and place them. Resize and crop directly on canvas. (🔴 **MVP**)
*   **Text Layer:** Click to drop text block. Double click to edit inline. Settings for font family, size, weight, alignment, and color. (🔴 **MVP**)
*   **Arrow Layer:** Click to place. Double control-points to edit target location and source tail. Adjustable color and line weight. (🔴 **MVP**)
*   **Speech Bubble / Callout Layer:** Container box with an editable tail pointing directly to elements. Content updates inline. (🔴 **MVP**)
*   **Hotspot Layer:** Pulsing indicator circle to draw user's eye to clickable areas. Customizable speed and radius. (🔴 **MVP**)
*   **Zoom Area Layer:** Draw a bounding rectangle over a section of a screenshot. The player animates a smooth scale and pan to this area on playback. (🟡 **v1.0**)
*   **Blur / Redaction Layer:** Drag box to pixelate or black-out confidential user data on screenshots. (🟡 **v1.5**)
*   **Shape Layer:** Rectangles, circles, and polygons with custom fill opacity and border styles. (🟡 **v1.5**)

### 3.5 Properties Panel
*   **UX / UI:** Contextual panel on the right. Displays options corresponding to the selected element (e.g., character spacing for Text, point style for Arrows, scale for Screenshots). If no element is selected, controls default scene parameters (background color, transitions).
*   **Backend System:** Dynamic UI state bound to the active layer model signal. Auto-saves changes via debounced state syncing.
*   **Phase:** 🔴 **MVP (Week 3)**

### 3.6 Undo / Redo Stack
*   **UX / UI:** Global triggers `Cmd+Z` and `Cmd+Shift+Z` with corresponding toolbar buttons. Toast indicator showing executed undo/redo step description.
*   **Backend System:** Client-side Signal state stores an array containing the last 20 snapshot states of the active scene. No database queries triggered until auto-save resolves.
*   **Phase:** 🔴 **MVP (Week 3)**

### 3.7 Auto-save
*   **UX / UI:** Invisible to the user. A subtle indicator in the top header displays `"Saved"` or `"Saving..."`.
*   **Backend System:** Debounces client mutations (waits 3 seconds after the user stops editing) and dispatches a single PATCH request containing updated scene schema configurations.
*   **Phase:** 🔴 **MVP (Week 3)**

### 3.8 Scene Transitions
*   **UX / UI:** Interactive transition button between scene modules in the timeline. Choice of None, Fade, Slide, or Zoom.
*   **Backend System:** Transition type saved to scene metadata. FFmpeg compiler processes video files using corresponding filters (`xfade`).
*   **Phase:**
    *   **None + Fade:** 🟡 **v1.0 (Week 9)**
    *   **Advanced Transitions (Slide, Zoom, etc.):** 🟢 **v1.5 (Week 16)**

### 3.9 Layer Animations
*   **UX / UI:** Timing sliders within the timeline or properties panel to specify exactly when an annotation layer appears and leaves. Includes preset animations (fade-in, pop, bounce-in).
*   **Backend System:** Saved as animation metadata on layers. Player reads timelines to trigger CSS animation classes at specific timestamps.
*   **Phase:** 🟢 **v1.5 (Week 16)**

---

## 4. Media Library

### 4.1 Upload Media
*   **UX / UI:** Drag-and-drop dashboard area or "Upload Media" button. Shows upload progress bar, active upload speed, and file format validation warnings.
*   **Backend System:**
    *   Accepts multipart file payloads (PNG, JPG, MP4, MOV).
    *   Saves original raw assets to Cloudflare R2 bucket.
    *   Executes Sharp image processor or FFmpeg worker to construct 400x225px compressed JPEG thumbnails.
    *   Creates a `MediaAsset` record containing dimensions, duration, type, and URL properties.
*   **Phase:** 🔴 **MVP (Week 2)**

### 4.2 Library Grid Browser
*   **UX / UI:** Grid layout categorized by type (Screenshots vs. Video Recordings). Hovering over videos plays a muted 3-second preview.
*   **Backend System:** Paginated directory query endpoint (`GET /media`) returning matching workspace assets.
*   **Phase:** 🔴 **MVP (Week 2)**

### 4.3 Bulk Media Operations
*   **UX / UI:** Checkbox toggle multi-selection. Allows bulk deletion or tagging of multiple media assets at once.
*   **Backend System:** Bulk deletion transaction deletes keys in R2 buckets and runs bulk SQL deletion operations.
*   **Phase:** 🟢 **v1.5 (Week 11–13)**

---

## 5. AI Assistant

The main visual intelligence value prop.

### 5.1 Screenshot Analysis
*   **UX / UI:** "Analyze Image with AI" button on newly uploaded screenshots. Shows dynamic ambient purple glow while processing.
*   **Backend System:**
    *   API routes task to AI queue.
    *   Feeds base64 image data to local Ollama runtime using Qwen-VL model configuration.
    *   Systems instructions guide model to identify UI headers, sidebars, active input elements, and buttons.
    *   Saves structured recommendation results (Title, Callouts, Steps coordinates) to `AIAnalysis` table.
*   **Phase:** 🔴 **MVP (Week 5)**

### 5.2 Auto-Scene Generation
*   **UX / UI:** Card UI lists suggested scenes (e.g., "Click on Login Input", "Fill Out Username Form"). User selects "Approve All" or checks individual items. Instantly adds scenes to the timeline.
*   **Backend System:** Maps bounding coordinates from AI response to actual canvas coordinates. Generates appropriate hotspots and text layers automatically.
*   **Phase:** 🔴 **MVP (Week 5)**

### 5.3 Copywriting Assistant
*   **UX / UI:** In properties panel text boxes, an "Enhance with AI" command is available. User specifies a tone (Professional, Conversational, Pitch).
*   **Backend System:** Requests Qwen/Llama helper endpoint to reword the current text to fit onboarding or feature explanation context.
*   **Phase:** 🟡 **v1.0 (Week 10)**

### 5.4 Text-to-Speech Voiceovers
*   **UX / UI:** Audio track selection below the scene timeline. User types script sentences, selects a speaker model voice, and clicks "Generate Voiceover".
*   **Backend System:** API calls ElevenLabs or local Coqui TTS instance to generate MP3 files, attaches file link to scene, and compiles audio tracks to MP4 during export.
*   **Phase:** ⚫ **v2.0 (Weeks 21–23)**

---

## 6. Export Engine

Converts browser-rendered editor setups into actual shareable files.

### 6.1 MP4 Rendering (FFmpeg Pipeline)
*   **UX / UI:** Click "Export", select quality format, click "Generate". Shows progress bar. User receives a download button when complete.
*   **Backend System:**
    *   Extracts coordinates, frames, duration, and styling rules of scenes.
    *   Renders each scene canvas to high-res PNG frames (using canvas snapshot API or Puppeteer browser instances).
    *   Sequences PNG images and compiles them to 1080p 30fps MP4 file using NestJS FFmpeg worker.
    *   Saves generated MP4 file to R2 bucket.
*   **Phase:** 🔴 **MVP (Week 6)**

### 6.2 Export Job Queue
*   **UX / UI:** In MVP, simple loading screens with polling. In post-launch, shows global task bar containing active exports.
*   **Backend System:**
    *   **MVP:** Simple job entries updated by direct endpoint polling.
    *   **v1.5+:** BullMQ + Redis job runner queues files, process limits concurrency to 2 threads per VM to prevent system memory lockups.
*   **Phase:**
    *   **HTTP Polling (MVP):** 🔴 **MVP (Week 6)**
    *   **BullMQ + Redis Queue System:** 🟢 **v1.5 (Week 17)**

### 6.3 Brand Watermark
*   **UX / UI:** Small "Made with DemoFlow" stamp in bottom-right corner of exported videos. Text instructions on export panel advise upgrade to PRO removes watermark.
*   **Backend System:** API checks active billing subscription. If plan equals `FREE`, compiles overlay onto frames during rendering.
*   **Phase:** 🔴 **MVP (Week 7)**

### 6.4 GIF Export
*   **UX / UI:** Selector dropdown under exports to target GIF format.
*   **Backend System:** FFmpeg translates source image frames to color palettes and generates optimized GIF outputs (max width: 800px, 15fps).
*   **Phase:** 🟡 **v1.0 (Week 9)**

### 6.5 Web / HTML Export
*   **UX / UI:** Export type option "Embeddable Player". Yields a downloaded single file HTML/JS pack or standard `<iframe>` HTML paste snippet.
*   **Backend System:** Packages JSON configurations into a self-contained runtime player file utilizing Angular Custom Elements.
*   **Phase:** 🟡 **v1.0 (Week 11 / Week 14)**

---

## 7. Sharing & Hosting

```
┌────────────────────────────────────────────────────────┐
│  ▶  Interactive Demo Player                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │         [ Pulsing Hotspot: Click Login ]         │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│  [■] Scene 1    [■] Scene 2    [ ] Scene 3   [Made by] │
└────────────────────────────────────────────────────────┘
```

### 7.1 Public Share Page
*   **UX / UI:** Desktop and mobile-responsive webpage rendering the interactive demo player. Viewer steps through pages by clicking hotspots, callouts, or tapping keyboard space/arrow keys.
*   **Backend System:** Public routing page (`GET /demo/:shareId`). Resolves project properties without authentication checks.
*   **Phase:** 🔴 **MVP (Week 7)**

### 7.2 Password Protection
*   **UX / UI:** Toggle on project share settings: "Require password". Viewers accessing the link must enter correct credentials to load the player.
*   **Backend System:** Checks password hash in database and saves session auth cookie to viewer context.
*   **Phase:** 🟡 **v1.0 (Week 10)**

### 7.3 Custom CTA (Call To Action) Overlay
*   **UX / UI:** Setting to display a button overlay on the final frame (e.g., "Sign Up Now" pointing to target product URL).
*   **Backend System:** Saves target title and URL link configurations in the database. Interactive player displays overlay on completion state.
*   **Phase:** 🟡 **v1.0 (Week 14)**

### 7.4 Custom Domain
*   **UX / UI:** Settings field "Custom Domain" (e.g., `demos.company.com`). Instantly links public share page to enterprise assets.
*   **Backend System:** CNAME record routing and automatic SSL certificate generation via Let's Encrypt / Cloudflare integrations.
*   **Phase:** ⚫ **v2.0 (Weeks 18–20)**

---

## 8. Workspace & Team Collaboration

### 8.1 Auto-Workspace Configuration
*   **UX / UI:** Seamless onboarding initialization. Auto-names the workspace on account creation.
*   **Backend System:** Generates corresponding database row in `Workspace` table using initial user settings.
*   **Phase:** 🔴 **MVP (Week 1)**

### 8.2 Team Invites
*   **UX / UI:** Workspace Settings view. Enter email address, select role, and click "Send Invite". Shows active and pending invites.
*   **Backend System:**
    *   Creates a record in `WorkspaceInvite` table with a secure cryptographic token.
    *   Emails invite link.
    *   On click, creates a `WorkspaceMember` relationship record and updates user account references.
*   **Phase:** 🟡 **v1.0 (Week 11)**

### 8.3 Roles & Permissions
*   **UX / UI:** Dropdowns in team settings view listing Member levels.
*   **Backend System:** Enforces Role-Based Access Control (RBAC) across API layers:
    *   `OWNER`: Complete control, manages subscriptions.
    *   `ADMIN`: Manages members, configurations.
    *   `MEMBER`: Can create, view, edit projects.
    *   `VIEWER`: Read-only views of templates and projects.
*   **Phase:**
    *   **Simple Owner vs Member:** 🟡 **v1.0 (Week 11)**
    *   **Granular RBAC (Admin, Viewer, etc.):** 🟢 **v1.5 (Week 12–13)**

### 8.4 Real-time Comments
*   **UX / UI:** Sidebar or hover cards on the canvas. Place comments on specific timeline frames to provide feedback.
*   **Backend System:** Database mapping table linking comments to specific users, scenes, and coordinates. Sends websocket updates.
*   **Phase:** ⚫ **v2.0 (Weeks 24–26)**

---

## 9. Subscription & Billing

### 9.1 Stripe Checkout Redirect
*   **UX / UI:** Banner or pricing cards page. Click "Upgrade to PRO", loading overlay displays while redirecting to Stripe payment page.
*   **Backend System:** Creates a Stripe Checkout Session via Stripe SDK and returns redirect link URL to client.
*   **Phase:** 🔴 **MVP (Week 7)**

### 9.2 Webhook Plan Sync
*   **UX / UI:** Immediate "Pro Plan Activated" banner overlay on successful payment return.
*   **Backend System:** Listens for Stripe webhooks (`checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`) to update corresponding fields in the database subscription table.
*   **Phase:** 🔴 **MVP (Week 7)**

### 9.3 Usage Quota Check
*   **UX / UI:** Modal displays warning "Export limit reached. Upgrade to Pro for unlimited exports" when limits are exceeded.
*   **Backend System:** Before executing operations, queries the DB count of projects or exports within the billing cycle and compares values against plan limits.
*   **Phase:** 🟡 **v1.0 (Week 11)**

---

## 10. Feature Phase Matrix Summary

| Category | Feature Name | Core MVP (🔴) | v1.0 (🟡) | v1.5 (🟢) | v2.0+ (⚫) | Reference DB / API Endpoints |
|:---|:---|:---:|:---:|:---:|:---:|:---|
| **Auth** | Register | **X** | | | | `POST /auth/register` |
| | Login | **X** | | | | `POST /auth/login` |
| | Refresh Token | **X** | | | | `POST /auth/refresh` |
| | Forgot Password | **X** | | | | `POST /auth/forgot-password` |
| | Magic Link | | **X** | | | `POST /auth/magic-link` |
| | SSO / SAML | | | | **X** | `POST /auth/sso` |
| **Project** | Recent Projects | **X** | | | | `GET /projects` |
| | Create Demo | **X** | | | | `POST /projects` |
| | Search | **X** | | | | `GET /projects?search=query` |
| | Duplication | | **X** | | | `POST /projects/:id/duplicate` |
| | Template Starters | **X** | | | | System Seed |
| | Template Gallery | | **X** | | | `GET /templates` |
| **Editor** | Canvas | **X** | | | | Angular Client Component |
| | Timeline | **X** | | | | `POST /projects/:id/scenes` |
| | Layers Panel | **X** | | | | Angular Client Component |
| | Properties Panel | **X** | | | | Angular Client Component |
| | Media/Text Layer | **X** | | | | `PATCH /scenes/:id` |
| | Arrow/Hotspot | **X** | | | | `PATCH /scenes/:id` |
| | Zoom Area Layer | | **X** | | | `PATCH /scenes/:id` |
| | Blur/Redaction | | | **X** | | `PATCH /scenes/:id` |
| | Shape Layer | | | **X** | | `PATCH /scenes/:id` |
| | Undo / Redo | **X** | | | | Angular Client State |
| | Auto-save | **X** | | | | `PATCH /scenes/:id` (Debounced) |
| | Transitions (Fade) | | **X** | | | `PATCH /scenes/:id` (FFmpeg) |
| | Transitions (All) | | | **X** | | `PATCH /scenes/:id` (FFmpeg) |
| | Layer Animations | | | **X** | | `PATCH /scenes/:id` (CSS/Web) |
| **Media** | Multi-upload | **X** | | | | `POST /media/upload` |
| | Auto-thumbnails | **X** | | | | Sharp / FFmpeg Worker |
| | Library Grid | **X** | | | | `GET /media` |
| | Bulk Operations | | | **X** | | `POST /media/bulk-action` |
| **AI** | Image Analysis | **X** | | | | `POST /media/:id/analyze` |
| | Auto-scenes | **X** | | | | Qwen-VL Mapper |
| | Copy Assistant | | **X** | | | `POST /ai/generate-copy` |
| | Voiceover (TTS) | | | | **X** | `POST /ai/generate-tts` |
| **Export** | MP4 Compiler | **X** | | | | `POST /export` (FFmpeg) |
| | Watermark | **X** | | | | `POST /export` (Overlay) |
| | Job Queue | | | **X** | | BullMQ + Redis |
| | GIF Export | | **X** | | | `POST /export?format=gif` |
| | HTML Web Export | | **X** | | | `POST /export?format=web` |
| **Sharing** | Public Page | **X** | | | | `GET /demo/:shareId` |
| | Password Lock | | **X** | | | `POST /demo/:shareId/lock` |
| | Custom CTA | | **X** | | | `PATCH /projects/:id/settings` |
| | Custom Domain | | | | **X** | Route53 / Let's Encrypt |
| **Teams** | Workspace Setup | **X** | | | | `POST /workspace` |
| | Invites | | **X** | | | `POST /workspace/invites` |
| | Basic Owner/Member| | **X** | | | `GET /workspace/members` |
| | Full RBAC | | | **X** | | `PATCH /workspace/members/:id` |
| | Comments | | | | **X** | WebSockets / Comment DB |
| **Billing** | Stripe Redirect | **X** | | | | `POST /billing/checkout` |
| | Sync Webhooks | **X** | | | | `POST /billing/webhooks` |
| | Limit Checks | | **X** | | | `GET /billing/limits` |
