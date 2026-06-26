import { Routes } from '@angular/router';
export const routes: Routes = [
  // Redirect root to dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Auth Zone (wrapped in AuthLayout)
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.LoginPageComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register').then(m => m.RegisterPageComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPasswordPageComponent)
      }
    ]
  },

  // Workspace Zone (wrapped in WorkspaceLayout)
  {
    path: '',
    loadComponent: () => import('./layouts/workspace-layout/workspace-layout').then(m => m.WorkspaceLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardPageComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./pages/projects/projects').then(m => m.ProjectsPageComponent)
      }
    ]
  },

  // Editor Zone (wrapped in EditorLayout)
  {
    path: 'projects/:id/editor',
    loadComponent: () => import('./layouts/editor-layout/editor-layout').then(m => m.EditorLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/editor/editor').then(m => m.EditorPageComponent)
      }
    ] as const,
  },

  // Public Player Zone
  {
    path: 'demo/:shareId',
    loadComponent: () => import('./pages/player/player').then(m => m.PlayerPageComponent),
  },

  // Fallback redirect
  { path: '**', redirectTo: 'dashboard' }
];

