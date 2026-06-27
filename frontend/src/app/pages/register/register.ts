import { Component } from '@angular/core';
import { AuthFormComponent } from '../../features/auth-form/auth-form';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [AuthFormComponent, RouterLink],
  template: `
    <div class="register-page">
      <h2>Create Account</h2>
      <app-auth-form mode="register"></app-auth-form>
      <div class="auth-links">
        <a routerLink="/auth/login">Already have an account? Sign in</a>
      </div>
    </div>
  `,
  styles: [`
    .register-page {
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
      justify-content: center;
    }
  `]
})
export class RegisterPageComponent {}
