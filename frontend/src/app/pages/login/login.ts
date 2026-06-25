import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFormComponent } from '@features/auth-form';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AuthFormComponent, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {}
