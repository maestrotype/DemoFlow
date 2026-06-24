import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../widgets/sidebar/sidebar';
import { TopbarComponent } from '../../widgets/topbar/topbar';

@Component({
  selector: 'app-workspace-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="workspace-layout">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-topbar></app-topbar>
        <main class="page-container">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .workspace-layout {
      display: flex;
      height: 100vh;
      background: var(--color-bg-base, #0c0d14);
      color: var(--color-text-primary, #f0f0f7);
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .page-container {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-6, 24px);
    }
  `]
})
export class WorkspaceLayoutComponent {}
