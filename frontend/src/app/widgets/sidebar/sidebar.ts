import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <aside class="sidebar">
      <div class="logo">DemoFlow</div>
      <nav class="nav-links">
        <a href="/dashboard">Dashboard</a>
        <a href="/projects">Projects</a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100vh;
      background: var(--color-bg-elevated, #10111c);
      border-right: 1px solid var(--color-border, #20222f);
      display: flex;
      flex-direction: column;
      padding: var(--space-4, 16px);
    }
    .logo {
      font-size: var(--text-xl, 20px);
      font-weight: 700;
      color: var(--color-text-primary, #f0f0f7);
      margin-bottom: var(--space-8, 32px);
    }
    .nav-links a {
      display: block;
      padding: var(--space-2, 8px) var(--space-3, 12px);
      color: var(--color-text-secondary, #96a0b8);
      text-decoration: none;
      border-radius: var(--radius-sm, 6px);
    }
  `]
})
export class SidebarComponent {}
