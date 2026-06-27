import { Component } from '@angular/core';
import { AuthFormComponent } from '../../features/auth-form/auth-form';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [AuthFormComponent, RouterLink],
  template: `
    <div class="forgot-password-page">
      <h2>Reset Password</h2>
      <p class="description">Enter your email and we will send you password reset instructions.</p>
      <app-auth-form mode="forgot-password"></app-auth-form>
      <div class="auth-links">
        <a routerLink="/auth/login">Back to Sign In</a>
      </div>
    </div>
  `,
  styles: [`
    .forgot-password-page {
      background: var(--color-bg-surface, #16182a);
      border: 1px solid var(--color-border, #20222f);
      border-radius: var(--radius-md, 10px);
      padding: var(--space-6, 24px);
    }
    h2 {
      margin-bottom: var(--space-2, 8px);
      text-align: center;
    }
    .description {
      color: var(--color-text-secondary, #96a0b8);
      font-size: var(--text-sm, 13px);
      text-align: center;
      margin-bottom: var(--space-4, 16px);
    }
    .auth-links {
      margin-top: var(--space-4, 16px);
      display: flex;
      justify-content: center;
    }
  `]
})
export class ForgotPasswordPageComponent {}
