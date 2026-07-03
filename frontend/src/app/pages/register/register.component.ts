import { Component } from '@angular/core';
import { AuthFormComponent } from '../../features/auth-form';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [AuthFormComponent, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterPageComponent {}

