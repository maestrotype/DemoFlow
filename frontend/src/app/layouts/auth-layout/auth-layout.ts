import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <!-- Centered glassmorphic card container for Auth page widgets -->
      <main class="auth-container">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .auth-layout {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--color-bg-base, #0c0d14);
    }
    .auth-container {
      width: 100%;
      max-width: 440px;
      padding: var(--space-6, 24px);
    }
  `]
})
export class AuthLayoutComponent {}
