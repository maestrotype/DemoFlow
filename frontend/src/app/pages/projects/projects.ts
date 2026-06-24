import { Component } from '@angular/core';
import { RecentProjectsComponent } from '../../widgets/recent-projects/recent-projects';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [RecentProjectsComponent],
  template: `
    <div class="projects-page">
      <header class="page-header">
        <h1>All Projects</h1>
        <button class="create-btn">New Project</button>
      </header>
      <app-recent-projects></app-recent-projects>
    </div>
  `,
  styles: [`
    .projects-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-6, 24px);
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .page-header h1 {
      font-size: var(--text-3xl, 30px);
      font-weight: 700;
    }
    .create-btn {
      padding: var(--space-2, 8px) var(--space-4, 16px);
      border-radius: var(--radius-sm, 6px);
      border: none;
      background: var(--color-accent, #7c5ce7);
      color: white;
      font-weight: 500;
      cursor: pointer;
    }
  `]
})
export class ProjectsPageComponent {}
