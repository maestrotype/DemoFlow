import { Component } from '@angular/core';
import { RecentProjectsComponent } from '../../widgets/recent-projects/recent-projects';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RecentProjectsComponent],
  template: `
    <div class="dashboard-page">
      <header class="page-header">
        <h1>Dashboard</h1>
      </header>
      <app-recent-projects></app-recent-projects>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-6, 24px);
    }
    .page-header h1 {
      font-size: var(--text-3xl, 30px);
      font-weight: 700;
    }
  `]
})
export class DashboardPageComponent {}
