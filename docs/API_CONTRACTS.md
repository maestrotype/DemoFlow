# DemoFlow — API Contracts

> **Version:** 1.0.0 (MVP)
> **Base URL:** `https://api.demoflow.io/v1`
> **Auth:** `Authorization: Bearer <accessToken>` (except public endpoints)
> **Format:** JSON. All responses wrapped: `{ data: T, meta?: M, error?: E }`
> **Last updated:** 2026-06-24

---

## Table of Contents

1. [Conventions](#1-conventions)
2. [Authentication](#2-authentication)
3. [Workspaces](#3-workspaces)
4. [Projects](#4-projects)
5. [Scenes](#5-scenes)
6. [Media](#6-media)
7. [AI](#7-ai)
8. [Export](#8-export)
9. [Sharing](#9-sharing)
10. [Billing](#10-billing)
11. [Settings](#11-settings)
12. [Public Endpoints](#12-public-endpoints)
13. [Error Reference](#13-error-reference)
14. [MVP vs Future Endpoints](#14-mvp-vs-future-endpoints)

---

## 1. Conventions

### Request Format

```
Content-Type:   application/json
Authorization:  Bearer <accessToken>
```

### Response Envelope

```json
{
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 143,
    "hasMore": true
  },
  "error": null
}
```

### Error Response

```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "must not be empty" }
    ]
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | OK — successful request with data |
| `201` | Created — resource created |
| `202` | Accepted — async job queued |
| `204` | No Content — successful, no body |
| `400` | Bad Request — validation failed |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient permissions |
| `404` | Not Found |
| `409` | Conflict — duplicate (email, slug) |
| `413` | Payload Too Large — file size limit exceeded |
| `415` | Unsupported Media Type |
| `422` | Unprocessable — business rule violation |
| `429` | Too Many Requests — rate limit |
| `500` | Internal Server Error |

### Pagination

All list endpoints support:

```
?page=1&limit=20&sort=created_at&order=desc
```

### ID Formats

- Resource IDs: UUID `550e8400-e29b-41d4-a716-446655440000`
- Share IDs: cuid `clh4x2y0z0000abc123def456`
- Timestamps: ISO 8601 UTC `2026-06-24T10:00:00.000Z`

---

## 2. Authentication

### POST /auth/register

Create a new user account and workspace.

**Request:**
```json
{
  "name": "Andrii Danichkin",
  "email": "andrii@example.com",
  "password": "min8chars"
}
```

**Response `201`:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "name": "Andrii Danichkin",
      "email": "andrii@example.com",
      "role": "member",
      "createdAt": "2026-06-24T10:00:00.000Z"
    },
    "workspace": {
      "id": "uuid",
      "name": "Andrii Danichkin",
      "slug": "andrii-danichkin",
      "plan": "free"
    },
    "accessToken": "eyJ..."
  }
}
```

**Errors:** `409` email already registered · `400` validation failure

**Notes:** Refresh token set as `httpOnly` cookie. Workspace auto-named from user's name.

---

### POST /auth/login

**Request:**
```json
{
  "email": "andrii@example.com",
  "password": "min8chars"
}
```

**Response `200`:**
```json
{
  "data": {
    "user": { "id": "uuid", "name": "...", "email": "...", "role": "member" },
    "workspace": { "id": "uuid", "name": "...", "slug": "...", "plan": "free" },
    "accessToken": "eyJ..."
  }
}
```

**Errors:** `401` invalid credentials · `429` rate limited (5 failed attempts per 15 min)

---

### POST /auth/refresh

Rotate the refresh token. Reads from `httpOnly` cookie.

**Request:** No body.

**Response `200`:**
```json
{ "data": { "accessToken": "eyJ..." } }
```

**Errors:** `401` token expired, revoked, or absent

---

### POST /auth/logout

**Response `204`:** Cookie cleared.

---

### POST /auth/forgot-password

**Request:**
```json
{ "email": "andrii@example.com" }
```

**Response `200`:**
```json
{ "data": { "message": "If this email exists, a reset link has been sent." } }
```

**Notes:** Always returns 200 regardless of whether email exists (security).

---

### POST /auth/reset-password

**Request:**
```json
{
  "token": "reset-token-from-email",
  "password": "newpassword123"
}
```

**Response `200`:**
```json
{ "data": { "message": "Password updated successfully." } }
```

**Errors:** `400` token invalid or expired · `400` weak password

---

### GET /auth/me

Get the current authenticated user and their workspace.

**Response `200`:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Andrii Danichkin",
    "email": "andrii@example.com",
    "avatarUrl": null,
    "role": "member",
    "workspace": {
      "id": "uuid",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "plan": "pro",
      "storageUsedBytes": 1073741824
    },
    "createdAt": "2026-06-24T10:00:00.000Z"
  }
}
```

---

## 3. Workspaces

### GET /workspace

Get current workspace details, limits, and current usage.

**Response `200`:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "plan": "pro",
    "logoUrl": null,
    "brandColor": "#7c5ce7",
    "storageUsedBytes": 1073741824,
    "storageLimitBytes": 10737418240,
    "limits": {
      "maxProjects": null,
      "maxExportsPerMonth": null,
      "maxAiAnalysesPerMonth": null,
      "canExportGif": true,
      "canExportWeb": true,
      "canRemoveWatermark": true,
      "maxResolutionPx": 1920
    },
    "usage": {
      "projectsCount": 7,
      "exportsThisMonth": 12,
      "aiAnalysesThisMonth": 34
    }
  }
}
```

---

### PATCH /workspace

Update workspace settings. **Admin/Owner only.**

**Request (all fields optional):**
```json
{
  "name": "Acme Corp v2",
  "brandColor": "#6b5ce7"
}
```

**Response `200`:** Updated workspace object.

---

### GET /workspace/members

List workspace members. **v1.0+**

**Response `200`:**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "name": "Andrii Danichkin",
      "email": "andrii@example.com",
      "avatarUrl": null,
      "role": "owner",
      "joinedAt": "2026-06-24T10:00:00.000Z"
    }
  ]
}
```

---

### POST /workspace/members/invite

**Request:**
```json
{ "email": "teammate@example.com", "role": "member" }
```

**Response `201`:**
```json
{ "data": { "message": "Invitation sent to teammate@example.com" } }
```

**Errors:** `422` member limit reached for current plan

---

### PATCH /workspace/members/:memberId

Change a member's role. **Admin/Owner only.**

**Request:**
```json
{ "role": "admin" }
```

**Response `200`:** Updated member object.

---

### DELETE /workspace/members/:memberId

Remove a member. **Admin/Owner only.**

**Response `204`:** Empty.

---

## 4. Projects

### GET /projects

List projects in the current workspace.

**Query params:** `page` `limit` `sort` `order` `status` `type`

**Response `200`:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Q1 Feature Launch",
      "type": "feature_announcement",
      "status": "draft",
      "thumbnailUrl": "https://cdn.demoflow.io/...",
      "sceneCount": 5,
      "shareId": "clh4x2y0z0000abc",
      "createdById": "uuid",
      "publishedAt": null,
      "createdAt": "2026-06-24T10:00:00.000Z",
      "updatedAt": "2026-06-24T11:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 7, "hasMore": false }
}
```

---

### POST /projects

Create a new project.

**Request:**
```json
{
  "title": "Q1 Feature Launch",
  "type": "feature_announcement",
  "templateId": null
}
```

**Response `201`:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Q1 Feature Launch",
    "type": "feature_announcement",
    "status": "draft",
    "shareId": "clh4x2y0z0000abc",
    "scenes": [],
    "settings": {
      "aspectRatio": "16:9",
      "defaultDurationMs": 3000,
      "backgroundColor": "#0c0d14"
    },
    "createdAt": "2026-06-24T10:00:00.000Z"
  }
}
```

**Errors:** `422` project limit reached (FREE plan: max 3)

---

### GET /projects/:id

Get a project with all its scenes.

**Response `200`:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Q1 Feature Launch",
    "type": "feature_announcement",
    "status": "draft",
    "thumbnailUrl": "...",
    "shareId": "clh4x2y0z0000abc",
    "settings": { "aspectRatio": "16:9", "defaultDurationMs": 3000 },
    "scenes": [
      {
        "id": "uuid",
        "orderIndex": 0,
        "title": "Overview",
        "durationMs": 3000,
        "layers": [],
        "transition": { "type": "none", "durationMs": 0 },
        "settings": {},
        "thumbnailUrl": "...",
        "updatedAt": "2026-06-24T11:00:00.000Z"
      }
    ],
    "createdAt": "2026-06-24T10:00:00.000Z",
    "updatedAt": "2026-06-24T11:00:00.000Z"
  }
}
```

---

### PATCH /projects/:id

Update project metadata.

**Request (all fields optional):**
```json
{
  "title": "Q1 Feature Launch — Final",
  "status": "published",
  "settings": { "aspectRatio": "16:9", "backgroundColor": "#1a1b2e" }
}
```

**Response `200`:** Updated project (without scenes array).

---

### DELETE /projects/:id

Soft-delete a project.

**Response `204`:** Empty.

---

### POST /projects/:id/duplicate

Deep clone a project (metadata + all scenes + all layer data).

**Response `201`:** New project object with new ID.

---

## 5. Scenes

### GET /projects/:projectId/scenes

List scenes ordered by `order_index`.

**Response `200`:**
```json
{
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "orderIndex": 0,
      "title": "Step 1: Dashboard",
      "durationMs": 3000,
      "layers": [
        {
          "id": "layer-local-uuid",
          "type": "media",
          "name": "Screenshot",
          "visible": true,
          "locked": false,
          "zIndex": 0,
          "startMs": null,
          "endMs": null,
          "transform": {
            "x": 0, "y": 0, "width": 100, "height": 100,
            "rotation": 0, "opacity": 1,
            "scaleX": 1, "scaleY": 1,
            "flipX": false, "flipY": false
          },
          "animation": {
            "in": { "type": "none", "durationMs": 0, "delayMs": 0 },
            "out": { "type": "none", "durationMs": 0, "delayMs": 0 },
            "loop": null
          },
          "content": {
            "mediaAssetId": "uuid",
            "url": "https://cdn.demoflow.io/...",
            "objectFit": "contain",
            "cornerRadius": 0
          }
        }
      ],
      "transition": { "type": "fade", "durationMs": 300, "easing": "ease-out" },
      "settings": { "backgroundColor": null },
      "thumbnailUrl": "...",
      "updatedAt": "2026-06-24T11:00:00.000Z"
    }
  ]
}
```

---

### POST /projects/:projectId/scenes

Create a new scene.

**Request:**
```json
{
  "title": "Step 1: Dashboard",
  "durationMs": 3000,
  "orderIndex": 0,
  "layers": [],
  "transition": { "type": "none", "durationMs": 0 },
  "settings": {}
}
```

**Response `201`:** New scene object.

---

### PATCH /projects/:projectId/scenes/:sceneId

Update a scene. This is the **primary auto-save endpoint** — called every 3 seconds when scene is dirty.

**Request (all fields optional):**
```json
{
  "title": "Step 1: Dashboard Overview",
  "durationMs": 4500,
  "layers": [],
  "transition": { "type": "fade", "durationMs": 400, "easing": "ease-out" },
  "settings": { "backgroundColor": "#1a1b2e" },
  "thumbnailUrl": "data:image/jpeg;base64,..."
}
```

**Response `200`:** Updated scene object.

**Notes:** `thumbnailUrl` accepts base64 data URL from canvas snapshot — server stores it to R2.

---

### DELETE /projects/:projectId/scenes/:sceneId

**Response `204`:** Empty.

---

### POST /projects/:projectId/scenes/reorder

Bulk update scene order after drag-and-drop.

**Request:**
```json
{
  "order": [
    { "id": "scene-uuid-1", "orderIndex": 0 },
    { "id": "scene-uuid-2", "orderIndex": 1 },
    { "id": "scene-uuid-3", "orderIndex": 2 }
  ]
}
```

**Response `200`:**
```json
{ "data": { "updated": 3 } }
```

---

## 6. Media

### POST /media/upload

Upload a media file. `Content-Type: multipart/form-data`

**Request fields:**
```
file:  Binary file data
name:  "dashboard-screenshot.png" (optional)
```

**Response `201`:**
```json
{
  "data": {
    "id": "uuid",
    "type": "screenshot",
    "filename": "a1b2c3d4.png",
    "originalName": "dashboard-screenshot.png",
    "mimeType": "image/png",
    "url": "https://cdn.demoflow.io/workspaces/uuid/a1b2c3d4.png",
    "thumbnailUrl": "https://cdn.demoflow.io/workspaces/uuid/thumb_a1b2c3d4.jpg",
    "fileSizeBytes": 524288,
    "width": 1920,
    "height": 1080,
    "durationMs": null,
    "processingStatus": "ready",
    "createdAt": "2026-06-24T10:00:00.000Z"
  }
}
```

**Errors:** `413` file too large · `415` unsupported type · `422` storage limit exceeded

---

### GET /media

List workspace media assets.

**Query params:** `page` `limit` `sort` `order` `type` `search`

**Response `200`:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "screenshot",
      "originalName": "dashboard.png",
      "url": "...",
      "thumbnailUrl": "...",
      "fileSizeBytes": 524288,
      "width": 1920,
      "height": 1080,
      "durationMs": null,
      "processingStatus": "ready",
      "aiAnalyzed": true,
      "createdAt": "2026-06-24T10:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 42, "hasMore": true }
}
```

---

### GET /media/:id

Get a single media asset with full metadata.

**Response `200`:** Full media asset object including `metadata` JSON field.

---

### DELETE /media/:id

Soft-delete media asset. Queues storage object deletion.

**Response `204`:** Empty.

---

### POST /media/:id/analyze

Queue an AI analysis job for a media asset.

**Response `202`:**
```json
{
  "data": {
    "analysisId": "uuid",
    "status": "queued",
    "estimatedSeconds": 45
  }
}
```

**Errors:** `422` AI analysis limit reached · `422` already being analyzed · `503` AI provider offline

---

### GET /media/:id/analysis

Get AI analysis status and results. Used for polling (every 3s).

**Response `200`:**
```json
{
  "data": {
    "id": "uuid",
    "mediaAssetId": "uuid",
    "status": "completed",
    "provider": "ollama",
    "model": "qwen2.5-vl:7b",
    "processingMs": 12400,
    "suggestions": {
      "confidence": 0.87,
      "title": "Analytics Dashboard Overview",
      "description": "A comprehensive view of your monthly performance metrics...",
      "suggestedDurationMs": 15000,
      "tags": ["analytics", "dashboard", "metrics"],
      "steps": [
        {
          "index": 0,
          "title": "Navigate to Analytics",
          "description": "Click the Analytics tab in the left sidebar",
          "durationMs": 3000,
          "zoomArea": { "x": 0, "y": 0.1, "width": 0.15, "height": 0.8 },
          "highlightAreas": [
            {
              "area": { "x": 0.02, "y": 0.35, "width": 0.11, "height": 0.05 },
              "label": "Analytics menu item",
              "style": "circle"
            }
          ],
          "callout": "Click here to access your analytics",
          "cursorPosition": { "x": 0.07, "y": 0.37 }
        }
      ]
    },
    "createdAt": "2026-06-24T10:00:00.000Z",
    "completedAt": "2026-06-24T10:00:12.000Z"
  }
}
```

**Status values:** `queued` | `processing` | `completed` | `failed`

---

## 7. AI

### GET /ai/providers

Get available AI providers and their health status.

**Response `200`:**
```json
{
  "data": [
    {
      "id": "ollama",
      "name": "Ollama (Local)",
      "isActive": true,
      "isAvailable": true,
      "model": "qwen2.5-vl:7b",
      "endpoint": "http://localhost:11434",
      "lastCheckedAt": "2026-06-24T10:00:00.000Z"
    }
  ]
}
```

---

### POST /ai/generate-copy

Generate text content for a scene given context. **v1.5+**

**Request:**
```json
{
  "context": "Analytics dashboard showing monthly revenue chart",
  "type": "scene_title",
  "tone": "professional"
}
```

**Response `200`:**
```json
{
  "data": {
    "text": "Revenue Performance at a Glance",
    "alternatives": ["Monthly Revenue Dashboard", "Track Your Revenue Metrics"]
  }
}
```

---

## 8. Export

### POST /export

Create and queue an export job.

**Request:**
```json
{
  "projectId": "uuid",
  "format": "mp4",
  "settings": {
    "resolution": { "width": 1920, "height": 1080 },
    "fps": 30,
    "quality": "standard",
    "audio": { "enabled": false }
  }
}
```

**Response `202`:**
```json
{
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "format": "mp4",
    "status": "queued",
    "progressPercent": 0,
    "settings": {},
    "createdAt": "2026-06-24T10:00:00.000Z"
  }
}
```

**Errors:**
- `422` export limit reached (FREE: 5/month)
- `422` format not available on plan (GIF requires PRO+)
- `422` project has no scenes
- `422` another export already in progress for this project

---

### GET /export/:id

Poll export job status. Call every 3 seconds during active export.

**Response `200`:**
```json
{
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "format": "mp4",
    "status": "processing",
    "progressPercent": 67,
    "currentPhase": "encoding",
    "outputUrl": null,
    "fileSizeBytes": null,
    "errorMessage": null,
    "startedAt": "2026-06-24T10:01:00.000Z",
    "completedAt": null,
    "expiresAt": "2026-07-01T10:01:00.000Z"
  }
}
```

**Status values:** `queued` | `processing` | `completed` | `failed` | `cancelled` | `expired`
**Phase values:** `rendering` | `encoding` | `uploading`

**When completed:**
```json
{
  "data": {
    "status": "completed",
    "progressPercent": 100,
    "outputUrl": "https://cdn.demoflow.io/exports/uuid.mp4",
    "fileSizeBytes": 15728640,
    "completedAt": "2026-06-24T10:02:15.000Z"
  }
}
```

---

### GET /export/:id/download

Get a short-lived presigned download URL (valid 1 hour).

**Response `200`:**
```json
{
  "data": {
    "downloadUrl": "https://r2.demoflow.io/exports/uuid.mp4?X-Amz-Expires=3600&...",
    "expiresAt": "2026-06-24T11:00:00.000Z",
    "filename": "q1-feature-launch.mp4",
    "fileSizeBytes": 15728640
  }
}
```

---

### GET /projects/:projectId/exports

List export history for a project.

**Response `200`:**
```json
{
  "data": [
    {
      "id": "uuid",
      "format": "mp4",
      "status": "completed",
      "outputUrl": "...",
      "fileSizeBytes": 15728640,
      "settings": { "resolution": { "width": 1920, "height": 1080 } },
      "createdAt": "2026-06-24T10:00:00.000Z",
      "completedAt": "2026-06-24T10:02:15.000Z"
    }
  ],
  "meta": { "total": 8 }
}
```

---

## 9. Sharing

### GET /projects/:projectId/share

Get current share settings.

**Response `200`:**
```json
{
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "shareId": "clh4x2y0z0000abc",
    "shareUrl": "https://demoflow.io/demo/clh4x2y0z0000abc",
    "isPublic": false,
    "hasPassword": false,
    "allowDownload": false,
    "showBranding": true,
    "customCtaText": null,
    "customCtaUrl": null,
    "viewCount": 142,
    "expiresAt": null,
    "updatedAt": "2026-06-24T10:00:00.000Z"
  }
}
```

---

### PATCH /projects/:projectId/share

Update share settings.

**Request (all fields optional):**
```json
{
  "isPublic": true,
  "password": "secret123",
  "allowDownload": false,
  "showBranding": false,
  "expiresAt": null,
  "customCtaText": "Book a Demo",
  "customCtaUrl": "https://calendly.com/myteam"
}
```

**Response `200`:** Updated share object.

**Notes:**
- `password: null` removes the password
- `showBranding: false` requires PRO plan
- Project must be `published` for `isPublic: true`
- `customCtaText/Url` requires PRO plan

---

## 10. Billing

### GET /billing/plans

List available plans. **Public endpoint.**

**Response `200`:**
```json
{
  "data": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "currency": "usd",
      "interval": null,
      "features": {
        "maxProjects": 3,
        "maxExportsPerMonth": 5,
        "maxAiAnalysesPerMonth": 10,
        "maxStorageBytes": 524288000,
        "canExportGif": false,
        "canRemoveWatermark": false,
        "maxResolutionPx": 1280
      }
    },
    {
      "id": "pro",
      "name": "Pro",
      "price": 2900,
      "currency": "usd",
      "interval": "month",
      "stripePriceId": "price_...",
      "features": {
        "maxProjects": null,
        "maxExportsPerMonth": null,
        "maxAiAnalysesPerMonth": null,
        "maxStorageBytes": 10737418240,
        "canExportGif": true,
        "canRemoveWatermark": true,
        "maxResolutionPx": 1920
      }
    }
  ]
}
```

---

### POST /billing/checkout

Create a Stripe Checkout session for plan upgrade.

**Request:**
```json
{
  "planId": "pro",
  "successUrl": "https://app.demoflow.io/settings/billing?success=true",
  "cancelUrl": "https://app.demoflow.io/settings/billing"
}
```

**Response `200`:**
```json
{
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/pay/cs_live_..."
  }
}
```

**Notes:** Client redirects to `checkoutUrl`. No embedded Stripe UI in MVP.

---

### POST /billing/portal

Create a Stripe Customer Portal session (invoices, cancel, update card).

**Response `200`:**
```json
{
  "data": {
    "portalUrl": "https://billing.stripe.com/session/..."
  }
}
```

---

### POST /billing/webhook

Stripe webhook receiver. **Public, no auth.** Verified via `Stripe-Signature` header.

**Handled events:**
```
customer.subscription.created   → activate plan
customer.subscription.updated   → update plan / status
customer.subscription.deleted   → downgrade to free
invoice.payment_failed          → mark subscription past_due
invoice.payment_succeeded       → confirm active
```

**Response:** Always `200` with `{ "received": true }`. Stripe retries on non-2xx.

---

### GET /billing/subscription

Get current workspace subscription status.

**Response `200`:**
```json
{
  "data": {
    "plan": "pro",
    "status": "active",
    "currentPeriodEnd": "2026-07-24T10:00:00.000Z",
    "cancelAt": null,
    "paymentMethodLast4": "4242",
    "paymentMethodBrand": "visa"
  }
}
```

---

## 11. Settings

### PATCH /settings/profile

Update current user's profile.

**Request:**
```json
{
  "name": "Andrii D.",
  "avatarUrl": "https://cdn.demoflow.io/avatars/uuid.jpg"
}
```

**Response `200`:** Updated user object.

---

### POST /settings/change-password

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response `200`:**
```json
{ "data": { "message": "Password changed successfully." } }
```

**Errors:** `400` current password incorrect · `400` new password too weak

---

### GET /settings/ai

Get AI provider configuration for this workspace.

**Response `200`:**
```json
{
  "data": {
    "activeProvider": "ollama",
    "providers": [
      {
        "id": "ollama",
        "name": "Ollama (Local)",
        "endpoint": "http://localhost:11434",
        "model": "qwen2.5-vl:7b",
        "isAvailable": true,
        "lastCheckedAt": "2026-06-24T10:00:00.000Z"
      }
    ]
  }
}
```

---

### PATCH /settings/ai

**Request:**
```json
{
  "ollamaEndpoint": "http://localhost:11434",
  "ollamaModel": "qwen2.5-vl:7b"
}
```

**Response `200`:** Updated AI config + connection test result.

---

### POST /settings/ai/test

Test connection to configured AI provider.

**Response `200`:**
```json
{
  "data": {
    "connected": true,
    "provider": "ollama",
    "model": "qwen2.5-vl:7b",
    "responseTimeMs": 234,
    "error": null
  }
}
```

---

## 12. Public Endpoints

These endpoints require **no authentication**.

### GET /public/demo/:shareId

Get public demo data for the player page.

**Response `200`:**
```json
{
  "data": {
    "project": {
      "title": "Q1 Feature Launch",
      "type": "feature_announcement"
    },
    "share": {
      "shareId": "clh4x2y0z0000abc",
      "hasPassword": false,
      "allowDownload": false,
      "showBranding": true,
      "customCtaText": null,
      "customCtaUrl": null,
      "expiresAt": null
    },
    "scenes": [
      {
        "id": "uuid",
        "orderIndex": 0,
        "durationMs": 3000,
        "layers": [],
        "transition": { "type": "fade", "durationMs": 300 },
        "settings": {}
      }
    ]
  }
}
```

**Errors:**
- `404` share not found or `isPublic: false`
- `410` share link has expired
- `403` password required — returns 403 without scene data (only `share.hasPassword: true`)

---

### POST /public/demo/:shareId/verify-password

**Request:**
```json
{ "password": "secret123" }
```

**Response `200`:**
```json
{ "data": { "viewerToken": "short-lived-viewer-token" } }
```

Client passes token as `X-Demo-Token` header on the subsequent GET request.

**Errors:** `403` incorrect password

---

### POST /public/demo/:shareId/view

Record a view event. Fire-and-forget from the player.

**Request:**
```json
{ "sessionId": "client-generated-uuid" }
```

**Response `200`:**
```json
{ "data": { "recorded": true } }
```

---

### GET /public/plans

Public plan listing for the pricing page. Same data as `/billing/plans` but no auth.

---

### GET /health

System health check.

**Response `200`:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-24T10:00:00.000Z",
  "services": {
    "database": "ok",
    "storage": "ok",
    "ai": "ok"
  }
}
```

---

## 13. Error Reference

### Error Codes

| Code | HTTP | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Request body failed validation |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `TOKEN_EXPIRED` | 401 | JWT or refresh token expired |
| `TOKEN_INVALID` | 401 | Token malformed or tampered |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource does not exist |
| `SHARE_EXPIRED` | 410 | Share link has passed its expiry |
| `ALREADY_EXISTS` | 409 | Duplicate (email, slug) |
| `PLAN_LIMIT_REACHED` | 422 | Feature or quota limit hit |
| `STORAGE_LIMIT_REACHED` | 422 | Workspace storage full |
| `UNSUPPORTED_FILE_TYPE` | 415 | File MIME type not accepted |
| `FILE_TOO_LARGE` | 413 | File exceeds plan size limit |
| `AI_UNAVAILABLE` | 503 | Ollama / AI provider not reachable |
| `EXPORT_IN_PROGRESS` | 422 | Project already has an active export |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### Rate Limits

| Endpoint Group | Limit |
|---|---|
| Auth (login, register) | 10 requests / 15 min per IP |
| Password reset | 3 requests / 60 min per email |
| Media upload | 50 uploads / hour per workspace |
| AI analyze | 20 requests / hour per workspace |
| Export | 10 jobs / hour per workspace |
| All other authenticated | 300 requests / min per user |
| All other unauthenticated | 60 requests / min per IP |

---

## 14. MVP vs Future Endpoints

### MVP — Build These (Weeks 1–8)

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/reset-password
GET    /auth/me

GET    /workspace
PATCH  /workspace

GET    /projects
POST   /projects
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id
POST   /projects/:id/duplicate

GET    /projects/:id/scenes
POST   /projects/:id/scenes
PATCH  /projects/:id/scenes/:sid
DELETE /projects/:id/scenes/:sid
POST   /projects/:id/scenes/reorder

POST   /media/upload
GET    /media
GET    /media/:id
DELETE /media/:id
POST   /media/:id/analyze
GET    /media/:id/analysis

GET    /ai/providers

POST   /export
GET    /export/:id
GET    /export/:id/download
GET    /projects/:id/exports

GET    /projects/:id/share
PATCH  /projects/:id/share

GET    /billing/plans
POST   /billing/checkout
POST   /billing/webhook
GET    /billing/subscription

PATCH  /settings/profile
POST   /settings/change-password
GET    /settings/ai
PATCH  /settings/ai
POST   /settings/ai/test

GET    /public/demo/:shareId
POST   /public/demo/:shareId/view
GET    /public/plans
GET    /health
```

**Total: 38 endpoints.**

---

### v1.0 — Add With Teams (Weeks 9–11)

```
GET    /workspace/members
POST   /workspace/members/invite
PATCH  /workspace/members/:memberId
DELETE /workspace/members/:memberId
POST   /workspace/members/accept-invite
GET    /templates
GET    /templates/:id
POST   /projects/from-template
POST   /billing/portal
POST   /public/demo/:shareId/verify-password
```

---

### v1.5 — Growth Phase (Weeks 12–17)

```
POST   /settings/avatar/upload
GET    /projects/:id/share/analytics
POST   /ai/generate-copy
GET    /billing/invoices
```

---

### v2.0 — Enterprise (Weeks 18–30)

```
GET    /admin/*
GET    /api-keys
POST   /projects/:id/comments
GET    /projects/:id/history
POST   /auth/sso/saml
GET    /analytics/workspace
```

---

*Last updated: 2026-06-24*
*This document is the single source of truth for all API contracts.*
*Update it BEFORE implementation, not after.*
