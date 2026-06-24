# DemoFlow — Project Skeleton Directory Tree

This file outlines the generated directory and file structures for the frontend (Angular 20 with Feature-Sliced Design) and backend (NestJS with Clean Architecture).

---

## 1. Frontend Structure (`frontend/src/app/`)

The frontend application follows the **Feature-Sliced Design (FSD)** architecture.

```
frontend/src/app/
├── app.config.server.ts      # Angular SSR server config
├── app.config.ts             # Client application providers config
├── app.html                  # Root template
├── app.routes.server.ts      # Server-specific routing
├── app.routes.ts             # App routing hierarchy (Lazy loading configured)
├── app.scss                  # Root styling
├── app.spec.ts               # Root spec test
├── app.ts                    # Root component (App)
│
├── core/                     # Singleton modules and configurations
│   ├── auth/                 # Route guards and interceptors
│   │   ├── auth.guard.ts
│   │   └── auth.interceptor.ts
│   └── theme/                # Global theme service (Signals-first)
│       └── theme.service.ts
│
├── shared/                   # Domain-agnostic components and utilities
│   └── ui/                   # Reusable atomic visual controls (Design System primitives)
│       ├── index.ts          # Main UI barrel exporter
│       ├── button/           # Standalone button (Variant/Size configurations)
│       ├── input/            # Form input (CVA compatible)
│       ├── textarea/         # Form multiline textarea (CVA compatible)
│       ├── select/           # Form dropdown options select (CVA compatible)
│       ├── dropdown/         # Click overlay select panel
│       ├── badge/            # Pill notification label badge
│       ├── avatar/           # Initial fallback picture avatar
│       ├── tooltip/          # Hover informational tooltip bubble
│       ├── dialog/           # Scale-in backdrop-blur viewport dialog
│       ├── toast/            # Slide-up automatic notifications
│       ├── tabs/             # Tab lists and sliding navigations
│       ├── skeleton/         # Shimmering loading lines and shapes
│       ├── spinner/          # Rotating SVG loading spinner
│       ├── card/             # Standalone card surface
│       └── modal/            # Standalone modal viewport
│
│
├── entities/                 # Domain models, schema structures and minimal display logic
│   ├── project/              # Project entity definitions
│   │   ├── project.model.ts
│   │   └── project-card/     # Read-only project preview card component
│   │       └── project-card.ts
│   ├── scene/                # Scene model definition
│   │   └── scene.model.ts
│   └── media/                # Media asset model definition
│       └── media.model.ts
│
├── features/                 # User-interactive features with single action scopes
│   ├── auth-form/            # Interactive login/register forms component
│   │   └── auth-form.ts
│   ├── create-project/       # Create project trigger button component
│   │   └── create-project.ts
│   └── media-upload/         # Drag-and-drop media upload zone component
│       └── media-upload.ts
│
├── widgets/                  # Combined features/entities forming complex sections
│   ├── sidebar/              # Workspace navigation sidebar
│   │   └── sidebar.ts
│   ├── topbar/               # Workspace top dashboard bar
│   │   └── topbar.ts
│   ├── recent-projects/      # Grid showing list of recent user projects
│   │   └── recent-projects.ts
│   └── timeline/             # Scene editor timeline controller strip
│       └── timeline.ts
│
├── layouts/                  # Structural templates wrapping views
│   ├── auth-layout/          # Centered card layout shell
│   │   └── auth-layout.ts
│   ├── workspace-layout/     # Sidebar + header layout shell
│   │   └── workspace-layout.ts
│   └── editor-layout/        # Distraction-free canvas editor shell
│       └── editor-layout.ts
│
└── pages/                    # Page components instantiated by routers
    ├── login/
    │   └── login.ts          # /auth/login
    ├── register/
    │   └── register.ts       # /auth/register
    ├── forgot-password/
    │   └── forgot-password.ts # /auth/forgot-password
    ├── dashboard/
    │   └── dashboard.ts      # /dashboard
    ├── projects/
    │   └── projects.ts       # /projects
    ├── editor/
    │   └── editor.ts         # /projects/:id/editor
    └── player/
        └── player.ts         # /demo/:shareId
```

---

## 2. Backend Structure (`backend/src/`)

The backend follows **Clean Architecture** principles.

```
backend/src/
├── main.ts                   # NestJS bootstrapper
├── app.module.ts             # Root module importing feature modules
├── app.service.ts            # Root fallback service
├── app.controller.ts         # Root fallback controller
├── app.controller.spec.ts    # Controller spec tests
│
├── domain/                   # Enterprise core business models (Independent)
│   ├── user.entity.ts
│   ├── project.entity.ts
│   ├── scene.entity.ts
│   └── media.entity.ts
│
├── application/              # Orchestration & Use Cases (Infrastructure independent)
│   ├── ports/                # Interface declarations (Inversion of Control)
│   │   ├── project.repository.interface.ts
│   │   └── media.storage.interface.ts
│   └── use-cases/            # Pure application use cases
│       └── create-project.use-case.ts
│
├── infrastructure/           # Framework, libraries and database adapters
│   ├── persistence/          # Database implementations (Prisma)
│   │   ├── prisma.service.ts
│   │   └── project.repository.impl.ts
│   └── storage/              # External Cloud storage implementations (R2)
│       └── r2.storage.impl.ts
│
└── modules/                  # NestJS module setup wrappers for dependencies
    ├── auth.module.ts        # Authentication module registrations
    ├── project.module.ts     # Project use case and provider registrations
    ├── media.module.ts       # Media upload and storage registrations
    ├── ai.module.ts          # Ollama / AI models registrations
    └── export.module.ts      # FFmpeg export engine registrations
```
