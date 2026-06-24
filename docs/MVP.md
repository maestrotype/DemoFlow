# DemoFlow — MVP Strategy

> **Perspective:** Solo developer. Limited time. Zero budget for mistakes.  
> **Goal:** First paying customer as fast as possible.  
> **Stack:** Angular 20 · NestJS · PostgreSQL · Redis · Ollama · FFmpeg  
> **Last updated:** 2026-06-24

---

## The Hard Truth First

The architecture documents in this repo are **excellent for a team of 5**.  
For a solo developer, they describe **6 months of work before a single user can log in**.

Nx monorepo, SSR with hydration, BullMQ queue system, multi-tenant RLS, Puppeteer frame rendering, WebSocket export progress, full RBAC, Stripe billing — every one of these is a correct architectural decision. For a funded team.

For a solo founder launching an MVP, **half of this should not exist yet**.

This document exists to answer one question:  
**What is the absolute minimum that makes someone pay $29/month?**

---

## What DemoFlow Actually Sells

Before listing features, be clear on what the product promises:

> "Upload a screenshot. Get a professional product demo in 5 minutes. No video editor needed."

Every feature that doesn't directly serve this promise is a distraction until you have revenue.

---

## Feature Classification

### 🔴 MUST HAVE — Without this, there is no product

| Feature | Why it's non-negotiable |
|---|---|
| Email + password login | Users need an account |
| Password reset | They will forget passwords |
| Workspace creation on signup | Multi-tenant foundation |
| Upload screenshots (PNG, JPG) | Core input |
| Upload screen recordings (MP4, MOV) | Core input |
| Scene editor — media layer | Place the screenshot on canvas |
| Scene editor — text layer | Add a title or description |
| Scene editor — arrow annotation | Point to UI elements |
| Scene editor — callout/hotspot | Highlight important areas |
| Scene timeline (add, reorder, delete scenes) | Build a sequence |
| Undo / Redo | Users will make mistakes |
| Auto-save | Cannot lose work |
| AI title + description suggestion (Ollama + Qwen VL) | The WOW moment — core differentiator |
| AI step-by-step suggestions | Converts screenshots to scenes automatically |
| AI degraded mode (works without Ollama) | Product must function even if AI is offline |
| MP4 export (FFmpeg) | The primary deliverable |
| Export progress feedback (polling fallback, not WebSocket) | User needs to know it's working |
| Download export | They need to get the file |
| Public share link (`/demo/:shareId`) | Sharing is the viral loop |
| Public demo player (mobile-friendly) | Viewers receive share links on phones |
| Dashboard (recent projects) | Navigate the app |
| Project CRUD (create, list, open, delete) | Manage work |
| Profile settings (name, password) | Basic account management |
| Stripe payment integration (1 paid plan) | Revenue |
| Watermark on FREE exports | Conversion lever |
| Watermark removal on paid plan | Reason to upgrade |
| Dark mode UI | Target audience expects it |
| Empty states on all pages | First-run experience |
| Error states on critical paths | Product must not silently fail |
| Basic responsive layout (dashboard + player) | Viewers are on mobile |

---

### 🟡 SHOULD HAVE — Build after first 10 paying customers

| Feature | Why it waits |
|---|---|
| Magic link login | Nice, but email+password gets you launched |
| Zoom area annotation layer | Useful but not blocking launch |
| Blur / redaction layer | Nice to have for privacy-conscious users |
| Shape layer (rect, circle) | Reduces annotation variety, not launch-critical |
| GIF export | Secondary format — unlock after MP4 is stable |
| Web / HTML export | Secondary format — more complex to build |
| Scene transitions (fade, slide) | Improves quality, not required for v1 |
| AI zoom area suggestions | Adds depth to AI but not blocking |
| Open Graph / Twitter card meta tags on share links | Improves sharing but not day-1 |
| Password-protected share links | Nice security feature |
| Email notifications (export complete) | Reduces anxiety on long exports |
| Invite team members | Solo users launch first |
| Template gallery (5 templates) | Reduces friction for new users |
| Light mode | Most users prefer dark, adds dev time |
| Skeleton loading states | Polish, not function |
| Plan usage counters (exports/month limits) | Needed once you have paying users |
| Invoice history | Required for paying users to manage billing |

---

### 🟢 NICE TO HAVE — Build when you have time, not when you need customers

| Feature | Why it's not urgent |
|---|---|
| Keyboard shortcut system | Power users only |
| Command palette (Cmd+K) | Luxury feature |
| Snap-to-grid | Editor polish |
| Rulers / guides | Editor polish |
| Layer animation (in/out/loop) | Advanced — adds build time |
| 10+ scene transitions | Most users pick 1 type and never change it |
| Custom AI prompt (freeform) | Users rarely use it before the preset suggestions |
| Share link expiry | Useful, not urgent |
| Share analytics (view count) | Nice metric but not needed pre-revenue |
| Allow download toggle on share | Edge case |
| Workspace logo and brand color | Polish |
| Bulk media operations | Power user feature |
| Media tags | Organization — users manage manually until painful |
| Apple Silicon / MLX optimization note in UI | Dev hint, not UX feature |
| Transfer ownership | Rare edge case |
| Audit logs | Enterprise only |
| GDPR data export | Legal, but not MVP launch blocker |
| System theme detection (auto dark/light) | Users pick manually |

---

### ⚫ FUTURE — Version 2.0, do not touch until funded or post-revenue

| Feature | Reality check |
|---|---|
| Nx monorepo setup | Premature optimization. Start with separate repos or simple monorepo |
| SSR + Angular Universal | Adds complexity, no SEO benefit in auth-gated app. Landing page can be static HTML |
| BullMQ + Redis queue for exports | Overkill for MVP. Run FFmpeg synchronously or with a simple job table poll |
| WebSocket for real-time export progress | HTTP polling every 3 seconds is fine for v1 |
| Multi-tenant Row Level Security (RLS) | workspace_id scoping in every query is sufficient |
| Real-time collaboration (multi-editor) | Extremely hard, zero demand at MVP scale |
| Project comments | No team, no comments needed |
| Template marketplace (buy/sell) | Separate product. Distraction. |
| OpenAI provider | Ship with Ollama. OpenAI = future premium tier |
| Custom domain for share links | Nice, complex infra. Post-funding |
| Embed code / iframe support | Web export covers this partially |
| Voice-over / TTS | Separate product scope |
| AI background removal | Separate product scope |
| Version history / project snapshots | Nice, complex. Users won't ask for it before 3 months |
| Roles beyond Owner + Member | Most MVP teams are 1–3 people. Owner IS the admin. |
| Workspace analytics | No data to show pre-traction |
| Admin panel (internal) | Use Prisma Studio + direct DB access |
| Blog / content marketing site | Important but not the app. Build separately |
| 4K export | No paying user will ask for this on day 1 |
| Bulk export | Power user feature, post-scale |

---

## Features To Reject (Brutally Honest)

These items appear in the architecture documents and are **architecturally sound**, but building them before launch would be a serious strategic mistake:

### ❌ Reject for MVP

**1. Nx Monorepo**  
Setting up Nx, configuring shared libs, generators, and dependency graph takes 1–2 days and adds ongoing cognitive overhead. Start with two folders: `client/` and `api/`. Migrate to Nx when the team grows.

**2. Angular SSR / Universal**  
The dashboard and editor are auth-gated — SSR provides zero SEO benefit there. The public demo player (`/demo/:shareId`) benefits from SSR, but for MVP, a client-rendered player is functionally identical. The landing page should be plain HTML/CSS — not Angular.

**3. BullMQ + Redis export queue**  
This architecture solves a problem you don't have yet: thousands of concurrent exports. For MVP, synchronous FFmpeg execution per request (with a 2-minute timeout) is completely acceptable. Add the queue when you have more than 10 concurrent users.

**4. WebSocket for export progress**  
HTTP polling every 3 seconds is imperceptible to users and requires zero additional infrastructure. WebSockets add connection management, reconnection logic, and Redis pub/sub complexity. Save for v1.5.

**5. Full RBAC (Owner / Admin / Member / Viewer)**  
For MVP, you have two roles: logged in (can do everything) and not logged in (can't). Add admin vs. member distinction when you have team customers asking for it.

**6. Multi-step onboarding wizard**  
Show a single "Create your first project" CTA. If users can't figure out the product from the UI alone, the UX needs to improve, not the onboarding wizard.

**7. Media tags**  
Users organize media by eyeballing thumbnails until they have 100+ assets. That's not an MVP problem.

**8. 10 scene transition types**  
Build Fade and None. Add 8 more when users complain.

**9. Template gallery with categories, hover previews, and videos**  
For MVP: 3 hardcoded templates shown on project creation. No gallery page needed.

**10. Audit logs and system events**  
Use PostgreSQL logs and Sentry until you have enterprise customers requiring SOC 2.

---

## MVP Feature List (The Real One)

This is what you actually build. Nothing else.

```
AUTH
  ✓ Register (email + password)
  ✓ Login
  ✓ Password reset (email link)
  ✓ Session persistence (JWT + cookie)

WORKSPACE
  ✓ Auto-created on signup
  ✓ Workspace name
  ✓ Solo use only (no invites in MVP)

PROJECTS
  ✓ Create project (title + type)
  ✓ List projects (dashboard)
  ✓ Open / delete project
  ✓ 3 hardcoded template starters

MEDIA
  ✓ Upload PNG, JPG, MP4, MOV (drag-drop + click)
  ✓ Thumbnail generation (Sharp)
  ✓ Media stored in local filesystem (MVP) or Cloudflare R2

EDITOR
  ✓ Canvas (16:9 fixed)
  ✓ Scene timeline (add, reorder, delete)
  ✓ Media layer (place screenshot on canvas)
  ✓ Text layer (title, description, body)
  ✓ Arrow annotation
  ✓ Callout / speech bubble
  ✓ Hotspot (pulsing circle)
  ✓ Undo / Redo (20 steps minimum)
  ✓ Auto-save (every 3 seconds)
  ✓ Scene duration setting

AI
  ✓ "Analyze screenshot" button
  ✓ AI suggests title, description, steps
  ✓ One-click "Accept all suggestions"
  ✓ AI works via Ollama + Qwen VL
  ✓ "AI Offline" graceful fallback

EXPORT
  ✓ MP4 export (1080p, 30fps)
  ✓ FFmpeg synchronous execution
  ✓ Polling-based progress (every 3s)
  ✓ Download button when complete
  ✓ Watermark on FREE plan

SHARING
  ✓ Public share link (/demo/:shareId)
  ✓ Toggle on/off
  ✓ Client-rendered player (basic controls)
  ✓ "Made with DemoFlow" badge (FREE)

BILLING
  ✓ 1 FREE plan (3 projects, 5 exports/month, watermark)
  ✓ 1 PRO plan ($29/month — unlimited, no watermark)
  ✓ Stripe Checkout (redirect, not embedded)
  ✓ Webhook to activate plan

SETTINGS
  ✓ Display name
  ✓ Change password
  ✓ AI endpoint configuration (Ollama URL + model)

DESIGN
  ✓ Dark mode
  ✓ Empty states (projects list, media library, editor)
  ✓ Toast notifications
  ✓ Loading states (spinner, not skeleton)
```

**Total: ~45 features. Not 120.**

---

## First Paid Version — v1.0

> Goal: Public launch. First 100 users. First $1,000 MRR.

**What's in v1.0 beyond MVP:**

| Addition | Reason |
|---|---|
| GIF export | Second most-requested format by beta users |
| Scene fade transition | Minimal build time, big visual improvement |
| Email notification on export complete | Reduces support tickets ("is it done?") |
| Open Graph meta tags on share links | Share links look professional on Slack/Twitter |
| Password-protected share links | Security-conscious users ask for this early |
| 5 starter templates (gallery page) | Reduces new user time-to-value |
| Zoom area annotation layer | AI suggests them — makes sense to be buildable |
| Invite 1 teammate (Owner + Member only) | Teams share demos internally — first expansion revenue |
| Basic plan limits enforcement | Needed once people upgrade and downgrade |
| Invoice email (Stripe automatic) | Legal requirement for paid users |

**v1.0 is the product you charge money for at launch.**

---

## Version 1.5 — Growth

> Goal: Retention, expansion, first team customers ($99/month plan)

**Build after ~$5K MRR:**

| Addition | Reason |
|---|---|
| Web / HTML export | Embeddable player for websites |
| Light mode | Growing user base = diverse preferences |
| Team plan ($99/month, up to 5 members) | Expand ARPU |
| Role separation (Admin vs Member) | Required for team plan |
| Share analytics (view count, completion) | Users ask "was my demo watched?" |
| Custom CTA on share page | Direct revenue link for users |
| Layer animation (fade in/out) | Polish that improves output quality |
| 10 starter templates | Bigger template library = faster onboarding |
| Magic link login | Passwordless convenience |
| Keyboard shortcuts | Power users request this after 2 weeks |
| Skeleton loading states | Polish that reduces perceived loading time |
| GDPR data export | Required for EU customers |
| Basic workspace analytics | Show users their own usage |
| BullMQ + Redis export queue | Needed when concurrent exports spike |

---

## Version 2.0 — Scale

> Goal: Enterprise deals. $500+/month contracts.

**Build after ~$20K MRR or first enterprise inquiry:**

| Addition | Reason |
|---|---|
| SSR for public demo player | SEO, faster share link load |
| WebSocket export progress | Real-time UX for power users |
| Enterprise plan (custom pricing) | SOC 2, SSO, SLA |
| SSO / SAML | Procurement requirement |
| Custom domain for share links | Enterprise branding |
| Real-time collaboration (basic) | Teams editing together |
| Version history | "Undo from yesterday" |
| Project comments | Stakeholder review workflow |
| OpenAI provider option | Enterprise security teams prefer managed AI |
| Audit log | SOC 2 requirement |
| Admin panel (internal) | Scale operations |
| Template marketplace | New revenue stream |
| White-label option | Agency reseller market |
| API access | Integration with other tools |
| Nx monorepo migration | Team has grown, makes sense now |

---

## Development Time Estimates

> **Context:** Solo developer. Full-stack. Already knows the chosen stack.  
> These are honest estimates, not optimistic ones.

### MVP — 6–8 Weeks

```
Week 1:   Project setup, Auth (register/login/reset), DB schema
Week 2:   Workspace, Projects CRUD, Media upload + thumbnail
Week 3:   Scene editor — canvas, media layer, text layer
Week 4:   Scene editor — arrow, callout, hotspot, timeline
Week 5:   AI integration (Ollama + Qwen VL), suggestion cards
Week 6:   MP4 export (FFmpeg), polling progress, download
Week 7:   Share link + public player, Stripe (checkout + webhook)
Week 8:   Polish, empty states, error handling, deploy, testing
```

**Launch target: 8 weeks from today.**

---

### v1.0 (First Paid Launch) — +3 Weeks

```
Week 9:   GIF export, fade transition, email notifications
Week 10:  OG meta tags, password-protected links, templates
Week 11:  Zoom layer, team invite (1 member), plan limits
```

**Total to sellable v1.0: ~11 weeks.**

---

### v1.5 — +6 Weeks (after first revenue)

```
Weeks 12–17: Items listed in v1.5 above, prioritized by user feedback
```

---

### v2.0 — +12 Weeks (after $20K MRR)

```
Weeks 18–30: Enterprise features, scaled infrastructure
```

---

## The Honest Scope Comparison

| Document | Feature Count | Realistic Solo Build Time |
|---|---|---|
| ARCHITECTURE.md (current) | ~180 features | 6–9 months |
| UX_ARCHITECTURE.md (current) | ~120 features | 4–6 months |
| DATABASE.md (current) | 18 tables, RLS, triggers | 3–4 weeks alone |
| **This MVP.md** | **45 features** | **8 weeks** |

The gap is not that the architecture is wrong. The architecture is excellent for a funded team.  
The gap is that a solo founder launching a product in 8 weeks is playing a different game entirely.

---

## Database Simplification for MVP

The DATABASE.md describes 18 tables. For MVP, you need **9 tables**:

```
users                 ← Auth
workspaces            ← Tenant root
projects              ← Core resource
scenes                ← Scene data (layers as JSONB)
media_assets          ← Uploaded files
ai_analyses           ← AI results (simple, no job table)
export_jobs           ← Simple polling table (no queue)
subscriptions         ← Stripe state
project_shares        ← Share link config
```

**Cut for MVP (add later):**
- `workspace_members` → add when teams ship (v1.0)
- `refresh_tokens` → use httpOnly cookie + Redis simple key-value
- `magic_links` → password reset only in MVP, no magic link login
- `media_asset_tags` → no tags until library grows
- `ai_jobs` → merge into `ai_analyses`, no separate job table
- `plan_limits` → hardcode in application config, not DB
- `usage_records` → count from existing tables on demand
- `template_categories` → 1 hardcoded array in code
- `audit_logs` → use Sentry + DB logs
- `system_events` → not needed
- `share_analytics` → add view_count INTEGER to project_shares

---

## Infrastructure Simplification for MVP

The ARCHITECTURE.md describes a production-grade distributed system.  
For MVP, you need **5 services total**:

```
1. NestJS API (with embedded FFmpeg execution)
2. Angular (client-rendered, no SSR)
3. PostgreSQL
4. Cloudflare R2 or local filesystem (media storage)
5. Ollama (runs on developer machine / same VPS)
```

**Cut for MVP:**
- ❌ Redis → use PostgreSQL for session store and export job state
- ❌ BullMQ → synchronous FFmpeg in a NestJS service
- ❌ Puppeteer → render scenes via a simpler canvas-to-PNG approach or accept lower render fidelity
- ❌ Nx monorepo → two plain folders
- ❌ Docker Compose for dev → just run everything locally

**Hosting MVP on a $24/month VPS (2 vCPU, 4GB RAM):**
- NestJS + Angular build on same server
- PostgreSQL on same server
- Ollama on same server (or developer's own machine if VPS RAM is tight)
- Cloudflare R2 for media ($0 until 10GB)

---

## What To Ship on Day 1 vs. Week 2

### Day 1 (Public Launch)
- Working product at `demoflow.io`
- Register → upload → AI analyze → export → share
- FREE plan live
- PRO plan live ($29/month via Stripe)
- Landing page (plain HTML, not Angular)
- Support email visible

### Week 2 Post-Launch
- Fix bugs from real users (there will be many)
- Add one feature users actually ask for
- Do NOT add features you assumed users would want

---

## Revenue Model for MVP

**Two plans only:**

```
FREE
  Projects:    3
  Exports:     5 per month
  AI analyses: 10 per month
  Watermark:   Yes (DemoFlow badge on exports)
  Storage:     500MB
  Teams:       No

PRO — $29/month
  Projects:    Unlimited
  Exports:     Unlimited
  AI analyses: Unlimited
  Watermark:   No
  Storage:     10GB
  Teams:       No (comes in v1.0)
```

**Why $29?** It's below the "needs budget approval" threshold for most SaaS buyers. A PM at a startup will expense this without asking.

**When to add a TEAM plan?** When 3+ paying customers ask about adding teammates. Not before.

---

## Go-To-Market Strategy (Outside Scope But Included)

The best product demo builder needs to be demonstrated.

**Launch channel priority:**

1. **Product Hunt** — launch on a Tuesday. Prepare demo GIF of the core flow.
2. **Twitter / X** — post the demo output. "I made this in 4 minutes with DemoFlow."
3. **Reddit** — r/SaaS, r/startups, r/ProductManagement, r/Entrepreneur
4. **Indie Hackers** — honest build-in-public post
5. **Cold outreach** — 50 product managers at SaaS companies. Personal email. Show their product's UI as the demo.

**The viral mechanic:**  
Every exported video has "Made with DemoFlow" watermark (FREE) or a share link footer (PRO branded).  
Every time someone shares a demo, DemoFlow acquires a viewer.

---

## Critical Risks

| Risk | Mitigation |
|---|---|
| Ollama setup is too complex for non-technical users | Make AI optional. App works 100% without it. Offer a hosted AI option in v1.5 at extra cost. |
| FFmpeg export is slow (30+ seconds) | Show spinner with estimated time. Users accept wait if expectation is set. |
| Puppeteer frame rendering requires Chromium on server | MVP: skip Puppeteer entirely. Render scenes to canvas PNG via headless Angular service or a simpler HTML-to-image approach. |
| Users expect real-time collaboration on day 1 | It's not in MVP. State this clearly in marketing: "Perfect for solo creators and small teams." |
| Stripe integration delays launch | Use Stripe Checkout (3 API calls) — not a custom billing UI. |
| Angular 20 + Signals learning curve | If you're the solo dev, you know this stack. If not, evaluate switching to something you know. |

---

## Definition of MVP Done

MVP is done when:

```
[ ] A new user can register in under 60 seconds
[ ] They can upload a screenshot in under 30 seconds
[ ] AI analysis completes in under 60 seconds
[ ] They can build a 5-scene demo in under 10 minutes
[ ] MP4 exports correctly play in VLC and browser
[ ] Share link works on iOS Safari (the hardest browser)
[ ] Stripe payment flow works end-to-end (test + live mode)
[ ] Product survives 10 consecutive users without crashing
[ ] You would feel comfortable putting your name on it publicly
```

**If all 9 boxes are checked — ship it.**

Don't wait for v1.5 features to launch. Don't wait for SSR. Don't wait for the perfect architecture.  
Ship the thing that solves the problem. Everything else is engineering comfort.

---

## Summary

| Phase | Timeline | Goal | Key Metric |
|---|---|---|---|
| **MVP** | Weeks 1–8 | Working product, first 10 users | First paying customer |
| **v1.0** | Weeks 9–11 | Public launch, 100 users | $1K MRR |
| **v1.5** | Weeks 12–17 | Retention + teams | $5K MRR |
| **v2.0** | Weeks 18–30 | Enterprise | $20K MRR |

The architecture documents in `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, and `docs/UX_ARCHITECTURE.md` represent the correct **destination**. This document represents the correct **starting point**.

Build the MVP. Get users. Let users tell you what to build next.

---

*Last updated: 2026-06-24*  
*Author: DemoFlow — Solo Founder Perspective*  
*This document takes precedence over all other architecture documents during the MVP phase.*
