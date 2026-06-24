import { Component } from '@angular/core';
import { AuthFormComponent } from '../../features/auth-form/auth-form';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AuthFormComponent],
  template: `
    <div class="login-page">
      <h2>Welcome Back</h2>
      <app-auth-form mode="login"></app-auth-form>
      <div class="auth-links">
        <a href="/auth/register">Don't have an account? Sign up</a>
        <a href="/auth/forgot-password">Forgot password?</a>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      background: var(--color-bg-surface, #16182a);
      border: 1px solid var(--color-border, #20222f);
      border-radius: var(--radius-md, 10px);
      padding: var(--space-6, 24px);
    }
    h2 {
      margin-bottom: var(--space-4, 16px);
      text-align: center;
    }
    .auth-links {
      margin-top: var(--space-4, 16px);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2, 8px);
    }
  `]
})
export class LoginPageComponent {}
