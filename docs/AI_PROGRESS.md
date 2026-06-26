# AI Progress — DemoFlow

## Architecture
- Angular 21 (Standalone Components)
- Feature-Sliced Design (FSD)
- SSR enabled
- NestJS backend

## Completed
- Workspace architecture created
- Auth layouts created
- Editor layouts created
- Sidebar / Topbar / RecentProjects widgets
- Project structure aligned with FSD
- SSR configuration cleaned
- Routing restored after broken app.routes.ts
- SSR prerender fixed for dynamic routes using mixed rendering mode (Prerender + Server)

## Current Status
SSR build succeeds with mixed rendering mode:
- Static routes (`/`, `/dashboard`, `/projects`) use Prerender for SEO benefits
- Dynamic routes (`/projects/:id/editor`, `/demo/:shareId`) use Server rendering
- Auth routes and fallback routes use Server rendering
## History
2026-06-26 — Created docs/AI_PROGRESS.md (this file)
2026-06-26 — Fixed SSR prerender failures for dynamic routes using mixed rendering mode

