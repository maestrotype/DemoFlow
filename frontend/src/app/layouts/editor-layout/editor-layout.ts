import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-editor-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="editor-layout">
      <!-- Dedicated full-screen layout for the project scene editor -->
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .editor-layout {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: var(--color-bg-base, #0c0d14);
      color: var(--color-text-primary, #f0f0f7);
    }
  `]
})
export class EditorLayoutComponent {}
