import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.interface';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NotificationComponent],
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            [(ngModel)]="registerData.email"
            required
            email
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="registerData.password"
            required
            minlength="6"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            [(ngModel)]="registerData.confirmPassword"
            required
          />
        </div>
        <button type="submit" [disabled]="!registerForm.form.valid || registerData.password !== registerData.confirmPassword">
          Register
        </button>
      </form>
      <div class="links-container">
        <p class="redirect-text">Already have an account? <a routerLink="/login">Login here</a></p>
        <a routerLink="/books" class="back-link">← Back to Main Page</a>
      </div>
    </div>
    <app-notification></app-notification>
  `,
  styles: [`
    .register-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .form-group input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #0056b3;
    }
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .redirect-text {
      margin-top: 1rem;
      text-align: center;
    }
    .redirect-text a {
      color: #007bff;
      text-decoration: none;
    }
    .redirect-text a:hover {
      text-decoration: underline;
    }
    .links-container {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .back-link {
      color: #6c757d;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }
    .back-link:hover {
      color: #343a40;
    }
  `]
})
export class RegisterComponent {
  @ViewChild(NotificationComponent) notification!: NotificationComponent;

  registerData: RegisterRequest = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.notification.showNotification({
        message: 'Passwords do not match',
        type: 'error'
      });
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.notification.showNotification({
          message: response.message || 'Registration successful!',
          type: 'success'
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (error) => {
        this.notification.showNotification({
          message: error.error?.message || 'Registration failed. Please try again.',
          type: 'error'
        });
      }
    });
  }
} 