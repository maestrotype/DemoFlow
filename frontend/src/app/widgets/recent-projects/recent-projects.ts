import { Component, signal } from '@angular/core';
import { ProjectCardComponent } from '../../entities/project/project-card/project-card';
import { Project } from '../../entities/project/project.model';

@Component({
  selector: 'app-recent-projects',
  standalone: true,
  imports: [ProjectCardComponent],
  template: `
    <section class="recent-projects">
      <h3>Recent Projects</h3>
      <div class="projects-grid">
        @for (project of projects(); track project.id) {
          <app-project-card [project]="project"></app-project-card>
        } @empty {
          <div class="empty-state">
            <p>No recent projects found.</p>
            <button class="create-btn">Create first demo</button>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .recent-projects {
      display: flex;
      flex-direction: column;
      gap: var(--space-4, 16px);
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-4, 16px);
    }
    .empty-state {
      grid-column: 1 / -1;
      padding: var(--space-10, 40px);
      text-align: center;
      background: var(--color-bg-surface, #16182a);
      border: 1px dashed var(--color-border, #20222f);
      border-radius: var(--radius-md, 10px);
    }
  `]
})
export class RecentProjectsComponent {
  // Empty mock projects list for skeleton
  projects = signal<Project[]>([]);
}
