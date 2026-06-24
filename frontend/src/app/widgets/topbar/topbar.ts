import { Component } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="topbar">
      <div class="search-bar">Search projects...</div>
      <div class="user-profile">Workspace Profile</div>
    </header>
  `,
  styles: [`
    .topbar {
      height: 64px;
      background: var(--color-bg-elevated, #10111c);
      border-bottom: 1px solid var(--color-border, #20222f);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-6, 24px);
    }
    .search-bar {
      color: var(--color-text-muted, #5c6480);
    }
  `]
})
export class TopbarComponent {}
