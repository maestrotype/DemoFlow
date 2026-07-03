# DemoFlow API Contracts Spec
> **Note to AI Agents**: This is a human/senior architect reference document. Do NOT open or read this file during task execution unless explicitly requested by the task spec.

All requests must include headers:
- `Content-Type: application/json`
- `Authorization: Bearer <JWT_TOKEN>` (for protected endpoints)

---

## 1. Authentication Endpoints

- **POST** `/api/auth/register`
  - Request: `{ email: string, password: string, name?: string }`
  - Response: `{ token: string, user: { id: string, email: string, name: string } }`
- **POST** `/api/auth/login`
  - Request: `{ email: string, password: string }`
  - Response: `{ token: string, user: { id: string, email: string } }`
- **POST** `/api/auth/forgot-password`
  - Request: `{ email: string }`
  - Response: `{ message: string }`

---

## 2. Project Endpoints

- **GET** `/api/projects`
  - Response: `Array<{ id: string, title: string, description?: string, status: string, sceneCount: number, durationMs: number }>`
- **POST** `/api/projects`
  - Request: `{ title: string, description?: string, workspaceId: string }`
  - Response: `{ id: string, title: string, description: string, status: 'draft', createdAt: string }`
- **GET** `/api/projects/:id`
  - Response: `{ id: string, title: string, description: string, status: string, scenes: Array<Scene> }`
- **PUT** `/api/projects/:id`
  - Request: `{ title?: string, description?: string, status?: string }`
  - Response: `{ id: string, title: string, status: string }`
- **DELETE** `/api/projects/:id`
  - Response: `{ success: boolean }`

---

## 3. Media Assets Endpoints

- **GET** `/api/media`
  - Response: `Array<{ id: string, name: string, url: string, type: 'video'|'image'|'audio', sizeBytes: number }>`
- **POST** `/api/media/upload` (multipart/form-data)
  - Request: file payload
  - Response: `{ id: string, url: string, name: string, key: string }`

---

## 4. Export Endpoints

- **POST** `/api/export`
  - Request: `{ projectId: string, format: 'mp4'|'gif', settings?: { resolution: string } }`
  - Response: `{ exportId: string, status: 'pending'|'processing' }`
- **GET** `/api/export/:exportId`
  - Response: `{ exportId: string, status: 'pending'|'processing'|'completed'|'failed', downloadUrl?: string, progressPercent: number }`
