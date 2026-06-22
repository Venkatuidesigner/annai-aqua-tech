import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isSubmitting = signal(false);
  loginError = signal('');
  showPassword = signal(false);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.loginError.set('');

    const { username, password } = this.form.value;

    setTimeout(() => {
      const success = this.authService.login(username!, password!);
      this.isSubmitting.set(false);

      if (success) {
        this.router.navigate(['/admin']);
      } else {
        this.loginError.set('Invalid username or password. Please try again.');
      }
    }, 800);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
