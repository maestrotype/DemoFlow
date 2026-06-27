# DemoFlow — Project Skeleton Directory Tree

This file outlines the generated directory and file structures for the frontend (Angular 20 with Feature-Sliced Design) and backend (NestJS with Clean Architecture).

Please check the full documented version at [TREE.md](file:///Users/andriidanichkin/Documents/myProjects/DemoFlow/docs/TREE.md) in the `docs` folder.

---

## 1. Frontend Structure (`frontend/src/app/`)

```
frontend/src/app/
├── app.config.server.ts
├── app.config.ts
├── app.html
├── app.routes.server.ts
├── app.routes.ts
├── app.scss
├── app.spec.ts
├── app.ts
│
├── core/
│   ├── auth/
│   │   ├── auth.guard.ts
│   │   └── auth.interceptor.ts
│   └── theme/
│       └── theme.service.ts
│
├── shared/
│   └── ui/
│       ├── index.ts
│       ├── button/
│       ├── input/
│       ├── textarea/
│       ├── select/
│       ├── dropdown/
│       ├── badge/
│       ├── avatar/
│       ├── tooltip/
│       ├── dialog/
│       ├── toast/
│       ├── tabs/
│       ├── skeleton/
│       ├── spinner/
│       ├── card/
│       └── modal/
│
├── entities/
│   ├── project/
│   │   ├── project.model.ts
│   │   └── project-card/
│   │       └── project-card.ts
│   ├── scene/
│   │   └── scene.model.ts
│   └── media/
│       └── media.model.ts
│
├── features/
│   ├── auth-form/
│   │   └── auth-form.ts
│   ├── create-project/
│   │   └── create-project.ts
│   └── media-upload/
│       └── media-upload.ts
│
├── widgets/
│   ├── sidebar/
│   │   └── sidebar.ts
│   ├── topbar/
│   │   └── topbar.ts
│   ├── recent-projects/
│   │   └── recent-projects.ts
│   └── timeline/
│       └── timeline.ts
│
├── layouts/
│   ├── auth-layout/
│   │   └── auth-layout.ts
│   ├── workspace-layout/
│   │   └── workspace-layout.ts
│   └── editor-layout/
│       └── editor-layout.ts
│
└── pages/
    ├── login/
    │   └── login.ts
    ├── register/
    │   └── register.ts
    ├── forgot-password/
    │   └── forgot-password.ts
    ├── dashboard/
    │   └── dashboard.ts
    ├── projects/
    │   └── projects.ts
    ├── editor/
    │   └── editor.ts
    └── player/
        └── player.ts
```

---

## 2. Backend Structure (`backend/src/`)

```
backend/src/
├── main.ts
├── app.module.ts
├── app.service.ts
├── app.controller.ts
├── app.controller.spec.ts
│
├── domain/
│   ├── user.entity.ts
│   ├── project.entity.ts
│   ├── scene.entity.ts
│   └── media.entity.ts
│
├── application/
│   ├── ports/
│   │   ├── project.repository.interface.ts
│   │   └── media.storage.interface.ts
│   └── use-cases/
│       └── create-project.use-case.ts
│
├── infrastructure/
│   ├── persistence/
│   │   ├── prisma.service.ts
│   │   └── project.repository.impl.ts
│   └── storage/
│       └── r2.storage.impl.ts
│
└── modules/
    ├── auth.module.ts
    ├── project.module.ts
    ├── media.module.ts
    ├── ai.module.ts
    └── export.module.ts
```
