# DemoFlow — Architecture Reference

> **Version:** 1.0.0  
> **Status:** Living Document  
> **Product:** AI-powered Product Demo & Feature Presentation Builder  
> **Stack:** Angular 20 · NestJS · PostgreSQL · Prisma · Ollama (Qwen VL)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Domain Model](#5-domain-model)
6. [Design System](#6-design-system)
7. [AI Integration Architecture](#7-ai-integration-architecture)
8. [Export Engine Architecture](#8-export-engine-architecture)
9. [Security Architecture](#9-security-architecture)
10. [Scalability Strategy](#10-scalability-strategy)
11. [Testing Strategy](#11-testing-strategy)
12. [Infrastructure & DevOps](#12-infrastructure--devops)
13. [Decision Log](#13-decision-log)

---

## 1. Overview

DemoFlow is a **product demo builder**, not a video editor. The core premise is radical simplicity: a user uploads media, AI analyzes it and suggests content, the user assembles scenes, and the system exports a polished MP4, GIF, or web-embeddable presentation — no timeline scrubbing, no keyframe animation knowledge required.

### System Context

```
┌─────────────────────────────────────────────────────────────────────────┐
│                             DEMOFLOW PLATFORM                           │
│                                                                         │
│  ┌──────────────────────┐      ┌──────────────────────────────────────┐ │
│  │   Angular 20 Client  │      │          NestJS API Gateway          │ │
│  │                      │      │                                      │ │
│  │  · SSR + Hydration   │◄────►│  · REST + WebSocket                  │ │
│  │  · Signals-first     │      │  · JWT Auth + RBAC                   │ │
│  │  · Lazy modules      │      │  · Rate limiting                     │ │
│  │  · Design System     │      │  · OpenAPI / Swagger                 │ │
│  └──────────────────────┘      └──────────┬───────────────────────────┘ │
│                                           │                             │
│                     ┌─────────────────────┼──────────────────────┐      │
│                     │                     │                      │      │
│           ┌─────────▼──────┐   ┌──────────▼──────┐  ┌───────────▼────┐ │
│           │  PostgreSQL 16  │   │   Redis 7        │  │ S3-Compatible  │ │
│           │  + Prisma ORM   │   │   Queue + Cache  │  │ Object Storage │ │
│           └────────────────┘   └─────────────────┘  └───────────────┘  │
│                                                                         │
│  ┌──────────────────────┐      ┌──────────────────────────────────────┐ │
│  │   AI Layer (Local)   │      │         Export Engine                │ │
│  │                      │      │                                      │ │
│  │  · Ollama Runtime    │      │  · BullMQ Workers                    │ │
│  │  · Qwen VL 7B        │      │  · FFmpeg (MP4 / GIF)                │ │
│  │  · MLX (Apple M*)    │      │  · Puppeteer (Frame rendering)       │ │
│  │  · OpenAI (future)   │      │  · HTML Player Builder               │ │
│  └──────────────────────┘      └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Core User Flow

```
Upload Media  →  AI Analysis  →  Scene Assembly  →  Preview  →  Export
     │                │                │               │            │
  Screenshots      Suggestions      Add Layers      Play demo     MP4
  Recordings       Titles           Annotations     in-browser    GIF
  Images           Descriptions     Transitions                   Web
                   Zoom areas       Hotspots
```

---

## 2. Monorepo Structure

The project uses an **Nx-managed monorepo** with clearly separated application packages and shared libraries.

```
demoflow/
│
├── apps/
│   ├── client/                   # Angular 20 SSR application
│   └── api/                      # NestJS backend
│
├── libs/
│   ├── shared/
│   │   ├── types/                # Shared TypeScript interfaces and enums
│   │   ├── dto/                  # Shared DTOs (validated with class-validator)
│   │   ├── constants/            # App-wide constants
│   │   └── utils/                # Pure utility functions (no framework deps)
│   │
│   ├── ui/                       # Standalone Angular UI component library
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   │
│   └── domain/                   # Domain models and value objects
│       ├── project/
│       ├── scene/
│       ├── media/
│       └── ai/
│
├── tools/
│   ├── scripts/                  # Dev scripts (seed, migrate, generate)
│   └── generators/               # Nx custom generators
│
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── services/
│       ├── nginx.conf
│       └── ollama/
│           └── Modelfile
│
├── docs/
│   ├── api/                      # Generated OpenAPI specs
│   ├── adr/                      # Architecture Decision Records
│   └── diagrams/                 # System diagrams
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd-staging.yml
│       └── cd-production.yml
│
├── ARCHITECTURE.md               # This document
├── CONTRIBUTING.md
├── nx.json
├── package.json
└── tsconfig.base.json
```

---

## 3. Frontend Architecture

### 3.1 Angular Project Structure

```
apps/client/src/app/
│
├── core/                               # Singleton layer — provided in root
│   ├── auth/
│   │   ├── auth.service.ts             # Token management, session state
│   │   ├── auth.guard.ts               # Route protection
│   │   ├── guest.guard.ts              # Redirect if authenticated
│   │   └── token.interceptor.ts        # Attach Bearer token to requests
│   ├── http/
│   │   ├── api.interceptor.ts          # Base URL, error normalization
│   │   └── error.interceptor.ts        # 401/403/500 global handling
│   ├── theme/
│   │   ├── theme.service.ts            # Dark/light mode signal
│   │   └── theme.tokens.ts             # CSS custom property constants
│   ├── notifications/
│   │   ├── toast.service.ts            # Global toast notifications
│   │   └── ws.service.ts               # WebSocket connection manager
│   └── core.providers.ts               # ApplicationConfig providers array
│
├── shared/
│   ├── ui/                             # See Design System section
│   ├── directives/
│   │   ├── click-outside.directive.ts
│   │   ├── drag-drop.directive.ts
│   │   ├── long-press.directive.ts
│   │   └── intersection.directive.ts   # Lazy-load trigger
│   ├── pipes/
│   │   ├── file-size.pipe.ts
│   │   ├── duration.pipe.ts
│   │   ├── relative-time.pipe.ts
│   │   └── truncate.pipe.ts
│   └── utils/
│       ├── color.utils.ts
│       ├── media.utils.ts
│       └── scene.utils.ts
│
├── features/                           # Feature-Sliced Design
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   ├── magic-link/
│   │   └── forgot-password/
│   │
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   ├── recent-projects/
│   │   ├── quick-start/
│   │   ├── usage-stats/
│   │   └── dashboard.store.ts
│   │
│   ├── projects/
│   │   ├── project-list/
│   │   │   ├── project-list.component.ts
│   │   │   ├── project-card.component.ts
│   │   │   └── project-filters.component.ts
│   │   ├── project-detail/
│   │   ├── project-create/
│   │   │   ├── create-project-modal.component.ts
│   │   │   └── template-picker.component.ts
│   │   └── projects.store.ts
│   │
│   ├── media-library/
│   │   ├── upload/
│   │   │   ├── upload-dropzone.component.ts
│   │   │   ├── upload-progress.component.ts
│   │   │   └── upload.service.ts
│   │   ├── browser/
│   │   │   ├── media-browser.component.ts
│   │   │   ├── media-grid.component.ts
│   │   │   ├── media-item.component.ts
│   │   │   └── media-filters.component.ts
│   │   ├── detail/
│   │   │   ├── media-detail.component.ts
│   │   │   └── ai-analysis-panel.component.ts
│   │   └── media-library.store.ts
│   │
│   ├── scene-editor/
│   │   ├── canvas/
│   │   │   ├── editor-canvas.component.ts   # Main rendering surface
│   │   │   ├── canvas-renderer.service.ts   # Canvas2D / PIXI abstraction
│   │   │   └── selection.service.ts         # Multi-select, marquee
│   │   ├── timeline/
│   │   │   ├── scene-timeline.component.ts  # Scene strip at bottom
│   │   │   ├── scene-thumbnail.component.ts
│   │   │   └── scene-reorder.directive.ts   # CDK DragDrop
│   │   ├── layers/
│   │   │   ├── layer-panel.component.ts
│   │   │   ├── layer-item.component.ts
│   │   │   └── layer.service.ts
│   │   ├── properties/
│   │   │   ├── properties-panel.component.ts
│   │   │   ├── transform-controls.component.ts
│   │   │   ├── text-controls.component.ts
│   │   │   ├── media-controls.component.ts
│   │   │   └── animation-controls.component.ts
│   │   ├── toolbar/
│   │   │   ├── editor-toolbar.component.ts
│   │   │   └── tool-selector.component.ts
│   │   └── scene-editor.store.ts            # Master editor state
│   │
│   ├── ai-assistant/
│   │   ├── ai-panel/
│   │   │   ├── ai-panel.component.ts
│   │   │   └── ai-status.component.ts
│   │   ├── suggestions/
│   │   │   ├── suggestion-card.component.ts
│   │   │   ├── suggestion-list.component.ts
│   │   │   └── suggestion-actions.component.ts
│   │   ├── prompt/
│   │   │   └── custom-prompt.component.ts
│   │   └── ai.store.ts
│   │
│   ├── export-center/
│   │   ├── export-modal/
│   │   │   ├── export-modal.component.ts
│   │   │   ├── format-selector.component.ts
│   │   │   └── export-settings.component.ts
│   │   ├── progress/
│   │   │   ├── export-progress.component.ts
│   │   │   └── progress-ring.component.ts
│   │   ├── history/
│   │   │   └── export-history.component.ts
│   │   └── export.store.ts
│   │
│   ├── templates/
│   │   ├── gallery/
│   │   │   ├── template-gallery.component.ts
│   │   │   ├── template-card.component.ts
│   │   │   └── template-filters.component.ts
│   │   ├── preview/
│   │   │   └── template-preview.component.ts
│   │   └── templates.store.ts
│   │
│   ├── settings/
│   │   ├── profile/
│   │   ├── workspace/
│   │   ├── ai-settings/
│   │   │   ├── ai-settings.component.ts
│   │   │   └── provider-status.component.ts
│   │   ├── billing/
│   │   └── danger-zone/
│   │
│   └── presentation-player/             # Standalone shareable player
│       ├── player.component.ts
│       ├── player-controls.component.ts
│       └── player.service.ts
│
├── layout/
│   ├── app-layout/
│   │   ├── app-layout.component.ts
│   │   ├── sidebar.component.ts
│   │   └── topbar.component.ts
│   ├── editor-layout/
│   │   └── editor-layout.component.ts
│   └── auth-layout/
│       └── auth-layout.component.ts
│
└── app.routes.ts
```

### 3.2 Routing Architecture

```
Routes
│
├── /auth
│   ├── /login
│   ├── /register
│   ├── /forgot-password
│   └── /magic-link?token=...
│
├── /                            → Dashboard  [AuthGuard]
├── /projects                    → Project List
│   └── /:projectId              → Project Detail
│       └── /editor              → Scene Editor  [EditorLayout]
├── /media                       → Media Library
├── /templates                   → Template Gallery  [PUBLIC]
│   └── /:templateId             → Template Preview
├── /exports                     → Export Center
├── /settings
│   ├── /profile
│   ├── /workspace
│   ├── /ai
│   └── /billing
└── /demo/:shareId               → Standalone Player  [PUBLIC, SSR]
```

**Key decisions:**
- `/demo/:shareId` is publicly accessible, fully SSR-rendered for SEO and Open Graph
- `/editor` uses a dedicated `EditorLayout` — full viewport, no sidebar or topbar
- All authenticated routes behind `AuthGuard` reading from `AuthService.user()` signal

### 3.3 Signals & State Management

**Philosophy:** Signals are the single source of truth for all UI state. RxJS is reserved for inherently async streams (HTTP, WebSocket) and converted to signals at the boundary via `toSignal()`.

#### Store Architecture

```
AuthStore (global)
├── user: Signal<User | null>
├── isAuthenticated: Signal<boolean>   ← computed
└── isLoading: Signal<boolean>

ProjectsStore (feature)
├── projects: Signal<Project[]>
├── selectedId: Signal<string | null>
├── isLoading: Signal<boolean>
└── filter: Signal<ProjectFilter>

MediaStore (feature)
├── assets: Signal<MediaAsset[]>
├── uploadQueue: Signal<UploadItem[]>
├── selectedIds: Signal<Set<string>>
└── filter: Signal<MediaFilter>

EditorStore (feature — heavy)
├── project: Signal<Project | null>
├── scenes: Signal<Scene[]>
├── activeSceneId: Signal<string | null>
├── activeScene: Signal<Scene | null>   ← computed
├── selectedLayerIds: Signal<Set<string>>
├── tool: Signal<EditorTool>
├── zoom: Signal<number>
├── isDirty: Signal<boolean>
├── canUndo: Signal<boolean>            ← computed
├── canRedo: Signal<boolean>            ← computed
└── history: UndoRedoStack<EditorSnapshot>

AIStore (feature)
├── suggestions: Signal<AISuggestion[]>
├── activeJobId: Signal<string | null>
├── isAnalyzing: Signal<boolean>
├── providerStatus: Signal<AIProviderStatus>
└── progress: Signal<number>

ExportStore (feature)
├── jobs: Signal<ExportJob[]>
├── activeJob: Signal<ExportJob | null>
└── progress: Signal<number>
```

#### Data Flow

```
User Action
    ↓
Component calls Store method
    ↓
Store method calls Service (HTTP via RxJS)
    ↓
Service Observable → toSignal() → Signal update
    ↓
computed() signals propagate → UI re-renders (OnPush)
```

#### Undo/Redo (Editor)

Every destructive action pushes an immutable `EditorSnapshot` (serialized scene JSON) onto the undo stack. Stack capped at 50 entries.

```
UndoRedoStack<T>
├── past:   T[]     (max 50)
├── future: T[]
├── push(snapshot): void
├── undo():         T | undefined
└── redo():         T | undefined
```

### 3.4 Component Architecture

All components are **standalone**. No NgModules ever.

| Category | Description | Location |
|---|---|---|
| **Page** | Routed top-level, owns feature store | `features/*/` |
| **Smart** | Injects stores, orchestrates data flow | `features/*/` |
| **Presentational** | Pure, stateless, input/output only | `shared/ui/` |
| **Layout** | Shell components, define structural regions | `layout/` |
| **Utility** | Directives, pipes — no template | `shared/directives/`, `shared/pipes/` |

**Rules:**
1. Every component declares its own `imports: []`
2. All components are `OnPush` — signals drive change detection
3. Props in via `input()`, events out via `output()`
4. No direct DOM manipulation — use directives or `Renderer2`

### 3.5 SSR Strategy

#### Rendering Modes by Route

| Route | Mode | Reason |
|---|---|---|
| `/demo/:shareId` | Full SSR + rehydration | SEO, Open Graph, social sharing |
| `/templates` | SSR + rehydration | SEO for discovery |
| `/` Dashboard | SSR shell + deferred hydration | Fast TTFB, auth-gated |
| `/projects` | SSR shell | Fast navigation |
| `/projects/:id/editor` | CSR only (deferred) | Canvas API, complex state |
| `/auth/*` | CSR | No SEO value |

#### Hydration Safety

- All browser-specific APIs (`window`, `document`, `canvas`) guarded by `isPlatformBrowser()`
- Canvas renderer initializes lazily post-hydration via `afterNextRender()`
- WebSocket connection deferred to client side
- File upload via `FormData` — guarded, no SSR execution

#### Transfer State

API responses loaded during SSR transferred to client via Angular `TransferState` to avoid double-fetching:
- Project metadata on `/projects/:id`
- Template list on `/templates`
- Public demo data on `/demo/:shareId`

### 3.6 Performance Strategy

| Technique | Scope | Impact |
|---|---|---|
| Route-level lazy loading | All feature routes | Reduces initial bundle |
| `@defer` blocks | AI panel, export modal, properties panel | Defers non-critical UI |
| Virtual scrolling (CDK) | Media grid, export history | DOM node cap |
| `NgOptimizedImage` | All thumbnails | LCP optimization |
| Web Workers | Heavy computation (frame processing) | Non-blocking UI |
| `OnPush` + Signals | All components | Minimal CD cycles |
| Content-hashed assets | All static assets | Long-term cache |
| `QuicklinkStrategy` | Router preloading | Faster navigation |
| Preconnect hints | Fonts, API, CDN | DNS + TLS warmup |
| AVIF/WebP thumbnails | All media previews | 50–70% size reduction |
| Bundle budget | 200KB initial, 100KB per chunk | Enforced in `angular.json` |

---

## 4. Backend Architecture

### 4.1 NestJS Project Structure

```
apps/api/src/
│
├── main.ts                          # Bootstrap, Swagger, global pipes
├── app.module.ts                    # Root module
│
├── common/
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   ├── roles.decorator.ts
│   │   └── public.decorator.ts      # Skip auth guard
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interceptors/
│   │   ├── transform.interceptor.ts # Wrap: { data, meta }
│   │   ├── logging.interceptor.ts
│   │   └── timeout.interceptor.ts
│   ├── filters/
│   │   ├── http-exception.filter.ts
│   │   └── prisma-exception.filter.ts
│   └── dto/
│       ├── pagination.dto.ts
│       └── api-response.dto.ts
│
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   ├── storage.config.ts
│   ├── ai.config.ts
│   └── queue.config.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt-refresh.strategy.ts
│   │   │   └── magic-link.strategy.ts
│   │   └── dto/
│   │
│   ├── users/
│   ├── workspaces/
│   ├── projects/
│   │   ├── projects.module.ts
│   │   ├── projects.controller.ts
│   │   ├── projects.service.ts
│   │   └── dto/
│   │
│   ├── media/
│   │   ├── media.module.ts
│   │   ├── media.controller.ts
│   │   ├── media.service.ts
│   │   ├── storage/
│   │   │   ├── storage.interface.ts     # IStorageAdapter
│   │   │   ├── s3.adapter.ts
│   │   │   └── local.adapter.ts         # Dev only
│   │   └── processors/
│   │       └── thumbnail.processor.ts   # Sharp-based
│   │
│   ├── scenes/
│   │
│   ├── ai/
│   │   ├── ai.module.ts
│   │   ├── ai.controller.ts
│   │   ├── ai.service.ts
│   │   ├── providers/
│   │   │   ├── ai-provider.interface.ts # IAIProvider
│   │   │   ├── ollama.provider.ts
│   │   │   └── openai.provider.ts       # Stub — future
│   │   ├── prompts/
│   │   │   ├── analyze-screenshot.prompt.ts
│   │   │   ├── generate-copy.prompt.ts
│   │   │   └── suggest-steps.prompt.ts
│   │   └── processors/
│   │       └── ai-analysis.processor.ts # BullMQ processor
│   │
│   ├── export/
│   │   ├── export.module.ts
│   │   ├── export.controller.ts
│   │   ├── export.service.ts
│   │   ├── engines/
│   │   │   ├── export-engine.interface.ts # IExportEngine
│   │   │   ├── mp4.engine.ts
│   │   │   ├── gif.engine.ts
│   │   │   └── web-html.engine.ts
│   │   ├── renderer/
│   │   │   └── scene-renderer.service.ts  # Puppeteer-based
│   │   └── processors/
│   │       └── export.processor.ts
│   │
│   ├── templates/
│   ├── billing/
│   │   └── webhooks/
│   │       └── stripe.webhook.handler.ts
│   └── notifications/
│       └── notifications.gateway.ts     # WebSocket
│
├── prisma/
│   └── prisma.service.ts
│
└── infrastructure/
    ├── queue/
    │   └── queue.module.ts
    └── cache/
        └── cache.service.ts
```

### 4.2 Module Architecture

```
AppModule (root)
  ├── ConfigModule (global)
  ├── PrismaModule (global)
  ├── CacheModule (global, Redis)
  ├── QueueModule (global, BullMQ)
  │
  ├── AuthModule          ← JWT strategies, guards
  ├── UsersModule         ← Profile management
  ├── WorkspacesModule    ← Multi-tenant root entity
  ├── ProjectsModule      ← Core resource
  ├── MediaModule         ← Upload + storage
  ├── ScenesModule        ← Scene + layer management
  ├── AIModule            ← Provider + analysis queue
  ├── ExportModule        ← Export queue + engines
  ├── TemplatesModule     ← Template CRUD + seeding
  ├── BillingModule       ← Stripe integration
  └── NotificationsModule ← WebSocket gateway
```

**Module rules:**
- Modules do NOT import siblings directly — communication via EventEmitter or shared common
- `PrismaService` injected wherever DB access needed
- No circular dependencies — enforced by Nx dependency graph

### 4.3 API Contract

**Base:** `https://api.demoflow.io/v1`  
**Auth:** `Authorization: Bearer <accessToken>`  
**Format:** `{ data: T, meta?: PaginationMeta, error?: ApiError }`

#### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Create account |
| `POST` | `/auth/login` | Password login → tokens |
| `POST` | `/auth/refresh` | Rotate refresh token |
| `POST` | `/auth/logout` | Invalidate refresh token |
| `POST` | `/auth/magic-link` | Send magic link email |
| `GET` | `/auth/magic-link/verify` | Verify token → session |
| `GET` | `/auth/me` | Current user profile |

#### Projects
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/projects` | List (paginated, filterable) |
| `POST` | `/projects` | Create project |
| `GET` | `/projects/:id` | Get with scenes |
| `PATCH` | `/projects/:id` | Update metadata |
| `DELETE` | `/projects/:id` | Soft delete |
| `POST` | `/projects/:id/duplicate` | Deep clone |
| `POST` | `/projects/:id/publish` | Set status = PUBLISHED |
| `POST` | `/projects/from-template` | Create from template |

#### Media
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/media/upload` | Multipart form-data upload |
| `GET` | `/media` | List workspace assets |
| `GET` | `/media/:id` | Asset detail |
| `DELETE` | `/media/:id` | Delete asset + storage object |
| `POST` | `/media/:id/analyze` | Queue AI analysis job |
| `GET` | `/media/:id/analysis` | Poll analysis status |

#### Scenes
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/projects/:id/scenes` | List scenes ordered |
| `POST` | `/projects/:id/scenes` | Create scene |
| `PATCH` | `/projects/:id/scenes/:sid` | Update (layers, settings) |
| `DELETE` | `/projects/:id/scenes/:sid` | Delete scene |
| `POST` | `/projects/:id/scenes/reorder` | Update orderIndex |

#### AI
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ai/analyze` | Submit image for analysis |
| `POST` | `/ai/generate-copy` | Generate text for context |
| `GET` | `/ai/jobs/:id` | Poll job status |
| `GET` | `/ai/providers` | List providers + health |

#### Export
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/export` | Queue export job |
| `GET` | `/export/:id` | Job status + progress |
| `GET` | `/export/:id/download` | Signed download URL |
| `GET` | `/projects/:id/exports` | Project export history |

#### WebSocket Events (server → client)
| Event | Payload |
|---|---|
| `ai:analysis:progress` | `{ jobId, progress, status }` |
| `ai:analysis:complete` | `{ jobId, suggestions }` |
| `ai:analysis:failed` | `{ jobId, error }` |
| `export:progress` | `{ jobId, percent }` |
| `export:complete` | `{ jobId, downloadUrl }` |
| `export:failed` | `{ jobId, error }` |

### 4.4 Queue Architecture

```
ai-analysis-queue
├── Processor: ai-analysis.processor.ts
├── Concurrency: 2 workers
├── Retry: 3 attempts, exponential backoff
├── Timeout: 2 minutes per job
└── Events → WebSocket gateway

export-queue
├── Processor: export.processor.ts
├── Concurrency: 3 workers
├── Priority: HIGH (Enterprise) | NORMAL (Pro/Team) | LOW (Free)
├── Retry: 3 attempts
├── Timeout: 10 minutes per job
└── Events → WebSocket gateway
```

---

## 5. Domain Model

### 5.1 Core Entities

```
USER
  id: UUID                  email: string (unique)
  name: string              avatarUrl: string?
  role: UserRole            passwordHash: string?
  lastLoginAt: DateTime     createdAt / updatedAt: DateTime

WORKSPACE  (multi-tenant boundary)
  id: UUID                  name: string
  slug: string (unique)     ownerId: UUID → User
  plan: WorkspacePlan       logoUrl / brandColor: string?
  storageUsedBytes: bigint

PROJECT
  id: UUID                  workspaceId: UUID → Workspace
  title: string             description: string?
  type: ProjectType         status: ProjectStatus
  thumbnailUrl: string?     settings: JSON
  shareId: string (unique)  createdById: UUID → User
  publishedAt: DateTime?    createdAt / updatedAt: DateTime

MEDIA ASSET
  id: UUID                  workspaceId: UUID → Workspace
  type: MediaType           filename / originalName: string
  url: string (CDN)         thumbnailUrl: string?
  fileSizeBytes: int        mimeType: string
  width / height: int?      durationMs: int?
  metadata: JSON            uploadedById: UUID

SCENE
  id: UUID                  projectId: UUID → Project
  orderIndex: int           title: string?
  durationMs: int           transition: JSON
  layers: JSON (Layer[])    settings: JSON
  thumbnailUrl: string?

LAYER  (embedded in Scene.layers JSON — never queried independently)
  id: string (local UUID)   type: LayerType
  zIndex: int               visible / locked: boolean
  name: string              content: LayerContent (JSON)
  transform: Transform2D    animation: LayerAnimation
  startMs / endMs: int?

AI ANALYSIS
  id: UUID                  mediaAssetId: UUID (unique → MediaAsset)
  provider: string          model: string
  status: AIJobStatus       suggestions: JSON?
  processingMs: int?        errorMessage: string?

EXPORT JOB
  id: UUID                  projectId: UUID → Project
  format: ExportFormat      status: ExportStatus
  settings: JSON            outputUrl / fileSizeBytes: ?
  progressPercent: int      errorMessage: string?
  requestedById: UUID       startedAt / completedAt: DateTime?

TEMPLATE
  id: UUID                  name / description: string
  category: TemplateCategory previewUrl / previewVideoUrl: string?
  schema: JSON              isPremium / isPublished: boolean
  usageCount: int
```

### 5.2 Enums

```
UserRole:          SUPER_ADMIN | WORKSPACE_OWNER | ADMIN | MEMBER | VIEWER

WorkspacePlan:     FREE | PRO | TEAM | ENTERPRISE

ProjectType:       FEATURE_ANNOUNCEMENT | ONBOARDING_TUTORIAL |
                   CHANGELOG | PRODUCT_SHOWCASE | WALKTHROUGH | CUSTOM

ProjectStatus:     DRAFT | PUBLISHED | ARCHIVED

MediaType:         SCREENSHOT | SCREEN_RECORDING | IMAGE | VIDEO | GIF

LayerType:         MEDIA | TEXT | SHAPE | ARROW | HOTSPOT |
                   ZOOM_AREA | BLUR | CALLOUT | CURSOR

ExportFormat:      MP4 | GIF | WEB_HTML | WEB_EMBED

ExportStatus:      QUEUED | PROCESSING | COMPLETED | FAILED | CANCELLED

AIJobStatus:       QUEUED | PROCESSING | COMPLETED | FAILED

TemplateCategory:  FEATURE | ONBOARDING | CHANGELOG | SHOWCASE | TUTORIAL
```

### 5.3 Entity Relationships

```
User ─────────────────────► WorkspaceMember ◄──── Workspace
                                                      │
                                         ┌────────────┴──────────────┐
                                         │                           │
                                      Project                   MediaAsset
                                         │                           │
                                      Scene[]                   AIAnalysis
                                         │
                                      Layer[] (JSON embedded)

Project ─────────────────────────────► ExportJob[]

Workspace ───────────────────────────► Subscription
```

### 5.4 Database Indexes

```
Project:    [workspaceId, status], [shareId]
Scene:      [projectId, orderIndex]
MediaAsset: [workspaceId, type], [uploadedById]
ExportJob:  [projectId, status], [requestedById]
```

---

## 6. Design System

### 6.1 Design Tokens

Token-driven via CSS Custom Properties. All component styles consume tokens — no hardcoded values anywhere.

#### Color Palette

```css
/* Dark Theme (default) */
[data-theme="dark"] {
  /* Backgrounds */
  --color-bg-base:        hsl(225 14% 5.5%);       /* deepest bg */
  --color-bg-elevated:    hsl(225 12% 8%);          /* sidebar, panels */
  --color-bg-surface:     hsl(225 11% 11%);         /* cards */
  --color-bg-overlay:     hsl(225 10% 15%);         /* popovers */
  --color-bg-glass:       hsl(225 14% 18% / 55%);   /* glassmorphism */

  /* Borders */
  --color-border:         hsl(225 10% 20%);
  --color-border-subtle:  hsl(225 10% 14%);
  --color-border-focus:   hsl(255 80% 65% / 60%);

  /* Brand Accent */
  --color-accent-1:       hsl(255 80% 65%);         /* primary violet */
  --color-accent-2:       hsl(200 80% 60%);         /* electric blue */
  --color-accent-3:       hsl(280 70% 60%);         /* deep purple */

  /* Semantic */
  --color-success:        hsl(145 65% 52%);
  --color-warning:        hsl(38  90% 58%);
  --color-error:          hsl(3   85% 62%);
  --color-info:           hsl(200 80% 60%);

  /* Text */
  --color-text-primary:   hsl(225 10% 95%);
  --color-text-secondary: hsl(225 10% 65%);
  --color-text-muted:     hsl(225 10% 42%);
  --color-text-disabled:  hsl(225 10% 28%);
  --color-text-accent:    hsl(255 80% 72%);
}

/* Light Theme */
[data-theme="light"] {
  --color-bg-base:        hsl(0 0% 98%);
  --color-bg-elevated:    hsl(0 0% 100%);
  --color-bg-surface:     hsl(225 20% 97%);
  --color-bg-glass:       hsl(0 0% 100% / 70%);
  --color-border:         hsl(225 15% 88%);
  --color-text-primary:   hsl(225 25% 12%);
  --color-text-secondary: hsl(225 15% 38%);
  --color-text-muted:     hsl(225 12% 58%);
}
```

#### Spacing

```css
:root {
  --space-1: 4px;    --space-2: 8px;    --space-3: 12px;
  --space-4: 16px;   --space-5: 20px;   --space-6: 24px;
  --space-8: 32px;   --space-10: 40px;  --space-12: 48px;
  --space-16: 64px;  --space-20: 80px;  --space-24: 96px;
}
```

#### Typography

```css
:root {
  --font-sans:   'Inter Variable', system-ui, sans-serif;
  --font-mono:   'JetBrains Mono', 'Fira Code', monospace;

  --text-xs:    0.75rem;    /* 12px */
  --text-sm:    0.8125rem;  /* 13px */
  --text-base:  0.875rem;   /* 14px — body default */
  --text-md:    1rem;       /* 16px */
  --text-lg:    1.125rem;   /* 18px */
  --text-xl:    1.25rem;    /* 20px */
  --text-2xl:   1.5rem;     /* 24px */
  --text-3xl:   1.875rem;   /* 30px */
  --text-4xl:   2.25rem;    /* 36px */

  --weight-normal:   400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;
}
```

#### Shadows, Radius, Motion

```css
:root {
  /* Shadows */
  --shadow-sm:          0 1px 4px hsl(0 0% 0% / 30%);
  --shadow-md:          0 4px 16px hsl(0 0% 0% / 40%);
  --shadow-lg:          0 8px 30px hsl(0 0% 0% / 45%);
  --shadow-glow-sm:     0 0 12px hsl(255 80% 65% / 15%);
  --shadow-glow-md:     0 0 24px hsl(255 80% 65% / 20%);

  /* Radius */
  --radius-sm:   4px;    --radius-md:   8px;
  --radius-lg:   12px;   --radius-xl:   16px;
  --radius-2xl:  20px;   --radius-full: 9999px;

  /* Motion */
  --duration-fast:    120ms;    --duration-normal:  220ms;
  --duration-slow:    380ms;    --duration-slower:  550ms;
  --ease-smooth:  cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out:     cubic-bezier(0, 0, 0.2, 1);
}
```

### 6.2 Component Hierarchy (Atomic Design)

```
ATOMS (single-purpose, no children)
  Button · Badge · Icon · Avatar · Spinner · Toggle · Tag · Kbd · Separator · Dot

MOLECULES (composed of atoms, single responsibility)
  Card · Modal · Tooltip · Dropdown · Tabs · SearchInput · FileDropzone
  ProgressRing · ContextMenu · Breadcrumb · ColorPicker · EmptyState

ORGANISMS (domain-aware, complex composition)
  Sidebar · Topbar · MediaGrid (virtualized) · SceneTimeline
  PropertiesPanel · LayerPanel · AIAssistantPanel · ExportModal
  TemplateCard · NotificationPanel

LAYOUTS
  AppLayout (sidebar + topbar + content)
  EditorLayout (full-screen, no chrome)
  AuthLayout (centered card)
```

### 6.3 Animation System

| Animation | Trigger | Technique |
|---|---|---|
| Page transition | Route change | Angular Router, slide-fade |
| Modal open/close | Visibility state | scale + opacity + backdrop blur |
| Sidebar collapse | Toggle | width + content fade |
| Card hover | `:hover` | translateY + glow shadow |
| AI suggestions appear | Data loaded | staggered translateY + opacity |
| Export progress ring | Progress signal | SVG stroke-dashoffset |
| Toast notifications | Signal push | slide-in from right, auto-dismiss |
| Skeleton loading | Async data | shimmer keyframe |
| Drag feedback | CDK drag | scale 0.96 + shadow |

All animations respect `prefers-reduced-motion: reduce`.

### 6.4 Theme Architecture

```
ThemeService (singleton, root)
├── theme: Signal<'dark' | 'light' | 'system'>
├── resolvedTheme: Signal<'dark' | 'light'>   ← computed from OS pref
├── toggle(): void
└── setTheme(theme): void

Implementation:
  ThemeService writes data-theme="dark|light" to <html> element
  All CSS tokens scoped to [data-theme] attribute selectors
  Persisted to localStorage
  SSR: reads cookie → applies class during render to prevent FOUC
```

---

## 7. AI Integration Architecture

### 7.1 Provider Abstraction

```
IAIProvider (interface)
├── id: string
├── name: string
├── isAvailable(): Promise<boolean>
├── getCapabilities(): AICapabilities
├── analyzeImage(input: AnalyzeImageInput): Promise<AISuggestions>
└── generateCopy(input: GenerateCopyInput): Promise<string>

AICapabilities {
  supportsVision: boolean
  supportsTextGeneration: boolean
  maxImageSizeBytes: number
  supportedMimeTypes: string[]
  contextWindowTokens: number
}
```

**Implementations:**

| Provider | Model | Notes |
|---|---|---|
| `OllamaProvider` | `qwen2.5-vl:7b` | Default, local-first |
| `OpenAIProvider` | `gpt-4o` | Future, opt-in per workspace |
| `MockProvider` | Fixtures | Testing / demo mode |

**Provider selection:** Iterate registered providers in priority order → call `isAvailable()` → select first available → re-check health every 30s.

### 7.2 Analysis Pipeline

```
1.  Client:  POST /media/:id/analyze
2.  API:     Validate plan quota (max N analyses/month)
3.  API:     Create AIAnalysis record (status=QUEUED)
4.  API:     Enqueue to ai-analysis-queue → return 202 { jobId }

5.  Worker:  Dequeue job
6.  Worker:  Fetch media URL → download to temp buffer
7.  Worker:  Resize to max 1920px, convert to JPEG base64
             (For recordings: extract key frames at 1fps via FFmpeg)
8.  Worker:  Build structured prompt (system + user + JSON schema)
9.  Worker:  POST to Ollama /api/generate with format=json
10. Worker:  Parse + validate JSON response
11. Worker:  Save suggestions to AIAnalysis record
12. Worker:  Emit WebSocket: ai:analysis:complete { jobId, suggestions }
```

### 7.3 Suggestion Schema

```typescript
interface AISuggestions {
  confidence: number;               // 0.0 – 1.0
  title: string;
  description: string;
  steps: AIStep[];
  tags: string[];
  suggestedDurationMs: number;
  accessibility: string[];
}

interface AIStep {
  index: number;
  title: string;
  description: string;
  durationMs: number;
  zoomArea?: BoundingBox;           // Normalized 0–1 coordinates
  highlightAreas?: Highlight[];
  callout?: string;
  cursorPosition?: Point;
}

interface BoundingBox { x: number; y: number; width: number; height: number; }

interface Highlight {
  area: BoundingBox;
  label: string;
  style: 'circle' | 'rectangle' | 'arrow' | 'pulse';
}
```

### 7.4 Local-First Strategy

```
STARTUP SEQUENCE
  1. Ping Ollama: GET http://localhost:11434/api/version
  2. Verify model: GET /api/tags → check qwen2.5-vl in list
  3. If model missing → show in-app setup guide with install commands
  4. If Ollama unreachable → degraded mode:
       - Hide AI suggestion panel
       - Show "AI Offline" badge
       - All manual entry workflows still fully functional
  5. Health re-check every 30 seconds

APPLE SILICON OPTIMIZATION
  - Detect arm64 + macOS → recommend OLLAMA_METAL=1 environment variable
  - Prompt to use mlx-community/qwen2.5-vl for MLX backend
  - Display hardware info + estimated inference speed in AI Settings

FUTURE EXPANSION
  - OpenAI provider: opt-in per workspace, API key encrypted at rest
  - Per-workspace provider override UI in Settings
  - IAIProvider interface = zero consumer code changes on swap
```

---

## 8. Export Engine Architecture

### 8.1 Pipeline Overview

```
Client: POST /export { projectId, format, settings }
    ↓
API: Validate ownership + plan export limits
    ↓
API: Create ExportJob (status=QUEUED)
    ↓
API: Enqueue to export-queue (priority by plan)
    ↓
API: Return 202 { jobId }

Worker: Dequeue
    ↓
Worker: Fetch full project + scenes + layers from DB
    ↓
Worker: SceneRendererService → PNG frame sequence
    ↓
Worker: Select engine by format
    ↓              ↓                  ↓
MP4Engine      GIFEngine         WebHTMLEngine
    ↓              ↓                  ↓
H.264 MP4    Optimized GIF      HTML bundle
    ↓              ↓                  ↓
    └──────────── Upload to S3 ───────┘
                      ↓
         Update ExportJob (status=COMPLETED)
                      ↓
         WebSocket: export:complete { jobId, downloadUrl }
```

### 8.2 Frame Rendering

**Technology:** Puppeteer (headless Chromium) renders the Angular presentation player component to PNG frames — pixel-accurate, handles CSS, custom fonts, and Angular animations correctly.

```
SceneRendererService
├── launchBrowser()        # Chromium instance, reused per job
├── renderScene(scene)
│   ├── Navigate to /render/:sceneId (internal SSR route)
│   ├── Wait for networkidle + animationend
│   ├── Screenshot (PNG buffer)
│   └── Return Buffer
├── renderTransition(from, to, durationMs)
│   └── Interpolate between scenes → N frames
└── cleanup()              # Close browser instance

Output: 1920×1080 (configurable), 30fps (configurable: 24/30/60)
```

**Internal `/render/:sceneId` route:**
- Served by Angular SSR, no chrome (no sidebar/topbar)
- Waits for all images and fonts to fully load
- Exact pixel reproduction of scene canvas

### 8.3 Format Engines

#### MP4 Engine
```
Input:   PNG frame sequence
Command: ffmpeg
  -framerate {fps}
  -i frame_%04d.png
  -vf "scale=1920:1080:flags=lanczos"
  -c:v libx264 -crf 18 -preset fast
  -pix_fmt yuv420p
  -movflags +faststart
  {output}.mp4

Audio:   Optional background music: -i music.mp3 -shortest -af "afade=out"
Quality: CRF 18 (near-lossless), configurable
Max:     3840×2160 (4K)
```

#### GIF Engine
```
Input:   Same PNG frames (downsampled)
Pass 1:  ffmpeg -i frame_%04d.png -vf palettegen palette.png
Pass 2:  ffmpeg -i frame_%04d.png -i palette.png
           -filter_complex "fps=15,scale=800:-1[x];[x][1:v]paletteuse"
           {output}.gif
Max:     800px wide, 15fps (browser compat)
```

#### Web/HTML Engine
```
Output:  Self-contained single HTML file (zero external deps)
Contains:
  - Inline CSS (presentation player styles)
  - Inline JS (minified player runtime)
  - Asset blob URLs (base64 or CDN-linked)
  - Scene data JSON (inlined in <script type="application/json">)

Player features:
  - Autoplay on load
  - Play/pause controls
  - Scene navigation dots
  - Keyboard navigation (← →)
  - Fullscreen API
  - <iframe> embed snippet for easy sharing
```

### 8.4 Export Queue

```
Queue:    export-queue (BullMQ + Redis)

Priority mapping:
  ENTERPRISE → 1 (highest)
  TEAM       → 2
  PRO        → 3
  FREE       → 4 (lowest)

Workers:  3 concurrent
Lock:     10 minutes (prevents stale job re-execution)
Retry:    3 attempts, exponential backoff (10s base)
Timeout:  10 minutes hard limit

Progress events (every 2s):
  { jobId, phase: 'rendering|encoding|uploading', percent: 0–100 }

Cleanup:
  Temp frame directories deleted on completion or failure
  S3 export files expire after 7 days (configurable per plan)
```

---

## 9. Security Architecture

### Authentication

```
Access Token:   RS256, 15min expiry
                Payload: { sub, email, role, workspaceId }

Refresh Token:  RS256, 30d expiry
                Storage: httpOnly + Secure + SameSite=Strict cookie
                Rotation: new token on every refresh call
                Revocation: Redis blocklist (SET with TTL)

Magic Link:     One-time, 15min expiry
                Stored as bcrypt hash in DB
                Invalidated on first use
```

### RBAC Matrix

| Operation | OWNER | ADMIN | MEMBER | VIEWER |
|---|:---:|:---:|:---:|:---:|
| Create/delete workspace | ✓ | ✗ | ✗ | ✗ |
| Manage members | ✓ | ✓ | ✗ | ✗ |
| Billing | ✓ | ✗ | ✗ | ✗ |
| Create/edit/delete projects | ✓ | ✓ | ✓(own) | ✗ |
| Edit any project | ✓ | ✓ | ✗ | ✗ |
| Upload media | ✓ | ✓ | ✓ | ✗ |
| Export | ✓ | ✓ | ✓ | ✗ |
| View published | ✓ | ✓ | ✓ | ✓ |
| Manage templates | ✓ | ✓ | ✗ | ✗ |

### API Security

```
Rate Limits:
  Unauthenticated:  60 req/min per IP
  Authenticated:    600 req/min per user
  AI endpoints:     20 req/min per workspace
  Export:           10 jobs/hr (FREE), unlimited (PRO+)

File Uploads:
  Allowed MIME: PNG, JPEG, WebP, GIF, MP4, QuickTime, WebM
  Max size: 50MB (FREE), 500MB (PRO+)

Headers (Helmet.js):
  Content-Security-Policy
  Strict-Transport-Security (HSTS)
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff

Input Validation:
  All DTOs: class-validator decorators
  Queries: Prisma parameterized (no raw SQL)
  XSS: DOMPurify on user-generated HTML

Data Isolation:
  Every query scoped to authenticated workspaceId
  S3 objects under workspace-prefixed paths: workspaces/{workspaceId}/...
  Downloads via presigned URLs (10-minute expiry)
```

---

## 10. Scalability Strategy

### Horizontal Scaling Tiers

```
TIER 1: Launch (0–1K users)
  NestJS:  1 instance
  Postgres: Single node
  Redis:   Single node
  Workers: Collocated with API

TIER 2: Growth (1K–10K users)
  NestJS:  2–4 instances behind load balancer
  Postgres: Primary + 1 read replica + PgBouncer
  Redis:   Sentinel HA
  Workers: Separate service, 3–6 instances
  CDN:     Cloudflare for all media delivery

TIER 3: Scale (10K+ users)
  NestJS:  Kubernetes pods with HPA
  Workers: Dedicated K8s deployment (spot instances)
  AI:      Dedicated inference server fleet
  Postgres: Patroni HA cluster + multiple read replicas
  Redis:   Redis Cluster
  Events:  NATS or RabbitMQ for service decoupling
```

### Caching Strategy

```
Redis (TTL):
  User sessions:      15min
  Project metadata:   5min (invalidated on write)
  Template list:      1hr  (invalidated on publish)
  AI provider health: 30s
  Workspace plan:     10min

CDN (Cloudflare):
  Media thumbnails:   1 year  (content-hashed, immutable)
  Export downloads:   24hr    (presigned redirect)
  Template previews:  1 year  (immutable)
  Public demo pages:  10min   (SSR output cache)
```

---

## 11. Testing Strategy

### Frontend

```
E2E (Playwright) — ~20 tests, critical paths only
  · Register → create project → add scene → export MP4
  · Upload screenshot → AI analysis → accept suggestions
  · Apply template → customize → publish
  · Share link → public player renders

Component Tests (Angular Testing Library) — ~80 tests
  · All shared UI atoms and molecules
  · Feature interaction flows
  · Store + service integration
  · Accessibility (jest-axe)

Unit Tests (Vitest) — ~200 tests
  · All services
  · All signal stores
  · Pipes and utilities
  · Target: 80% coverage
```

### Backend

```
E2E API Tests (Supertest + Test DB) — ~30 tests
  · Auth lifecycle
  · Full export pipeline with fixtures
  · AI analysis with mock provider

Integration Tests (Jest + Prisma test DB) — ~60 tests
  · All service methods with real DB
  · Storage adapter (MinIO)
  · Queue processor behavior

Unit Tests (Jest) — ~150 tests
  · Services (Prisma mocked)
  · Guards and interceptors
  · DTO validation edge cases
  · AI provider adapter contracts
  · Target: 75% coverage
```

---

## 12. Infrastructure & DevOps

### Docker Compose (Development)

```yaml
services:
  api:        NestJS (hot reload via ts-node-dev)
  client:     Angular dev server (ng serve)
  postgres:   PostgreSQL 16                     # port 5432
  redis:      Redis 7-alpine                   # port 6379
  minio:      MinIO (S3-compatible)             # ports 9000 / 9001 console
  ollama:     Ollama + Qwen VL pre-pulled       # GPU/Metal passthrough
  bullboard:  BullMQ dashboard                 # port 3333
  mailhog:    SMTP trap for magic link emails   # port 8025 UI
```

### CI/CD Pipeline

```
Feature branch push:
  ├── Lint (ESLint + Prettier)
  ├── Type check (tsc --noEmit)
  ├── Unit tests
  └── Build check

Merge to main:
  ├── All above +
  ├── Integration tests
  ├── E2E tests (Playwright, headless)
  ├── Docker image build + push
  └── Deploy to staging (automatic)

Tag release (v*.*.*):
  └── Deploy to production (manual approval gate)
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/demoflow

# Cache / Queue
REDIS_URL=redis://host:6379

# Auth (RS256 keypair)
JWT_PRIVATE_KEY=...
JWT_PUBLIC_KEY=...
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# Storage
STORAGE_PROVIDER=s3
S3_ENDPOINT=https://...
S3_BUCKET=demoflow-assets
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_CDN_URL=https://cdn.demoflow.io

# AI
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-vl:7b
OPENAI_API_KEY=...           # future, optional

# Billing
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# App
APP_URL=https://demoflow.io
API_URL=https://api.demoflow.io
CORS_ORIGINS=https://demoflow.io,http://localhost:4200
```

---

## 13. Decision Log

| # | Decision | Rationale | Trade-off |
|---|---|---|---|
| 1 | **Signals-first, RxJS at I/O boundaries** | Angular 20 idiomatic, simpler mental model, finer-grained reactivity | Some RxJS expertise underutilized |
| 2 | **Scene layers as JSON in DB** | Layers are deeply nested, written as a unit, never queried individually | No independent layer queries; always fetch full scene |
| 3 | **Puppeteer for frame rendering** | Pixel-accurate, uses real Angular renderer, handles custom CSS/fonts | Heavier than pure canvas; requires Chromium binary |
| 4 | **BullMQ over SQS/Kafka** | Redis already in stack, sufficient at MVP scale, rich dashboard | Not cloud-native; plan migration at scale |
| 5 | **Local-first AI (Ollama)** | Privacy-preserving, no per-token cost, offline capable | Requires user setup; inference speed varies by hardware |
| 6 | **Nx monorepo** | Shared types/DTOs between apps, coordinated CI, generators | Steeper initial setup vs separate repos |
| 7 | **Soft deletes on Projects** | User recovery, audit trail, referential integrity | Requires `WHERE deletedAt IS NULL` on all project queries |
| 8 | **RS256 JWT (asymmetric)** | Public key verifiable without shared secret (future microservices) | Key management more complex than HS256 |
| 9 | **ShareId as cuid on Project** | Human-safe public share URLs without exposing internal UUID | Extra column; cuid collision probability is negligible |
| 10 | **Tailwind for layout, CSS tokens for theming** | Tailwind accelerates component layout; tokens enable runtime theming | Dual approach requires strict naming conventions |

---

*Last updated: 2026-06-24*  
*Maintained by: DemoFlow Core Team*  
*This is a living document — update it when any architectural decision changes*
