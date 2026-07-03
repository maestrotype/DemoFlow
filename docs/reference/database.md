# DemoFlow Database & Prisma Schema Spec
> **Note to AI Agents**: This is a human/senior architect reference document. Do NOT open or read this file during task execution unless explicitly requested by the task spec.

---

## 1. Prisma Schema Overview

```prisma
model User {
  id           String             @id @default(uuid())
  email        String             @unique
  passwordHash String
  name         String?
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt
  memberships  WorkspaceMember[]
}

model Workspace {
  id        String            @id @default(uuid())
  name      String
  ownerId   String
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt
  members   WorkspaceMember[]
  projects  Project[]
}

model WorkspaceMember {
  id          String    @id @default(uuid())
  workspaceId String
  userId      String
  role        String    // OWNER, ADMIN, MEMBER
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  user        User      @relation(fields: [userId], references: [id])
}

model Project {
  id          String    @id @default(uuid())
  workspaceId String
  title       String
  description String?
  thumbnail   Json?     // { url: string, alt?: string }
  status      String    // DRAFT, IN_PROGRESS, COMPLETED, ARCHIVED
  sceneCount  Int       @default(0)
  durationMs  Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  scenes      Scene[]
}

model Scene {
  id          String   @id @default(uuid())
  projectId   String
  orderIndex  Int
  durationMs  Int      @default(5000)
  settings    Json?    // SceneSettings schema
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  project     Project  @relation(fields: [projectId], references: [id])
}

model Media {
  id          String   @id @default(uuid())
  workspaceId String
  url         String
  key         String
  name        String
  type        String   // VIDEO, IMAGE, AUDIO
  sizeBytes   BigInt
  metadata    Json?    // MediaMetadata schema
  createdAt   DateTime @default(now())
}
```

---

## 2. JSON Column Schemas

### Layer JSON Schema
```typescript
interface Layer {
  id: string;
  type: 'video' | 'image' | 'text' | 'audio';
  name: string;
  mediaId?: string;
  transform: Transform2D;
  startTimeMs: number;
  durationMs: number;
  animations: LayerAnimation[];
}

interface Transform2D {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees
  opacity: number;
}

interface LayerAnimation {
  type: 'fade-in' | 'fade-out' | 'slide-in' | 'slide-out' | 'zoom-in';
  startTimeMs: number;
  durationMs: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}
```
