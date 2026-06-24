# DemoFlow — Database Schema Proposal

> **Version:** 1.1.0
> **Status:** Living Document
> **Database:** PostgreSQL 16
> **ORM:** Prisma
> **Strategy:** Multi-tenant (shared database, workspace-scoped isolation)
> **Last updated:** 2026-06-24

---

## ⚠️ MVP vs Full Schema

This document describes the **complete target schema** (v2.0 destination).

For the **MVP (Weeks 1–8)**, only 9 tables are required. See the table below.

| Table | MVP | v1.0 | v1.5 | v2.0 |
|---|:---:|:---:|:---:|:---:|
| `users` | ✅ | ✅ | ✅ | ✅ |
| `workspaces` | ✅ | ✅ | ✅ | ✅ |
| `projects` | ✅ | ✅ | ✅ | ✅ |
| `scenes` | ✅ | ✅ | ✅ | ✅ |
| `media_assets` | ✅ | ✅ | ✅ | ✅ |
| `ai_analyses` | ✅ | ✅ | ✅ | ✅ |
| `export_jobs` | ✅ | ✅ | ✅ | ✅ |
| `subscriptions` | ✅ | ✅ | ✅ | ✅ |
| `project_shares` | ✅ | ✅ | ✅ | ✅ |
| `workspace_members` | ❌ | ✅ | ✅ | ✅ |
| `refresh_tokens` | ❌ | ✅ | ✅ | ✅ |
| `magic_links` | ❌ | ❌ | ✅ | ✅ |
| `media_asset_tags` | ❌ | ❌ | ✅ | ✅ |
| `ai_jobs` | ❌ | ❌ | ✅ | ✅ |
| `templates` | ❌ | ✅ | ✅ | ✅ |
| `template_categories` | ❌ | ❌ | ❌ | ✅ |
| `plan_limits` | ❌ | ❌ | ✅ | ✅ |
| `usage_records` | ❌ | ❌ | ✅ | ✅ |
| `share_analytics` | ❌ | ❌ | ✅ | ✅ |
| `audit_logs` | ❌ | ❌ | ❌ | ✅ |
| `system_events` | ❌ | ❌ | ❌ | ✅ |

### MVP Simplifications vs Full Schema

| Area | Full Schema | MVP Approach |
|---|---|---|
| Auth tokens | `refresh_tokens` table | httpOnly cookie + simple DB column `refresh_token_hash` on `users` |
| Magic links | `magic_links` table | Not needed — password reset only via single-use token on `users` |
| AI jobs | Separate `ai_jobs` queue table | Inline status on `ai_analyses.status` column |
| Plan limits | `plan_limits` table (flexible) | Hardcoded in NestJS config (`FREE_LIMITS`, `PRO_LIMITS` constants) |
| Usage records | `usage_records` table | Computed on-demand: `COUNT(export_jobs)` per month |
| Share analytics | `share_analytics` table | Single `view_count INTEGER` column on `project_shares` |
| Media tags | `media_asset_tags` table | Not needed at MVP scale |
| RLS policies | Full PostgreSQL RLS | `workspace_id` WHERE clause on every query (application-layer enforcement) |
| Templates | `templates` + `template_categories` | 3 hardcoded constants in application code |

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Multi-Tenancy Model](#2-multi-tenancy-model)
3. [Entity Overview](#3-entity-overview)
4. [Schema — Users & Access](#4-schema--users--access)
   - 4.1 [users](#41-users)
   - 4.2 [workspaces](#42-workspaces)
   - 4.3 [workspace_members](#43-workspace_members)
   - 4.4 [refresh_tokens](#44-refresh_tokens)
   - 4.5 [magic_links](#45-magic_links)
5. [Schema — Core Product](#5-schema--core-product)
   - 5.1 [projects](#51-projects)
   - 5.2 [scenes](#52-scenes)
   - 5.3 [Layer JSON Structure](#53-layer-json-structure)
6. [Schema — Media](#6-schema--media)
   - 6.1 [media_assets](#61-media_assets)
   - 6.2 [media_asset_tags](#62-media_asset_tags)
7. [Schema — AI](#7-schema--ai)
   - 7.1 [ai_analyses](#71-ai_analyses)
   - 7.2 [ai_jobs](#72-ai_jobs)
8. [Schema — Export](#8-schema--export)
   - 8.1 [export_jobs](#81-export_jobs)
9. [Schema — Templates](#9-schema--templates)
   - 9.1 [templates](#91-templates)
   - 9.2 [template_categories](#92-template_categories)
10. [Schema — Billing](#10-schema--billing)
    - 10.1 [subscriptions](#101-subscriptions)
    - 10.2 [plan_limits](#102-plan_limits)
    - 10.3 [usage_records](#103-usage_records)
11. [Schema — Sharing & Public Access](#11-schema--sharing--public-access)
    - 11.1 [project_shares](#111-project_shares)
    - 11.2 [share_analytics](#112-share_analytics)
12. [Schema — Audit & System](#12-schema--audit--system)
    - 12.1 [audit_logs](#121-audit_logs)
    - 12.2 [system_events](#122-system_events)
13. [Enumerations](#13-enumerations)
14. [JSON Column Schemas](#14-json-column-schemas)
    - 14.1 [ProjectSettings](#141-projectsettings)
    - 14.2 [SceneSettings & Transition](#142-scenesettings--transition)
    - 14.3 [Layer Object](#143-layer-object)
    - 14.4 [Transform2D](#144-transform2d)
    - 14.5 [LayerAnimation](#145-layeranimation)
    - 14.6 [MediaMetadata](#146-mediametadata)
    - 14.7 [AISuggestions](#147-aisuggestions)
    - 14.8 [ExportSettings](#148-exportsettings)
    - 14.9 [TemplateSchema](#149-templateschema)
15. [Indexes](#15-indexes)
16. [Constraints & Integrity Rules](#16-constraints--integrity-rules)
17. [Relationships Diagram](#17-relationships-diagram)
18. [Data Lifecycle & Deletion Policy](#18-data-lifecycle--deletion-policy)
19. [Migration Strategy](#19-migration-strategy)
20. [Scalability Considerations](#20-scalability-considerations)
21. [Seed Data](#21-seed-data)

---

## 1. Design Principles

| Principle | Implementation |
|---|---|
| **Multi-tenant isolation** | Every non-auth table contains `workspace_id` as a scoping key |
| **Soft deletes everywhere** | `deleted_at TIMESTAMPTZ` on all primary resources — never hard-delete user data |
| **UUIDs as primary keys** | `gen_random_uuid()` — no sequential ID leakage via URL enumeration |
| **Timestamps on all tables** | `created_at` and `updated_at` on every table; `updated_at` auto-managed via trigger |
| **JSON for flexible structures** | Layers, settings, AI suggestions, and export config stored as `JSONB` — schema-validated at application layer |
| **Normalized where queried, embedded where not** | Scenes are rows (queried by `project_id`); layers are JSONB (never queried independently) |
| **Audit trail** | `audit_logs` table captures all mutations on sensitive entities |
| **Immutable identifiers** | `share_id` (cuid) for public links — separate from internal UUID |
| **snake_case naming** | PostgreSQL convention; Prisma maps to camelCase for TypeScript |

---

## 2. Multi-Tenancy Model

DemoFlow uses **shared database, workspace-scoped row isolation**.

```
Single Database
└── All workspaces share the same tables
    └── Every row scoped to workspace_id
        └── Application layer enforces: every query MUST include workspace_id filter
            └── Row-Level Security (RLS) enforced in production as secondary safeguard
```

**Why shared database, not schema-per-tenant?**
- MVP simplicity — no schema provisioning on signup
- Single migration path
- Workspace count at MVP scale is manageable
- PostgreSQL Row-Level Security adds defense-in-depth

**PostgreSQL Row-Level Security (RLS) — Production Safeguard:**

```
Every workspace-scoped table has an RLS policy:
  ENABLE ROW LEVEL SECURITY on table
  CREATE POLICY workspace_isolation ON table
    USING (workspace_id = current_setting('app.current_workspace_id')::uuid)
```

The application sets `app.current_workspace_id` at the start of every request via Prisma middleware.

---

## 3. Entity Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      ENTITY MAP                                 │
│                                                                 │
│  IDENTITY & ACCESS            CORE PRODUCT                      │
│  ─────────────────            ────────────                      │
│  users                        projects                          │
│  workspaces                   scenes                            │
│  workspace_members            (layers → embedded JSONB)         │
│  refresh_tokens                                                 │
│  magic_links                  MEDIA                             │
│                               ──────                            │
│  BILLING                      media_assets                      │
│  ───────                      media_asset_tags                  │
│  subscriptions                                                  │
│  plan_limits                  AI                                │
│  usage_records                ──                                │
│                               ai_analyses                       │
│  SHARING                      ai_jobs                           │
│  ───────                                                        │
│  project_shares               EXPORT                            │
│  share_analytics              ──────                            │
│                               export_jobs                       │
│  TEMPLATES                                                      │
│  ─────────                    AUDIT & SYSTEM                    │
│  templates                    ──────────────                    │
│  template_categories          audit_logs                        │
│                               system_events                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Schema — Users & Access

### 4.1 `users`

The central identity record. One user can be a member of multiple workspaces.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `email` | `VARCHAR(320)` | ✗ | — | Unique, lowercase-normalized |
| `name` | `VARCHAR(120)` | ✗ | — | Display name |
| `avatar_url` | `TEXT` | ✓ | `NULL` | CDN URL to avatar image |
| `role` | `user_role` | ✗ | `'member'` | Enum: platform-level role |
| `password_hash` | `TEXT` | ✓ | `NULL` | NULL when using magic link only |
| `email_verified_at` | `TIMESTAMPTZ` | ✓ | `NULL` | NULL = unverified |
| `last_login_at` | `TIMESTAMPTZ` | ✓ | `NULL` | Updated on every login |
| `metadata` | `JSONB` | ✗ | `'{}'` | Extensible: preferences, onboarding state |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | ✗ | `now()` | Auto-updated via trigger |
| `deleted_at` | `TIMESTAMPTZ` | ✓ | `NULL` | Soft delete |

**Constraints:**
- `UNIQUE (email)` — case-insensitive enforced at application layer
- `CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$')` — basic email format
- `CHECK (char_length(name) >= 1)`

**Notes:**
- `role` here is a platform-level role (e.g., `super_admin` for internal staff). Workspace-level roles live in `workspace_members`.
- `password_hash` uses bcrypt with cost factor 12.

---

### 4.2 `workspaces`

The top-level multi-tenant unit. Everything belongs to a workspace.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `name` | `VARCHAR(100)` | ✗ | — | Display name |
| `slug` | `VARCHAR(63)` | ✗ | — | Unique URL-safe identifier |
| `owner_id` | `UUID` | ✗ | — | FK → `users.id` |
| `plan` | `workspace_plan` | ✗ | `'free'` | Current active plan |
| `logo_url` | `TEXT` | ✓ | `NULL` | CDN URL |
| `brand_color` | `VARCHAR(7)` | ✓ | `NULL` | Hex color e.g. `#6B5CE7` |
| `storage_used_bytes` | `BIGINT` | ✗ | `0` | Running total, updated on upload/delete |
| `storage_limit_bytes` | `BIGINT` | ✗ | `5368709120` | Default: 5GB, overridden by plan |
| `settings` | `JSONB` | ✗ | `'{}'` | Workspace-level preferences |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `deleted_at` | `TIMESTAMPTZ` | ✓ | `NULL` | Soft delete |

**Constraints:**
- `UNIQUE (slug)` — enforced DB-level
- `UNIQUE (owner_id)` — one personal workspace per user (relaxed for team plans)
- `CHECK (slug ~* '^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$')` — URL-safe slug format
- `CHECK (storage_used_bytes >= 0)`
- `FK owner_id → users(id) ON DELETE RESTRICT`

---

### 4.3 `workspace_members`

Junction table controlling which users have access to which workspaces, and at what role level.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `workspace_id` | `UUID` | ✗ | — | FK → `workspaces.id` |
| `user_id` | `UUID` | ✗ | — | FK → `users.id` |
| `role` | `workspace_member_role` | ✗ | `'member'` | Enum: `owner \| admin \| member \| viewer` |
| `invited_by_id` | `UUID` | ✓ | `NULL` | FK → `users.id` — who invited them |
| `invited_at` | `TIMESTAMPTZ` | ✓ | `NULL` | When invitation was sent |
| `accepted_at` | `TIMESTAMPTZ` | ✓ | `NULL` | NULL = invitation pending |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Constraints:**
- `UNIQUE (workspace_id, user_id)` — one membership record per user/workspace pair
- `FK workspace_id → workspaces(id) ON DELETE CASCADE`
- `FK user_id → users(id) ON DELETE CASCADE`
- `CHECK (accepted_at IS NULL OR accepted_at >= invited_at)`

**Indexes:**
- `INDEX (workspace_id)` — list members of a workspace
- `INDEX (user_id)` — list workspaces a user belongs to

---

### 4.4 `refresh_tokens`

Stores hashed refresh tokens for the rotation-based auth strategy.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `user_id` | `UUID` | ✗ | — | FK → `users.id` |
| `token_hash` | `TEXT` | ✗ | — | bcrypt hash of actual token |
| `family` | `UUID` | ✗ | — | Token family for rotation reuse detection |
| `device_hint` | `VARCHAR(200)` | ✓ | `NULL` | User-Agent snippet for session listing |
| `ip_address` | `INET` | ✓ | `NULL` | IP at issue time |
| `issued_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `expires_at` | `TIMESTAMPTZ` | ✗ | — | `issued_at + 30 days` |
| `revoked_at` | `TIMESTAMPTZ` | ✓ | `NULL` | NULL = still valid |
| `replaced_by_id` | `UUID` | ✓ | `NULL` | FK → self, tracks rotation chain |

**Constraints:**
- `FK user_id → users(id) ON DELETE CASCADE`
- `CHECK (expires_at > issued_at)`

**Indexes:**
- `INDEX (user_id, revoked_at)` — active sessions by user
- `INDEX (expires_at)` — cleanup job on expired tokens
- `UNIQUE (token_hash)` — lookup by hash

**Notes:**
- Reuse of a revoked token within the same `family` triggers full-family revocation (token theft detection)
- A background job purges rows where `expires_at < now() - interval '7 days'`

---

### 4.5 `magic_links`

One-time login tokens sent via email.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `user_id` | `UUID` | ✗ | — | FK → `users.id` |
| `token_hash` | `TEXT` | ✗ | — | bcrypt hash of email token |
| `email` | `VARCHAR(320)` | ✗ | — | Target email at issue time |
| `expires_at` | `TIMESTAMPTZ` | ✗ | — | `issued_at + 15 minutes` |
| `used_at` | `TIMESTAMPTZ` | ✓ | `NULL` | NULL = not yet used |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Constraints:**
- `FK user_id → users(id) ON DELETE CASCADE`
- `CHECK (expires_at > created_at)`

**Notes:** Expired and used rows purged by background job daily.

---

## 5. Schema — Core Product

### 5.1 `projects`

The central organizing entity. Each project is one demo presentation.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `workspace_id` | `UUID` | ✗ | — | FK → `workspaces.id` |
| `created_by_id` | `UUID` | ✗ | — | FK → `users.id` |
| `title` | `VARCHAR(200)` | ✗ | — | |
| `description` | `TEXT` | ✓ | `NULL` | |
| `type` | `project_type` | ✗ | `'feature_announcement'` | Enum |
| `status` | `project_status` | ✗ | `'draft'` | Enum |
| `thumbnail_url` | `TEXT` | ✓ | `NULL` | Auto-generated from first scene |
| `share_id` | `VARCHAR(26)` | ✗ | `gen_cuid()` | Public share identifier (cuid) |
| `template_id` | `UUID` | ✓ | `NULL` | FK → `templates.id` — origin template |
| `settings` | `JSONB` | ✗ | `'{}'` | See ProjectSettings schema |
| `published_at` | `TIMESTAMPTZ` | ✓ | `NULL` | Set when status → published |
| `archived_at` | `TIMESTAMPTZ` | ✓ | `NULL` | Set when status → archived |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `deleted_at` | `TIMESTAMPTZ` | ✓ | `NULL` | Soft delete |

**Constraints:**
- `UNIQUE (share_id)`
- `FK workspace_id → workspaces(id) ON DELETE CASCADE`
- `FK created_by_id → users(id) ON DELETE RESTRICT`
- `FK template_id → templates(id) ON DELETE SET NULL`
- `CHECK (char_length(title) >= 1)`

**Indexes:**
- `INDEX (workspace_id, status, deleted_at)` — main dashboard query
- `INDEX (workspace_id, created_at DESC)` — recent projects
- `UNIQUE INDEX (share_id)` — public share lookup
- `INDEX (template_id)` — template usage stats

---

### 5.2 `scenes`

Individual slides/steps within a project. Scenes are ordered and contain all layer data as JSONB.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `project_id` | `UUID` | ✗ | — | FK → `projects.id` |
| `workspace_id` | `UUID` | ✗ | — | FK → `workspaces.id` — denormalized for RLS |
| `order_index` | `INTEGER` | ✗ | — | 0-based ordering within project |
| `title` | `VARCHAR(200)` | ✓ | `NULL` | Optional scene title |
| `duration_ms` | `INTEGER` | ✗ | `3000` | Default 3 seconds |
| `layers` | `JSONB` | ✗ | `'[]'` | Array of Layer objects |
| `transition` | `JSONB` | ✗ | `'{}'` | Transition to next scene |
| `settings` | `JSONB` | ✗ | `'{}'` | Background color, aspect ratio override |
| `thumbnail_url` | `TEXT` | ✓ | `NULL` | Generated snapshot |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Constraints:**
- `FK project_id → projects(id) ON DELETE CASCADE`
- `FK workspace_id → workspaces(id) ON DELETE CASCADE`
- `CHECK (duration_ms >= 100 AND duration_ms <= 120000)` — 100ms to 2 minutes
- `CHECK (order_index >= 0)`

**Indexes:**
- `INDEX (project_id, order_index)` — ordered scene list fetch
- `INDEX (workspace_id)` — RLS enforcement

**Why `workspace_id` is denormalized here:**
Avoids an extra join on every scene query for RLS enforcement and workspacescoped media reference validation.

---

### 5.3 Layer JSON Structure

Layers are stored inside `scenes.layers` as a JSONB array. They are never queried, filtered, or joined individually — they are always read and written as part of the owning scene.

```
scenes.layers: Layer[]

Layer {
  id:          string  (local UUID, unique within scene)
  type:        LayerType enum value
  name:        string  (display name in layer panel)
  zIndex:      number  (render order, higher = on top)
  visible:     boolean
  locked:      boolean
  startMs:     number? (null = scene start)
  endMs:       number? (null = scene end)
  transform:   Transform2D
  animation:   LayerAnimation
  content:     LayerContent (union type, varies by layer type)
}
```

Full JSON schemas defined in [Section 14](#14-json-column-schemas).

---

## 6. Schema — Media

### 6.1 `media_assets`

All uploaded files: screenshots, screen recordings, images, and videos.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `workspace_id` | `UUID` | ✗ | — | FK → `workspaces.id` |
| `uploaded_by_id` | `UUID` | ✗ | — | FK → `users.id` |
| `type` | `media_type` | ✗ | — | Enum |
| `filename` | `TEXT` | ✗ | — | Stored filename (UUID-based, no spaces) |
| `original_name` | `VARCHAR(500)` | ✗ | — | Original upload filename |
| `mime_type` | `VARCHAR(100)` | ✗ | — | e.g., `image/png`, `video/mp4` |
| `url` | `TEXT` | ✗ | — | CDN URL |
| `thumbnail_url` | `TEXT` | ✓ | `NULL` | Generated thumbnail CDN URL |
| `storage_path` | `TEXT` | ✗ | — | Internal S3 key, not exposed to client |
| `file_size_bytes` | `BIGINT` | ✗ | — | |
| `width` | `INTEGER` | ✓ | `NULL` | Pixels — images and videos |
| `height` | `INTEGER` | ✓ | `NULL` | Pixels |
| `duration_ms` | `INTEGER` | ✓ | `NULL` | Video/GIF duration |
| `frame_rate` | `NUMERIC(5,2)` | ✓ | `NULL` | Video frame rate |
| `color_space` | `VARCHAR(20)` | ✓ | `NULL` | e.g., `srgb`, `p3` |
| `metadata` | `JSONB` | ✗ | `'{}'` | EXIF, codec info, extracted frame count |
| `processing_status` | `media_processing_status` | ✗ | `'pending'` | Thumbnail + metadata extraction status |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `deleted_at` | `TIMESTAMPTZ` | ✓ | `NULL` | Soft delete + trigger workspace storage counter |

**Constraints:**
- `FK workspace_id → workspaces(id) ON DELETE CASCADE`
- `FK uploaded_by_id → users(id) ON DELETE RESTRICT`
- `CHECK (file_size_bytes > 0)`
- `CHECK (width IS NULL OR width > 0)`
- `CHECK (height IS NULL OR height > 0)`
- `CHECK (duration_ms IS NULL OR duration_ms > 0)`

**Indexes:**
- `INDEX (workspace_id, type, deleted_at)` — media library grid
- `INDEX (workspace_id, created_at DESC)` — recent uploads
- `INDEX (uploaded_by_id)` — user's uploads
- `INDEX (processing_status)` — processing queue monitoring

**Storage Accounting Trigger:**
On `INSERT` → increment `workspaces.storage_used_bytes`  
On soft `DELETE` (set `deleted_at`) → decrement `workspaces.storage_used_bytes`

---

### 6.2 `media_asset_tags`

User-defined tags for organizing the media library.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `media_asset_id` | `UUID` | ✗ | — | FK → `media_assets.id` |
| `tag` | `VARCHAR(50)` | ✗ | — | Lowercase, alphanumeric + hyphens |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Constraints:**
- `PK (media_asset_id, tag)`
- `FK media_asset_id → media_assets(id) ON DELETE CASCADE`
- `CHECK (tag ~* '^[a-z0-9][a-z0-9-]{0,48}[a-z0-9]?$')`

**Index:**
- `INDEX (media_asset_id)` — tags for a given asset

---

## 7. Schema — AI

### 7.1 `ai_analyses`

The result of an AI visual analysis of a media asset. One-to-one with `media_assets`.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `media_asset_id` | `UUID` | ✗ | — | FK → `media_assets.id` — UNIQUE |
| `workspace_id` | `UUID` | ✗ | — | Denormalized for RLS |
| `provider` | `VARCHAR(50)` | ✗ | — | e.g., `ollama`, `openai` |
| `model` | `VARCHAR(100)` | ✗ | — | e.g., `qwen2.5-vl:7b` |
| `status` | `ai_job_status` | ✗ | `'queued'` | Enum |
| `prompt_version` | `VARCHAR(20)` | ✗ | — | Prompt template version for reproducibility |
| `suggestions` | `JSONB` | ✓ | `NULL` | AISuggestions object — populated on completion |
| `confidence` | `NUMERIC(4,3)` | ✓ | `NULL` | 0.000 – 1.000 overall confidence |
| `processing_ms` | `INTEGER` | ✓ | `NULL` | Inference time |
| `error_message` | `TEXT` | ✓ | `NULL` | Set on failure |
| `retry_count` | `SMALLINT` | ✗ | `0` | Number of retries attempted |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `completed_at` | `TIMESTAMPTZ` | ✓ | `NULL` | |

**Constraints:**
- `UNIQUE (media_asset_id)` — one analysis result per asset (re-analyze replaces)
- `FK media_asset_id → media_assets(id) ON DELETE CASCADE`
- `FK workspace_id → workspaces(id) ON DELETE CASCADE`
- `CHECK (retry_count >= 0 AND retry_count <= 10)`
- `CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1))`

**Indexes:**
- `UNIQUE INDEX (media_asset_id)`
- `INDEX (workspace_id, status)` — pending analyses per workspace
- `INDEX (status, created_at)` — queue management

---

### 7.2 `ai_jobs`

BullMQ job tracking table — provides server-side visibility into the AI queue beyond what Redis holds.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `workspace_id` | `UUID` | ✗ | — | FK → `workspaces.id` |
| `queue_job_id` | `VARCHAR(100)` | ✓ | `NULL` | BullMQ job ID for correlation |
| `type` | `ai_job_type` | ✗ | — | Enum: `image_analysis \| copy_generation \| step_suggestion` |
| `reference_id` | `UUID` | ✓ | `NULL` | media_asset_id, scene_id — depends on type |
| `status` | `ai_job_status` | ✗ | `'queued'` | |
| `started_at` | `TIMESTAMPTZ` | ✓ | `NULL` | |
| `completed_at` | `TIMESTAMPTZ` | ✓ | `NULL` | |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Indexes:**
- `INDEX (workspace_id, status)` — active jobs per workspace
- `INDEX (queue_job_id)` — BullMQ correlation
- `INDEX (reference_id)` — jobs for a specific asset/scene

---

## 8. Schema — Export

### 8.1 `export_jobs`

Tracks every export request from queue to download.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `project_id` | `UUID` | ✗ | — | FK → `projects.id` |
| `workspace_id` | `UUID` | ✗ | — | Denormalized for RLS |
| `requested_by_id` | `UUID` | ✗ | — | FK → `users.id` |
| `format` | `export_format` | ✗ | — | Enum: `mp4 \| gif \| web_html \| web_embed` |
| `status` | `export_status` | ✗ | `'queued'` | Enum |
| `priority` | `SMALLINT` | ✗ | `4` | 1 (highest) → 4 (lowest), driven by plan |
| `settings` | `JSONB` | ✗ | `'{}'` | Resolution, fps, quality, audio |
| `queue_job_id` | `VARCHAR(100)` | ✓ | `NULL` | BullMQ job ID |
| `progress_percent` | `SMALLINT` | ✗ | `0` | 0–100 |
| `current_phase` | `VARCHAR(50)` | ✓ | `NULL` | `rendering \| encoding \| uploading` |
| `output_url` | `TEXT` | ✓ | `NULL` | CDN URL of completed export |
| `output_storage_path` | `TEXT` | ✓ | `NULL` | Internal S3 key |
| `file_size_bytes` | `BIGINT` | ✓ | `NULL` | Final output size |
| `duration_ms` | `INTEGER` | ✓ | `NULL` | Rendered video duration |
| `error_message` | `TEXT` | ✓ | `NULL` | Set on failure |
| `retry_count` | `SMALLINT` | ✗ | `0` | |
| `expires_at` | `TIMESTAMPTZ` | ✓ | `NULL` | When S3 object expires (nullable = permanent) |
| `started_at` | `TIMESTAMPTZ` | ✓ | `NULL` | |
| `completed_at` | `TIMESTAMPTZ` | ✓ | `NULL` | |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Constraints:**
- `FK project_id → projects(id) ON DELETE CASCADE`
- `FK workspace_id → workspaces(id) ON DELETE CASCADE`
- `FK requested_by_id → users(id) ON DELETE RESTRICT`
- `CHECK (progress_percent >= 0 AND progress_percent <= 100)`
- `CHECK (priority BETWEEN 1 AND 4)`
- `CHECK (retry_count >= 0)`

**Indexes:**
- `INDEX (project_id, created_at DESC)` — project export history
- `INDEX (workspace_id, status)` — workspace job monitoring
- `INDEX (status, priority, created_at)` — queue worker pickup order
- `INDEX (queue_job_id)` — BullMQ correlation
- `INDEX (expires_at)` — cleanup job

---

## 9. Schema — Templates

### 9.1 `templates`

Pre-built project skeletons available to all users.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `category_id` | `UUID` | ✗ | — | FK → `template_categories.id` |
| `name` | `VARCHAR(100)` | ✗ | — | |
| `description` | `TEXT` | ✓ | `NULL` | |
| `preview_url` | `TEXT` | ✗ | — | Static preview image |
| `preview_video_url` | `TEXT` | ✓ | `NULL` | Short preview clip |
| `schema` | `JSONB` | ✗ | — | Full project scaffold — scenes, layers, settings |
| `tags` | `TEXT[]` | ✗ | `'{}'` | Searchable tag array |
| `is_premium` | `BOOLEAN` | ✗ | `false` | Requires paid plan |
| `is_published` | `BOOLEAN` | ✗ | `false` | Visible to users |
| `sort_order` | `SMALLINT` | ✗ | `0` | Manual editorial ordering |
| `usage_count` | `INTEGER` | ✗ | `0` | Incremented when used |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Constraints:**
- `FK category_id → template_categories(id) ON DELETE RESTRICT`
- `CHECK (usage_count >= 0)`

**Indexes:**
- `INDEX (category_id, is_published)` — gallery by category
- `INDEX (is_published, sort_order)` — ordered gallery
- `INDEX USING GIN (tags)` — tag search
- `INDEX (usage_count DESC)` — popularity sorting

---

### 9.2 `template_categories`

Organizational categories for the template gallery.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `name` | `VARCHAR(60)` | ✗ | — | Display name |
| `slug` | `VARCHAR(60)` | ✗ | — | URL-safe identifier |
| `description` | `TEXT` | ✓ | `NULL` | |
| `icon` | `VARCHAR(50)` | ✓ | `NULL` | Icon name |
| `sort_order` | `SMALLINT` | ✗ | `0` | |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Constraints:**
- `UNIQUE (slug)`

---

## 10. Schema — Billing

### 10.1 `subscriptions`

Stripe subscription state mirrored into the DB for fast plan enforcement.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `workspace_id` | `UUID` | ✗ | — | FK → `workspaces.id` — UNIQUE |
| `stripe_customer_id` | `VARCHAR(50)` | ✗ | — | Stripe `cus_*` ID |
| `stripe_subscription_id` | `VARCHAR(50)` | ✓ | `NULL` | Stripe `sub_*` ID — NULL = free plan |
| `stripe_price_id` | `VARCHAR(50)` | ✓ | `NULL` | Current active price |
| `plan` | `workspace_plan` | ✗ | `'free'` | Mirrors `workspaces.plan` (kept in sync) |
| `status` | `subscription_status` | ✗ | `'active'` | Enum |
| `trial_ends_at` | `TIMESTAMPTZ` | ✓ | `NULL` | NULL = no trial |
| `current_period_start` | `TIMESTAMPTZ` | ✓ | `NULL` | |
| `current_period_end` | `TIMESTAMPTZ` | ✓ | `NULL` | |
| `cancel_at` | `TIMESTAMPTZ` | ✓ | `NULL` | Scheduled cancellation |
| `canceled_at` | `TIMESTAMPTZ` | ✓ | `NULL` | Actual cancellation |
| `payment_method_last4` | `VARCHAR(4)` | ✓ | `NULL` | For UI display only |
| `payment_method_brand` | `VARCHAR(20)` | ✓ | `NULL` | `visa`, `mastercard`, etc. |
| `metadata` | `JSONB` | ✗ | `'{}'` | Raw Stripe event payload cache |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Constraints:**
- `UNIQUE (workspace_id)` — one subscription per workspace
- `UNIQUE (stripe_customer_id)`
- `UNIQUE (stripe_subscription_id)` where NOT NULL
- `FK workspace_id → workspaces(id) ON DELETE CASCADE`

**Sync strategy:** Updated by Stripe webhook handler on every relevant event (`invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`).

---

### 10.2 `plan_limits`

Defines the resource limits for each plan level. Stored in DB (not code constants) for runtime flexibility.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `plan` | `workspace_plan` | ✗ | — | UNIQUE |
| `max_projects` | `INTEGER` | ✓ | `NULL` | NULL = unlimited |
| `max_storage_bytes` | `BIGINT` | ✓ | `NULL` | NULL = unlimited |
| `max_exports_per_month` | `INTEGER` | ✓ | `NULL` | NULL = unlimited |
| `max_ai_analyses_per_month` | `INTEGER` | ✓ | `NULL` | NULL = unlimited |
| `max_members` | `INTEGER` | ✓ | `NULL` | NULL = unlimited |
| `max_resolution_px` | `INTEGER` | ✗ | `1920` | Max export width |
| `max_scene_count` | `INTEGER` | ✓ | `NULL` | Per project |
| `can_export_gif` | `BOOLEAN` | ✗ | `false` | |
| `can_export_web` | `BOOLEAN` | ✗ | `false` | |
| `can_remove_watermark` | `BOOLEAN` | ✗ | `false` | |
| `can_use_custom_domain` | `BOOLEAN` | ✗ | `false` | |
| `can_access_templates_premium` | `BOOLEAN` | ✗ | `false` | |
| `export_expiry_days` | `INTEGER` | ✗ | `7` | How long export files are kept |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Seed data (initial values):**

| Limit | FREE | PRO | TEAM | ENTERPRISE |
|---|---|---|---|---|
| `max_projects` | 3 | NULL | NULL | NULL |
| `max_storage_bytes` | 5 GB | 50 GB | 200 GB | NULL |
| `max_exports_per_month` | 5 | NULL | NULL | NULL |
| `max_ai_analyses_per_month` | 20 | 500 | NULL | NULL |
| `max_members` | 1 | 3 | 15 | NULL |
| `max_resolution_px` | 1280 | 1920 | 2560 | 3840 |
| `can_export_gif` | ✗ | ✓ | ✓ | ✓ |
| `can_export_web` | ✗ | ✓ | ✓ | ✓ |
| `can_remove_watermark` | ✗ | ✓ | ✓ | ✓ |
| `export_expiry_days` | 7 | 30 | 90 | 365 |

---

### 10.3 `usage_records`

Monthly usage tracking for plan enforcement and overage billing (future).

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `workspace_id` | `UUID` | ✗ | — | FK → `workspaces.id` |
| `period_start` | `DATE` | ✗ | — | First day of billing month |
| `period_end` | `DATE` | ✗ | — | Last day of billing month |
| `exports_count` | `INTEGER` | ✗ | `0` | |
| `ai_analyses_count` | `INTEGER` | ✗ | `0` | |
| `storage_peak_bytes` | `BIGINT` | ✗ | `0` | Peak storage in period |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Constraints:**
- `UNIQUE (workspace_id, period_start)` — one record per billing period
- `FK workspace_id → workspaces(id) ON DELETE CASCADE`

**Notes:** Incremented atomically using `UPDATE ... SET exports_count = exports_count + 1` within transactions.

---

## 11. Schema — Sharing & Public Access

### 11.1 `project_shares`

Configures the public sharing settings for a project.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `project_id` | `UUID` | ✗ | — | FK → `projects.id` — UNIQUE |
| `workspace_id` | `UUID` | ✗ | — | Denormalized |
| `is_public` | `BOOLEAN` | ✗ | `false` | Controls whether share link works |
| `password_hash` | `TEXT` | ✓ | `NULL` | Optional password protection |
| `allow_download` | `BOOLEAN` | ✗ | `false` | Show download button in player |
| `show_branding` | `BOOLEAN` | ✗ | `true` | DemoFlow watermark |
| `custom_cta_text` | `VARCHAR(100)` | ✓ | `NULL` | Custom button text |
| `custom_cta_url` | `TEXT` | ✓ | `NULL` | Custom CTA link |
| `expires_at` | `TIMESTAMPTZ` | ✓ | `NULL` | NULL = never expires |
| `view_count` | `INTEGER` | ✗ | `0` | Running total |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Constraints:**
- `UNIQUE (project_id)`
- `FK project_id → projects(id) ON DELETE CASCADE`

---

### 11.2 `share_analytics`

Lightweight view tracking for public share links.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `project_share_id` | `UUID` | ✗ | — | FK → `project_shares.id` |
| `workspace_id` | `UUID` | ✗ | — | Denormalized |
| `session_id` | `VARCHAR(36)` | ✗ | — | Client-generated session UUID |
| `ip_hash` | `VARCHAR(64)` | ✓ | `NULL` | SHA-256 of IP (privacy-preserving) |
| `country_code` | `CHAR(2)` | ✓ | `NULL` | ISO 3166-1 alpha-2 |
| `referrer` | `TEXT` | ✓ | `NULL` | HTTP Referer header |
| `user_agent_hint` | `VARCHAR(200)` | ✓ | `NULL` | Truncated UA string |
| `completed` | `BOOLEAN` | ✗ | `false` | Did viewer watch to the end |
| `last_scene_index` | `SMALLINT` | ✓ | `NULL` | Furthest scene reached |
| `watch_duration_ms` | `INTEGER` | ✓ | `NULL` | Total active watch time |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Constraints:**
- `FK project_share_id → project_shares(id) ON DELETE CASCADE`

**Indexes:**
- `INDEX (project_share_id, created_at DESC)` — analytics timeline
- `INDEX (workspace_id, created_at DESC)` — workspace-level analytics

**Notes:** No PII stored — IP is hashed. Rows older than 2 years are archived/purged.

---

## 12. Schema — Audit & System

### 12.1 `audit_logs`

Immutable record of all mutations on sensitive entities.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `workspace_id` | `UUID` | ✓ | `NULL` | NULL for platform-level events |
| `actor_id` | `UUID` | ✓ | `NULL` | FK → `users.id` — NULL for system |
| `actor_type` | `VARCHAR(20)` | ✗ | `'user'` | `user \| system \| webhook` |
| `action` | `VARCHAR(100)` | ✗ | — | e.g., `project.delete`, `member.invite` |
| `entity_type` | `VARCHAR(50)` | ✗ | — | e.g., `project`, `workspace` |
| `entity_id` | `UUID` | ✓ | `NULL` | ID of the affected entity |
| `before` | `JSONB` | ✓ | `NULL` | State before mutation (key fields only) |
| `after` | `JSONB` | ✓ | `NULL` | State after mutation |
| `ip_address` | `INET` | ✓ | `NULL` | |
| `user_agent` | `TEXT` | ✓ | `NULL` | |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | Immutable — no `updated_at` |

**Constraints:**
- No foreign key on `entity_id` — entity may be soft-deleted; audit log must survive
- No UPDATE or DELETE ever issued on this table (enforced via GRANT)

**Indexes:**
- `INDEX (workspace_id, created_at DESC)` — workspace audit feed
- `INDEX (entity_type, entity_id, created_at DESC)` — entity change history
- `INDEX (actor_id, created_at DESC)` — user activity history

---

### 12.2 `system_events`

Internal system events: job completions, webhook receipts, health check results.

| Column | Type | Nullable | Default | Notes |
|---|---|:---:|---|---|
| `id` | `UUID` | ✗ | `gen_random_uuid()` | PK |
| `type` | `VARCHAR(100)` | ✗ | — | e.g., `export.completed`, `stripe.webhook` |
| `payload` | `JSONB` | ✗ | — | Event payload |
| `severity` | `VARCHAR(10)` | ✗ | `'info'` | `debug \| info \| warn \| error` |
| `created_at` | `TIMESTAMPTZ` | ✗ | `now()` | |

**Notes:** Retained for 30 days; older rows purged by scheduled job.

---

## 13. Enumerations

All enums defined as PostgreSQL `ENUM` types.

```
TYPE user_role AS ENUM (
  'super_admin',          -- Platform staff, bypasses all workspace restrictions
  'member'                -- Default platform-level role
)

TYPE workspace_member_role AS ENUM (
  'owner',                -- Full control, billing, delete workspace
  'admin',                -- Manage members, full project/media access
  'member',               -- Create/edit own projects and media
  'viewer'                -- Read-only access to published content
)

TYPE workspace_plan AS ENUM (
  'free',
  'pro',
  'team',
  'enterprise'
)

TYPE project_type AS ENUM (
  'feature_announcement',
  'onboarding_tutorial',
  'changelog',
  'product_showcase',
  'walkthrough',
  'custom'
)

TYPE project_status AS ENUM (
  'draft',
  'published',
  'archived'
)

TYPE media_type AS ENUM (
  'screenshot',
  'screen_recording',
  'image',
  'video',
  'gif'
)

TYPE media_processing_status AS ENUM (
  'pending',
  'processing',
  'ready',
  'failed'
)

TYPE layer_type AS ENUM (
  'media',                -- Image or video layer
  'text',                 -- Text box
  'shape',                -- Rectangle, circle, line
  'arrow',                -- Directional arrow
  'hotspot',              -- Clickable region (web export)
  'zoom_area',            -- Zoom lens effect
  'blur',                 -- Blur region (redaction)
  'callout',              -- Speech bubble / tooltip
  'cursor'                -- Animated cursor
)

TYPE ai_job_status AS ENUM (
  'queued',
  'processing',
  'completed',
  'failed',
  'cancelled'
)

TYPE ai_job_type AS ENUM (
  'image_analysis',
  'copy_generation',
  'step_suggestion'
)

TYPE export_format AS ENUM (
  'mp4',
  'gif',
  'web_html',
  'web_embed'
)

TYPE export_status AS ENUM (
  'queued',
  'processing',
  'completed',
  'failed',
  'cancelled',
  'expired'
)

TYPE subscription_status AS ENUM (
  'trialing',
  'active',
  'past_due',
  'canceled',
  'incomplete',
  'unpaid'
)
```

---

## 14. JSON Column Schemas

### 14.1 `ProjectSettings`

Stored in `projects.settings`.

```
ProjectSettings {
  aspectRatio:         '16:9' | '4:3' | '1:1' | '9:16'
  defaultDurationMs:   number      -- Default scene duration
  defaultTransition:   string      -- Default transition type
  backgroundColor:     string      -- Hex color
  fontFamily:          string      -- From approved list
  accentColor:         string      -- Brand accent color
  showProgressBar:     boolean
  autoPlay:            boolean
  loopPlayback:        boolean
  watermark: {
    enabled:           boolean
    position:          'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  }
}
```

---

### 14.2 `SceneSettings` & `Transition`

Stored in `scenes.settings` and `scenes.transition`.

```
SceneSettings {
  backgroundColor:     string      -- Overrides project default
  backgroundImageUrl:  string?
  backgroundBlur:      number      -- 0–20px
  aspectRatio:         string?     -- Overrides project default
  padding:             number      -- Canvas padding in px
}

Transition {
  type:      'none' | 'fade' | 'slide-left' | 'slide-right' |
             'slide-up' | 'slide-down' | 'zoom-in' | 'zoom-out' |
             'dissolve' | 'wipe'
  durationMs: number              -- 0–1000ms
  easing:    'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
}
```

---

### 14.3 `Layer Object`

One element of the `scenes.layers` array.

```
Layer {
  id:          string              -- UUID, unique within scene
  type:        LayerType
  name:        string
  visible:     boolean
  locked:      boolean
  zIndex:      number              -- Integer, 0 = bottom
  startMs:     number | null       -- null = scene start
  endMs:       number | null       -- null = scene end
  transform:   Transform2D
  animation:   LayerAnimation
  content:     MediaContent
             | TextContent
             | ShapeContent
             | ArrowContent
             | HotspotContent
             | ZoomAreaContent
             | BlurContent
             | CalloutContent
             | CursorContent
}
```

---

### 14.4 `Transform2D`

```
Transform2D {
  x:           number     -- Position from left (% of canvas width, 0–100)
  y:           number     -- Position from top  (% of canvas height, 0–100)
  width:       number     -- % of canvas width
  height:      number     -- % of canvas height
  rotation:    number     -- Degrees, 0–360
  opacity:     number     -- 0.0–1.0
  scaleX:      number     -- 1.0 = original
  scaleY:      number     -- 1.0 = original
  flipX:       boolean
  flipY:       boolean
}
```

---

### 14.5 `LayerAnimation`

```
LayerAnimation {
  in: {
    type:      'none' | 'fade-in' | 'slide-in' | 'scale-in' | 'bounce-in'
    durationMs: number
    delayMs:   number
    easing:    string
  }
  out: {
    type:      'none' | 'fade-out' | 'slide-out' | 'scale-out'
    durationMs: number
    delayMs:   number
    easing:    string
  }
  loop: {
    enabled:   boolean
    type:      'pulse' | 'shake' | 'bounce' | 'spin'
    durationMs: number
  } | null
}
```

---

### 14.6 `MediaMetadata`

Stored in `media_assets.metadata`.

```
MediaMetadata {
  -- For images:
  exif: {
    make:         string?
    model:        string?
    capturedAt:   string?   (ISO 8601)
  }?

  -- For videos:
  codec:          string?   (e.g., 'h264', 'hevc')
  bitrate:        number?   (bps)
  audioCodec:     string?
  audioChannels:  number?
  extractedFrames: number?  (for recordings, key frames extracted for AI)

  -- Generated by processing:
  dominantColors: string[]  (top 5 hex colors, for auto-theming)
  hasTransparency: boolean
  isAnimated:     boolean
}
```

---

### 14.7 `AISuggestions`

Stored in `ai_analyses.suggestions`.

```
AISuggestions {
  confidence:          number              -- 0.0–1.0
  title:               string
  description:         string
  suggestedDurationMs: number
  tags:                string[]
  accessibility:       string[]            -- Alt text, contrast warnings

  steps: [
    {
      index:           number
      title:           string
      description:     string
      durationMs:      number
      zoomArea: {
        x:             number              -- Normalized 0–1
        y:             number
        width:         number
        height:        number
      } | null
      highlightAreas: [
        {
          area:        BoundingBox         -- Normalized 0–1
          label:       string
          style:       'circle' | 'rectangle' | 'arrow' | 'pulse'
        }
      ]
      callout:         string | null
      cursorPosition: { x: number, y: number } | null
    }
  ]
}
```

---

### 14.8 `ExportSettings`

Stored in `export_jobs.settings`.

```
ExportSettings {
  -- Video (MP4 / GIF)
  resolution: {
    width:     number     -- e.g., 1920
    height:    number     -- e.g., 1080
  }
  fps:         number     -- 24 | 30 | 60
  quality:     'draft' | 'standard' | 'high' | 'lossless'

  -- MP4 specific
  crf:         number     -- 0–51, lower = better quality
  preset:      'ultrafast' | 'fast' | 'medium' | 'slow'
  audio: {
    enabled:   boolean
    trackUrl:  string?    -- Background music URL
    volume:    number     -- 0.0–1.0
    fadeOut:   boolean
  }

  -- GIF specific
  maxWidth:    number     -- px, default 800
  fps:         number     -- max 15 for GIF

  -- Web HTML specific
  includeControls: boolean
  autoPlay:        boolean
  loop:            boolean
  embedWidth:      number?
}
```

---

### 14.9 `TemplateSchema`

Stored in `templates.schema`. Defines the full project scaffold that gets copied on template use.

```
TemplateSchema {
  settings:    ProjectSettings    -- Default project settings

  scenes: [
    {
      orderIndex:   number
      title:        string?
      durationMs:   number
      transition:   Transition
      settings:     SceneSettings
      layers:       Layer[]       -- Placeholder layers with sample content
    }
  ]

  placeholders: [
    {
      layerId:      string        -- References a Layer.id in scenes above
      type:         'media' | 'text'
      hint:         string        -- UI hint: "Upload your app screenshot here"
      required:     boolean
    }
  ]
}
```

---

## 15. Indexes

### Summary of All Non-Trivial Indexes

```
-- users
UNIQUE  users(email)

-- workspaces
UNIQUE  workspaces(slug)
UNIQUE  workspaces(owner_id)

-- workspace_members
UNIQUE  workspace_members(workspace_id, user_id)
INDEX   workspace_members(workspace_id)
INDEX   workspace_members(user_id)

-- refresh_tokens
UNIQUE  refresh_tokens(token_hash)
INDEX   refresh_tokens(user_id, revoked_at) WHERE revoked_at IS NULL
INDEX   refresh_tokens(expires_at)

-- projects
UNIQUE  projects(share_id)
INDEX   projects(workspace_id, status, deleted_at)
INDEX   projects(workspace_id, created_at DESC)
INDEX   projects(template_id)

-- scenes
INDEX   scenes(project_id, order_index)
INDEX   scenes(workspace_id)

-- media_assets
INDEX   media_assets(workspace_id, type, deleted_at)
INDEX   media_assets(workspace_id, created_at DESC)
INDEX   media_assets(uploaded_by_id)
INDEX   media_assets(processing_status) WHERE processing_status != 'ready'

-- ai_analyses
UNIQUE  ai_analyses(media_asset_id)
INDEX   ai_analyses(workspace_id, status)
INDEX   ai_analyses(status, created_at)

-- ai_jobs
INDEX   ai_jobs(workspace_id, status)
INDEX   ai_jobs(queue_job_id)
INDEX   ai_jobs(reference_id)

-- export_jobs
INDEX   export_jobs(project_id, created_at DESC)
INDEX   export_jobs(workspace_id, status)
INDEX   export_jobs(status, priority, created_at)   -- Queue worker pickup
INDEX   export_jobs(queue_job_id)
INDEX   export_jobs(expires_at) WHERE expires_at IS NOT NULL

-- templates
INDEX   templates(category_id, is_published)
INDEX   templates(is_published, sort_order)
INDEX   templates USING GIN (tags)
INDEX   templates(usage_count DESC)

-- subscriptions
UNIQUE  subscriptions(workspace_id)
UNIQUE  subscriptions(stripe_customer_id)
UNIQUE  subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL

-- usage_records
UNIQUE  usage_records(workspace_id, period_start)

-- share_analytics
INDEX   share_analytics(project_share_id, created_at DESC)
INDEX   share_analytics(workspace_id, created_at DESC)

-- audit_logs
INDEX   audit_logs(workspace_id, created_at DESC)
INDEX   audit_logs(entity_type, entity_id, created_at DESC)
INDEX   audit_logs(actor_id, created_at DESC)
```

---

## 16. Constraints & Integrity Rules

### Foreign Key Summary

```
workspace_members.workspace_id  → workspaces.id       ON DELETE CASCADE
workspace_members.user_id       → users.id             ON DELETE CASCADE
workspaces.owner_id             → users.id             ON DELETE RESTRICT

projects.workspace_id           → workspaces.id        ON DELETE CASCADE
projects.created_by_id          → users.id             ON DELETE RESTRICT
projects.template_id            → templates.id         ON DELETE SET NULL

scenes.project_id               → projects.id          ON DELETE CASCADE
scenes.workspace_id             → workspaces.id        ON DELETE CASCADE

media_assets.workspace_id       → workspaces.id        ON DELETE CASCADE
media_assets.uploaded_by_id     → users.id             ON DELETE RESTRICT

ai_analyses.media_asset_id      → media_assets.id      ON DELETE CASCADE
ai_analyses.workspace_id        → workspaces.id        ON DELETE CASCADE

export_jobs.project_id          → projects.id          ON DELETE CASCADE
export_jobs.workspace_id        → workspaces.id        ON DELETE CASCADE
export_jobs.requested_by_id     → users.id             ON DELETE RESTRICT

subscriptions.workspace_id      → workspaces.id        ON DELETE CASCADE

project_shares.project_id       → projects.id          ON DELETE CASCADE
share_analytics.project_share_id→ project_shares.id    ON DELETE CASCADE
```

### `updated_at` Auto-Update Trigger

Applied to all tables with `updated_at`:

```
FUNCTION trigger_set_updated_at()
  NEW.updated_at = now()
  RETURN NEW

TRIGGER set_updated_at
  BEFORE UPDATE ON <each table>
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at()
```

### Storage Accounting Trigger

```
FUNCTION trigger_update_workspace_storage()
  ON INSERT to media_assets:
    UPDATE workspaces SET storage_used_bytes = storage_used_bytes + NEW.file_size_bytes
    WHERE id = NEW.workspace_id

  ON UPDATE (deleted_at set):
    UPDATE workspaces SET storage_used_bytes = storage_used_bytes - OLD.file_size_bytes
    WHERE id = OLD.workspace_id
```

---

## 17. Relationships Diagram

```
users ──────────────────────────────┐
  │                                 │ owns
  │ member of                       ▼
  ├──────────────► workspaces ──────────────────────────┐
  │                   │                                 │
  │            ┌──────┼──────────────┐                  │
  │            │      │              │                  │
  │            ▼      ▼              ▼                  │
  │        projects  media_assets  subscription         │
  │            │         │                              │
  │            │         └───────► ai_analyses          │
  │            │                                        │
  │            ├──────────────► scenes                  │
  │            │                  └── layers (JSONB)    │
  │            │                                        │
  │            ├──────────────► export_jobs             │
  │            │                                        │
  │            └──────────────► project_shares          │
  │                                  └── share_analytics│
  │                                                     │
  └──────────── workspace_members ◄────────────────────┘
                   (role, invited_by)

templates ──────────────────────────► template_categories
    │
    └─ referenced by projects.template_id

plan_limits ─────────── (keyed by workspace_plan enum)
usage_records ──────────── workspace_id → workspaces
audit_logs ─────────────── workspace_id, actor_id → users
```

---

## 18. Data Lifecycle & Deletion Policy

### Soft Delete Pattern

All primary user-facing entities use soft delete via `deleted_at TIMESTAMPTZ`.

```
Soft-deleted entities:
  users, workspaces, projects, media_assets

Hard-deleted entities (cascaded from parent):
  scenes, layers, workspace_members, refresh_tokens,
  magic_links, ai_analyses, export_jobs, share_analytics

Never deleted:
  audit_logs (immutable — archive to cold storage after 1 year)
```

### Deletion Cascade on Workspace

When a workspace is soft-deleted → background job triggers:

```
1. Soft-delete all workspace projects
2. Soft-delete all workspace media_assets
3. Delete all workspace_members
4. Cancel active Stripe subscription (via API)
5. Mark all running export jobs as CANCELLED
6. Schedule S3 cleanup job (deferred 30 days for recovery window)
7. Write audit_log entry
```

### GDPR Right to Erasure

When a user requests account deletion:

```
1. Anonymize users row: email → deleted_{id}@anon.demoflow.io, name → 'Deleted User'
2. Set users.deleted_at = now()
3. Invalidate all refresh_tokens
4. If user is sole workspace owner → trigger workspace deletion cascade
5. Audit log entry: actor_id = system, action = 'user.erased'
```

### Retention Schedule

| Data | Retention |
|---|---|
| Soft-deleted projects | 30 days then hard-purge |
| Soft-deleted media | 30 days then S3 object delete |
| Export files (FREE) | 7 days |
| Export files (PRO) | 30 days |
| Export files (TEAM) | 90 days |
| Export files (ENTERPRISE) | 365 days |
| Share analytics | 2 years |
| Audit logs | 1 year active DB, 7 years cold archive |
| Expired refresh tokens | 7 days after expiry |
| Expired magic links | 24 hours |
| System events | 30 days |

---

## 19. Migration Strategy

### Tooling

- **Prisma Migrate** for schema migrations (version-controlled, reproducible)
- **Prisma Migrate Deploy** in CI/CD pipeline — never manual SQL in production
- All migrations in `prisma/migrations/` directory, named with timestamp prefix

### Migration Rules

1. **Additive-only in production** — never rename or drop a column without a multi-step migration
2. **Backward compatible** — new columns must have a `DEFAULT` or be nullable so old code still runs during deploy
3. **Column rename pattern**: Add new column → dual-write in code → migrate data → drop old column in subsequent release
4. **Large table migrations** (>1M rows): use `pg_repack` or `CONCURRENTLY` indexes to avoid table locks
5. **Test migrations against a production-size snapshot** in staging before applying to production

### Migration Deployment Order

```
1. Run: prisma migrate deploy
2. Deploy new API version (supports both old and new schema)
3. Verify health checks
4. Remove dual-write compatibility code in next release
```

---

## 20. Scalability Considerations

### When to Partition

```
share_analytics:
  → Partition by RANGE (created_at) when rows exceed 10M
  → Monthly partitions: share_analytics_2026_01, etc.

audit_logs:
  → Partition by RANGE (created_at) when rows exceed 5M
  → Quarterly partitions

export_jobs:
  → Archive completed jobs older than 6 months to export_jobs_archive
```

### When to Separate Tables

```
If media_assets exceeds 50M rows:
  → Consider sharding by workspace_id prefix ranges
  → Or separate read-replica for media library queries

If ai_analyses becomes a query hotspot:
  → Extract to dedicated analytics microservice + Postgres
```

### Connection Pooling

```
Production: PgBouncer in transaction mode
  Max server connections: 100
  Max client connections: 1000
  Pool size per database: 20

NestJS: Prisma connection pool
  connection_limit: 10 per API instance
```

### Read Replica Usage

```
Route to read replica (via Prisma replica extension):
  - Project listing (dashboard queries)
  - Media library grid
  - Template gallery
  - Share analytics reads
  - Export history

Route to primary:
  - All writes
  - Auth operations
  - Export status reads (consistency required)
```

---

## 21. Seed Data

### Required for App to Function

```
template_categories (5 rows):
  { name: 'Feature Announcement', slug: 'feature' }
  { name: 'Onboarding Tutorial',  slug: 'onboarding' }
  { name: 'Changelog',            slug: 'changelog' }
  { name: 'Product Showcase',     slug: 'showcase' }
  { name: 'Walkthrough',          slug: 'walkthrough' }

plan_limits (4 rows):
  FREE, PRO, TEAM, ENTERPRISE — as defined in Section 10.2

templates (10 rows):
  10 starter templates covering each category
  (imported from template JSON files in /prisma/seeds/templates/)
```

### Development Seed Data

```
users (3):
  admin@demoflow.io    — SUPER_ADMIN
  owner@example.com   — workspace OWNER (for dev workspace)
  member@example.com  — MEMBER (for dev workspace)

workspaces (1):
  Acme Corp — plan: pro

projects (3):
  Feature Announcement demo (5 scenes, published)
  Onboarding Tutorial draft (3 scenes, draft)
  Product Showcase (7 scenes, draft)

media_assets (10):
  Mix of screenshots and short recordings
  All pointing to placeholder CDN assets
```

---

*Last updated: 2026-06-24*  
*Maintained by: DemoFlow Core Team*  
*This is a living document — update when schema changes are approved*
