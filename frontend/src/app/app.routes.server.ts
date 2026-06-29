import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Root redirect - prerender for SEO
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  
  // Auth Zone - server-side rendering (nested routes with layout)
  {
    path: 'auth',
    renderMode: RenderMode.Server
  },
  {
    path: 'auth/login',
    renderMode: RenderMode.Server
  },
  {
    path: 'auth/register',
    renderMode: RenderMode.Server
  },
  {
    path: 'auth/forgot-password',
    renderMode: RenderMode.Server
  },
  
  // Workspace Zone - prerender static pages
  {
    path: 'dashboard',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projects',
    renderMode: RenderMode.Prerender
  },
  
   // Editor Zone - server-side rendering (dynamic route)
   {
     path: 'projects/:id/editor',
     renderMode: RenderMode.Server
   },
  
  // Public Player Zone - server-side rendering (dynamic route)
  {
    path: 'demo/:shareId',
    renderMode: RenderMode.Server
  },
  
  // Fallback - server-side rendering for unmatched routes
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
