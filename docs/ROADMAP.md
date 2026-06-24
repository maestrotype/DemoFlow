# DemoFlow — Product Roadmap

> **Type:** Solo-founder roadmap. Revenue-driven. Scope-controlled.
> **Stack:** Angular 20 · NestJS · PostgreSQL · Ollama · FFmpeg
> **Last updated:** 2026-06-24
> **Source of truth:** Cross-referenced with MVP.md, ARCHITECTURE.md, UX_ARCHITECTURE.md

---

## Roadmap Philosophy

This roadmap is **output-driven**, not feature-driven.

Each phase has one job: achieve a specific business outcome. Features exist to serve that outcome — not the other way around. If a feature doesn't move the current phase's metric, it doesn't ship in that phase.

```
Phase     → Business Outcome        → Key Metric
──────────────────────────────────────────────────
MVP       → Prove the product works → First paying user
v1.0      → Prove people want it    → $1,000 MRR
v1.5      → Prove it retains        → $5,000 MRR / <5% monthly churn
v2.0      → Prove it scales         → $20,000 MRR / first enterprise deal
```

---

## Phase Overview

```
Week 1──────────────────────────────────────────────────────Week 30
│                                                           │
│ ██████████████████ MVP ████████████████████              │
│                    Week 8                                 │
│                    │                                      │
│                    │ ████████ v1.0 ████████               │
│                              Week 11                      │
│                              │                            │
│                              │ ████████████ v1.5 ████████ │
│                                            Week 17        │
│                                            │              │
│                                            │ ████ v2.0 ██ │
│                                                  Week 30  │
└───────────────────────────────────────────────────────────┘
```

---

## MVP — Weeks 1–8

> **Outcome:** A working product that can be demoed, shared, and charged for.
> **Target metric:** First paying user before Week 9.

### Week 1 — Foundation

**Goal:** Project running locally. Auth working end-to-end.

| Task | Area | Notes |
|---|---|---|
| Initialize Angular 20 + NestJS (two plain folders, no Nx) | Setup | `/client` and `/api` |
| Configure PostgreSQL + Prisma with 9 MVP tables | DB | See MVP.md DB simplification |
| Implement register + login + JWT (httpOnly cookie) | Auth | bcrypt, RS256 JWT |
| Password reset via email token | Auth | Nodemailer + token table |
| Auto-create workspace on registration | Workspace | Name = user's name by default |
| Deploy skeleton to VPS ($24/month) + domain DNS | Infra | Nginx reverse proxy |
| Cloudflare R2 bucket setup | Storage | Media files from day 1 |

**End of week checkpoint:** `POST /auth/register` → user created → workspace created → JWT issued

---

### Week 2 — Core Data Layer

**Goal:** Projects and media fully functional via API.

| Task | Area | Notes |
|---|---|---|
| Projects CRUD API + Angular pages (list, create, delete) | Projects | Dashboard + `/projects` route |
| Media upload API (multipart, PNG/JPG/MP4/MOV) | Media | Multer + R2 upload |
| Sharp thumbnail generation on upload | Media | 400×225px JPEG |
| Media library page (grid, drag-drop upload) | Media | Basic, no filters yet |
| Dashboard — recent projects widget | Dashboard | Last 6 projects |
| Design system foundation — CSS tokens, dark theme | Design | Colors, spacing, typography |
| Global layout — sidebar + topbar + auth guard | Layout | App shell complete |

**End of week checkpoint:** User can upload a screenshot and see it in the media library.

---

### Week 3 — Editor Part 1

**Goal:** Canvas works. User can place a screenshot and add text.

| Task | Area | Notes |
|---|---|---|
| Editor route + full-screen layout | Editor | No sidebar, dedicated toolbar |
| Canvas component (16:9, fixed aspect ratio) | Editor | CSS-based, not WebGL |
| Media layer — drag from library, place on canvas | Editor | Position, size, opacity |
| Text layer — click to place, inline edit | Editor | Font, size, color, alignment |
| Layer panel — list, visibility, z-order | Editor | Left panel |
| Properties panel — context-aware per selection | Editor | Right panel |
| Auto-save every 3 seconds (debounced PATCH) | Editor | Scene JSON to DB |
| Undo / Redo — 20 step stack | Editor | In-memory signal stack |

**End of week checkpoint:** User opens editor, places a screenshot, adds a title, sees it auto-save.

---

### Week 4 — Editor Part 2

**Goal:** Annotation layers + scene timeline complete. The editor is usable.

| Task | Area | Notes |
|---|---|---|
| Arrow annotation layer | Editor | SVG-based, color + thickness |
| Callout / speech bubble layer | Editor | Text + pointer direction |
| Hotspot layer (pulsing circle) | Editor | Animated CSS, label |
| Scene timeline — add, reorder (drag), delete | Timeline | Bottom strip |
| Scene duration control | Timeline | Click to edit |
| Scene thumbnail generation (canvas snapshot) | Timeline | 160×90px on save |
| Scene CRUD API | API | POST/PATCH/DELETE `/projects/:id/scenes` |
| Scene reorder API | API | POST `/projects/:id/scenes/reorder` |

**End of week checkpoint:** User builds a 5-scene demo with annotations. Reorders scenes. Product is demonstrable.

---

### Week 5 — AI Integration

**Goal:** AI analyzes a screenshot and suggests scenes. The WOW moment.

| Task | Area | Notes |
|---|---|---|
| Ollama health check on app startup | AI | GET `/api/version` → provider status signal |
| AI analysis API — POST `/ai/analyze` | AI | Accepts mediaAssetId, returns jobId |
| Qwen VL prompt engineering — structured JSON output | AI | System prompt + schema enforcement |
| AI suggestion cards in right panel | Editor | Title, description, steps |
| One-click "Accept all" → creates scenes from suggestions | Editor | Maps steps → Scene objects |
| "AI Offline" graceful fallback — manual mode | AI | Yellow badge, no broken UI |
| AI analysis progress polling (GET every 3s) | AI | Simple status column on ai_analyses table |
| Ollama configuration in Settings page | Settings | URL input + test connection |

**End of week checkpoint:** Upload screenshot → click Analyze → watch AI create 5 scenes in 60 seconds.

---

### Week 6 — Export Engine

**Goal:** MP4 export works. User has a file they can share anywhere.

| Task | Area | Notes |
|---|---|---|
| Scene-to-PNG renderer (html-to-image or canvas snapshot) | Export | Renders Angular component to PNG |
| FFmpeg execution service — PNG sequence → MP4 | Export | libx264, CRF 22, 30fps, 1080p |
| Watermark overlay (FREE plan) — FFmpeg drawtext | Export | "Made with DemoFlow" bottom-right |
| Export job table — polling endpoint GET `/export/:id` | Export | status + progress_percent columns |
| Export modal UI — format picker + start button | Export | Simple, 1 format (MP4) for now |
| Export progress UI — spinner + phase label | Export | Polling every 3 seconds |
| Download button on completion | Export | Presigned R2 URL, 24hr expiry |
| Export history on project detail page | Projects | Last 5 exports |

**End of week checkpoint:** Full flow: 5-scene demo → Export → MP4 downloads and plays in browser.

---

### Week 7 — Sharing + Billing

**Goal:** User can share their demo and pay for the product.

| Task | Area | Notes |
|---|---|---|
| project_shares table + toggle API | Sharing | is_public flag |
| Public share link generation (cuid) | Sharing | `/demo/:shareId` |
| Public demo player page (Angular, CSR) | Sharing | Play/pause, scene dots, progress bar |
| "Made with DemoFlow" badge on player (FREE) | Sharing | Links to landing page |
| Mobile-responsive player | Sharing | iOS Safari must work |
| Stripe product + price setup ($29/month PRO) | Billing | In Stripe dashboard |
| Stripe Checkout redirect — POST `/billing/checkout` | Billing | 3 API calls total |
| Stripe webhook handler — activate PRO plan | Billing | Update subscriptions + workspaces.plan |
| Billing page — current plan + upgrade CTA | Settings | Show plan, stripe portal link |
| Plan enforcement — export count + watermark | Billing | Check plan on export job creation |

**End of week checkpoint:** Complete flow: register → build demo → export → share → pay → watermark removed.

---

### Week 8 — Polish + Launch Prep

**Goal:** Product is ready for humans who don't know how it works.

| Task | Area | Notes |
|---|---|---|
| Empty states — all 5 main pages | UX | Illustration + CTA |
| Error states — API errors shown in UI | UX | Toast + inline |
| Loading spinners — async operations | UX | Not skeleton, just spinner |
| Form validation — all auth + settings forms | UX | Inline, not alert() |
| Toast notification system | UX | Success/error/warning |
| 3 hardcoded template starters | Templates | Feature / Onboarding / Changelog |
| Landing page — plain HTML/CSS (not Angular) | Marketing | Hero, features, pricing, CTA |
| Support email + privacy policy + terms | Legal | Required for Stripe |
| Production environment variables | Infra | Separate from dev |
| Smoke test: 10 complete user flows | QA | Register → demo → export → share → pay |
| Deploy to production | Infra | Final go/no-go |

**End of week checkpoint:** A stranger can use the product without help. Ship it.

---

## v1.0 — Weeks 9–11

> **Outcome:** Public launch. Product Hunt. First 100 users. First $1K MRR.
> **Prerequisite:** MVP is live and at least 3 people have paid.

### Week 9 — Export + Quality

| Task | Notes |
|---|---|
| GIF export (FFmpeg two-pass palette method) | Max 800px wide, 15fps |
| Scene fade transition (FFmpeg xfade filter) | Between scenes in MP4 |
| Export quality selector (Draft / Standard / High) | CRF values: 28 / 22 / 18 |
| Email notification on export complete (Nodemailer) | "Your demo is ready" |
| Fix bugs from MVP beta users | Priority over new features |

### Week 10 — Sharing + Discovery

| Task | Notes |
|---|---|
| Open Graph meta tags on `/demo/:shareId` | Title, description, preview image |
| Password-protected share links | bcrypt hash, gate on player page |
| 5 starter templates — gallery page | `/templates` route, cards, apply button |
| Zoom area annotation layer | Rectangle with zoom animation |

### Week 11 — Teams + Limits

| Task | Notes |
|---|---|
| workspace_members table + invite by email | Owner invites 1 member (MVP team feature) |
| Accept invitation flow | Token in email → join workspace |
| Basic plan limits — enforce in API | 3 projects FREE, 5 exports/month FREE |
| Usage counters — show in dashboard | Exports used / storage used |
| Stripe customer portal link | Self-serve plan management |

**Launch:** Product Hunt on a Tuesday. Pre-schedule social posts. Send 50 cold emails to PMs.

---

## v1.5 — Weeks 12–17

> **Outcome:** Retention engine. Teams pay $99/month. Churn < 5%/month.
> **Prerequisite:** $1K MRR sustained for 4 weeks.

### Week 12–13 — Team Plan

| Task | Notes |
|---|---|
| TEAM plan ($99/month, up to 5 members) | New Stripe price |
| Role separation — Admin vs Member | Admins manage workspace, Members create |
| Shared media library (already exists, expose UI) | Team members see all uploads |
| Project visibility — owner or team | Per-project setting |
| Workspace settings page — name, logo | Admin only |

### Week 14 — Web Export

| Task | Notes |
|---|---|
| Web / HTML export engine | Self-contained HTML player file |
| Embed code snippet on share page | `<iframe>` with instructions |
| Custom CTA button on player | Text + URL, PRO feature |

### Week 15 — Analytics + Sharing

| Task | Notes |
|---|---|
| Share analytics — view count, completion rate | view_count on project_shares |
| Share analytics dashboard widget | Simple chart |
| Share link expiry date | Optional, date picker |
| Allow download toggle on share | Show/hide download button |

### Week 16 — Editor Polish

| Task | Notes |
|---|---|
| Layer animation — fade in / fade out | Per-layer, duration + delay |
| Blur / redaction layer | Privacy use case |
| Shape layer (rectangle, circle) | Fill + stroke |
| Light mode | CSS token swap, user preference |
| Magic link login | Passwordless option |

### Week 17 — Infrastructure

| Task | Notes |
|---|---|
| BullMQ + Redis export queue | Handles concurrent export spike |
| Skeleton loading states | Replace spinners with skeletons |
| Keyboard shortcuts (15 key bindings) | Save, undo, scene nav, tool switch |
| GDPR data export endpoint | User data ZIP download |

---

## v2.0 — Weeks 18–30

> **Outcome:** Enterprise-ready. First $500+/month customer.
> **Prerequisite:** $5K MRR sustained for 6 weeks. First inbound enterprise inquiry.

### Weeks 18–20 — Enterprise Foundation

| Task | Notes |
|---|---|
| Enterprise plan (custom pricing, annual billing) | Stripe quote flow |
| SSO / SAML (Okta, Google Workspace) | Passport.js SAML strategy |
| Audit log — all mutations logged to DB | Required for SOC 2 |
| Custom domain for share links | DNS CNAME + SSL wildcard |
| SLA page + uptime monitoring | Enterprise procurement requirement |

### Weeks 21–23 — AI Expansion

| Task | Notes |
|---|---|
| OpenAI GPT-4o provider option | IAIProvider interface — swap in |
| Per-workspace AI provider selection | Settings UI |
| Hosted AI option ($X/month add-on) | For users who can't run Ollama |
| AI custom prompt (freeform) | Advanced user feature |

### Weeks 24–26 — Collaboration

| Task | Notes |
|---|---|
| Project comments — scene-level | Stakeholder review |
| Version history — last 10 snapshots | "Restore from yesterday" |
| @mentions in comments | Notify teammates |
| Project sharing within workspace | Explicit share, not just org-level |

### Weeks 27–28 — Platform

| Task | Notes |
|---|---|
| Template marketplace (sell/buy) | Creator economy layer |
| Public API (REST) | Integrations — Zapier, n8n |
| Angular Starter Kit packaging | Secondary product for devs |
| White-label option | Agency / reseller market |

### Weeks 29–30 — Scale Infrastructure

| Task | Notes |
|---|---|
| SSR for public demo player | SEO + faster cold load |
| WebSocket export progress | Replace polling |
| Nx monorepo migration | Team has grown |
| Multi-region deployment | Latency for EU/APAC users |
| Internal admin panel | Operations at scale |

---

## Milestone Summary

| Milestone | Week | Success Metric |
|---|---|---|
| 🚀 MVP Live | 8 | Product accessible at production URL |
| 💳 First Payment | 9 | 1 paying user ($29/month) |
| 📣 Public Launch | 11 | Product Hunt + 100 registered users |
| 💰 $1K MRR | 12–14 | ~35 PRO subscribers |
| 👥 First Team Customer | 15 | 1 workspace on TEAM plan ($99) |
| 💰 $5K MRR | 17 | ~170 PRO or ~50 TEAM subs |
| 🏢 First Enterprise Lead | 20 | Inbound inquiry or outbound close |
| 💰 $20K MRR | 26 | Mix of PRO + TEAM + 2 Enterprise |

---

## What Is Not On This Roadmap (And Why)

| Excluded Item | Reason |
|---|---|
| Mobile editor app | 6-month project. No demand proven yet. |
| Video recording in-browser | Different product. Build after core is profitable. |
| AI avatars / presenters | Trendy but not core value prop. |
| Figma plugin | Nice channel but significant build complexity. |
| Native desktop app | Zero demand signal at this stage. |
| Built-in screen recorder | Chrome extension or Loom integration is sufficient. |
| Slide import (PPT/Keynote) | Different market, different product. |
| Multi-language UI | Post $20K MRR with user demand signal. |

---

## Decision Rules

1. **Never add to MVP phase.** If a feature is not in Week 1–8, it waits.
2. **Bugs before features.** Any production bug with user impact blocks feature work.
3. **One feature at a time.** No parallel feature development as solo developer.
4. **User request > assumption.** Only build what 3+ users have explicitly asked for.
5. **Revenue metric gates phases.** v1.5 does not start before $1K MRR. v2.0 does not start before $5K MRR.
6. **No premature optimization.** Don't refactor working code unless it's causing user-facing problems.
7. **Document decisions.** Every major decision goes into `docs/adr/` as an Architecture Decision Record.

---

## Weekly Rhythm (Solo Developer)

```
Monday:    Plan the week. Review last week's bugs. Write 1 ADR if needed.
Tue–Thu:   Build. Code. Ship. No meetings. No social media.
Friday:    Review, test, deploy. Reply to user emails.
Weekend:   Rest. Optional: 1 blog post or 1 marketing asset.
```

---

*Last updated: 2026-06-24*
*This roadmap is reviewed and updated every 4 weeks based on actual user feedback and revenue metrics.*
