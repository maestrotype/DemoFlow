import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { AuthFormMode } from './auth-form.types';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthFormComponent {
  mode = input<AuthFormMode>('login');

  onSubmit(event: Event): void {
    event.preventDefault();
  }
}
