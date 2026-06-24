import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  template: `
    <form class="auth-form" (submit)="onSubmit($event)">
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" placeholder="you@example.com" required />
      </div>
      
      @if (mode !== 'forgot-password') {
        <div class="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" required />
        </div>
      }
      
      <button type="submit" class="submit-btn">
        {{ mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Instructions' }}
      </button>
    </form>
  `,
  styles: [`
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4, 16px);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-1, 4px);
    }
    input {
      padding: var(--space-2, 8px) var(--space-3, 12px);
      border-radius: var(--radius-sm, 6px);
      border: 1px solid var(--color-border, #20222f);
      background: var(--color-bg-base, #0c0d14);
      color: var(--color-text-primary, #f0f0f7);
    }
    .submit-btn {
      padding: var(--space-2, 8px);
      border-radius: var(--radius-sm, 6px);
      border: none;
      background: var(--color-accent, #7c5ce7);
      color: white;
      cursor: pointer;
    }
  `]
})
export class AuthFormComponent {
  @Input() mode: 'login' | 'register' | 'forgot-password' = 'login';
  
  onSubmit(event: Event) {
    event.preventDefault();
  }
}
