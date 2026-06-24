import { Component, input } from '@angular/core';
import { Project } from '../project.model';

@Component({
  selector: 'app-project-card',
  standalone: true,
  template: `
    <div class="project-card">
      <div class="thumbnail">
        @if (project().thumbnailUrl) {
          <img [src]="project().thumbnailUrl" alt="Project preview" />
        } @else {
          <div class="placeholder">16:9 Thumbnail Placeholder</div>
        }
      </div>
      <div class="info">
        <h4>{{ project().title }}</h4>
        <p class="meta">{{ project().sceneCount }} scenes • {{ project().durationMs / 1000 }}s</p>
      </div>
    </div>
  `,
  styles: [`
    .project-card {
      background: var(--color-bg-surface, #16182a);
      border: 1px solid var(--color-border, #20222f);
      border-radius: var(--radius-md, 10px);
      overflow: hidden;
      cursor: pointer;
      transition: transform var(--duration-fast, 150ms) var(--easing-smooth, ease-out);
    }
    .project-card:hover {
      transform: translateY(-2px);
    }
    .placeholder {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: var(--color-bg-subtle, #191b2b);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted, #5c6480);
      font-size: var(--text-xs, 12px);
    }
    .info {
      padding: var(--space-3, 12px);
    }
    h4 {
      margin: 0 0 var(--space-1, 4px) 0;
      font-size: var(--text-base, 14px);
    }
    .meta {
      margin: 0;
      font-size: var(--text-xs, 12px);
      color: var(--color-text-secondary, #96a0b8);
    }
  `]
})
export class ProjectCardComponent {
  project = input.required<Project>();
}
