import { Component } from '@angular/core';
import { AuthFormComponent } from '../../features/auth-form';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [AuthFormComponent, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordPageComponent {}

