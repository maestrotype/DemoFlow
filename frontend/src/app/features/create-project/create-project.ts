import { Component } from '@angular/core';

@Component({
  selector: 'app-create-project',
  standalone: true,
  template: `
    <div class="create-project-trigger">
      <button class="trigger-btn">Create New Project</button>
    </div>
  `,
  styles: [`
    .trigger-btn {
      padding: var(--space-2, 8px) var(--space-4, 16px);
      background: var(--color-accent, #7c5ce7);
      color: white;
      border: none;
      border-radius: var(--radius-sm, 6px);
      cursor: pointer;
    }
  `]
})
export class CreateProjectComponent {}
