# DemoFlow Technical Architecture & UX Reference Spec
> **Note to AI Agents**: This is a human/senior architect reference document. Do NOT open or read this file during task execution unless explicitly requested by the task spec.

---

## 1. System Overview & Monorepo Structure

DemoFlow is a desktop-class video/presentation editor for SaaS demos. It uses a monorepo setup:

```
demoflow/
├── docs/                # Project Operating System & task specifications
├── frontend/            # Angular standalone application (FSD architecture)
└── backend/             # NestJS backend application (Clean architecture)
```

### Frontend Layers (FSD)
- **app**: Bootstrapping, routing configuration (`app.config.ts`, `app.routes.ts`, global styles).
- **pages**: Full page layouts, page composition, routing components.
- **widgets**: Large feature compositions (e.g. `sidebar`, `topbar`, `timeline`).
- **features**: Business logic, user action flows (e.g. `auth-form`, `create-project`, `media-upload`).
- **entities**: Domain entity logic and visual data cards (e.g. `project`, `scene`, `media`).
- **shared**: Pure reusable UI controls, utilities, custom pipes. No business logic.

---

## 2. Frontend Routing & SSR Configuration

DemoFlow runs Angular with Server-Side Rendering (SSR). Dynamic segments must use `RenderMode.Server` to prevent compilation/prerender errors.

| Route | Render Mode (SSR) | Layout | Description |
|---|---|---|---|
| `/` | `RenderMode.Prerender` | `AuthLayout` | Land/Login page |
| `/login` | `RenderMode.Server` | `AuthLayout` | Login form page |
| `/register` | `RenderMode.Server` | `AuthLayout` | Sign up page |
| `/forgot-password`| `RenderMode.Server` | `AuthLayout` | Password reset request |
| `/dashboard` | `RenderMode.Prerender` | `WorkspaceLayout`| User dashboard |
| `/projects` | `RenderMode.Prerender` | `WorkspaceLayout`| Projects grid list |
| `/projects/:id/editor`| `RenderMode.Server` | `EditorLayout` | Advanced editor workspace |
| `/demo/:shareId` | `RenderMode.Server` | `PlayerLayout` | Public/Shared viewer player |

---

## 3. Editor Workspace Layout Constraints

The advanced editor utilizes specific panel sizing variables in CSS:
- **Left Sidebar (Toolbar)**: `48px` width.
- **Left Panel (Layers/Assets)**: `220px` width.
- **Center Canvas**: Flex-grow.
- **Right Panel (Properties)**: `280px` width.
- **Right Panel (AI Copilot)**: `320px` width.
- **Bottom Timeline**: `96px` height.

---

## 4. Domain Model (Database Entity Definitions)

The PostgreSQL database uses the following core entities (modeled in Prisma):

### User & Tenant
- **User**: `id` (UUID), `email`, `passwordHash`, `name`, `createdAt`, `updatedAt`.
- **Workspace**: `id` (UUID), `name`, `ownerId` (User), `createdAt`, `updatedAt`.
- **WorkspaceMember**: `id`, `workspaceId`, `userId`, `role` (`OWNER`, `ADMIN`, `MEMBER`).

### Core Product Entities
- **Project**: `id` (UUID), `workspaceId`, `title`, `description`, `thumbnail` (JSON), `status` (`DRAFT`, `IN_PROGRESS`, `COMPLETED`, `ARCHIVED`), `sceneCount` (Int), `durationMs` (Int), `createdAt`, `updatedAt`.
- **Scene**: `id` (UUID), `projectId`, `orderIndex` (Int), `durationMs` (Int), `settings` (JSON), `createdAt`, `updatedAt`.
- **Media**: `id` (UUID), `workspaceId`, `url`, `key`, `name`, `type` (`VIDEO`, `IMAGE`, `AUDIO`), `sizeBytes` (BigInt), `metadata` (JSON).

---

## 5. MVP Scope & Business Decisions

To speed up MVP development, several features are explicitly out of scope:
- **No real-time collaboration**: Simple database locks.
- **No WebSockets for Export**: UI will poll export status via HTTP GET every 3 seconds.
- **No Magic Links**: Standard email/password login is standard for MVP.
- **No custom video overlays/transitions**: Focus on static/animated layer compositions.
- **Infrastructure**: Single-node NestJS, direct R2 media storage uploads, no BullMQ (synchronous background processing using memory queues).
