import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-main-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="centered-container title-section">
      <div class="auth-dark-top-text">Account Log In</div>
      <div class="auth-light-top-text">PLEASE LOGIN TO CONTINUE TO YOUR ACCOUNT</div>
    </div>

    <form class="centered-container simple-signup-form" [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()">

      <!-- Email Address -->
      <input class="auth-input-field" type="email" placeholder="Email Address" formControlName="email">

      <!-- Password Input -->
      <div class="password-group">
        <div class="password-input-wrapper">
          <input class="auth-input-field" 
                 [type]="showPassword ? 'text' : 'password'" 
                 placeholder="Password"
                 formControlName="password">
          <!-- Note: Image sources should point to your local assets -->
          <img class="password-toggle-icon"
               [src]="showPassword ? 'assets/images/auth/password-shown.png' : 'assets/images/auth/password-hidden.png'"
               alt="Toggle Password" 
               (click)="togglePasswordVisibility()">
        </div>
      </div>
      
      <!-- Remember Me / Forgot Password Row -->
      <div class="auth-options-row">
        
        <!-- Remember Me Checkbox -->
        <div class="remember-me-container">
          <input class="auth-checkbox" type="checkbox" formControlName="rememberMe">
          <span class="remember-me-text">Remember Me</span>
        </div>
        
        <!-- Forgot Password Link -->
        <a class="forgot-password-link" (click)="onForgotPassword()">Forgot Password?</a>
      </div>
      
      <!-- Submit Button -->
      <button class="auth-login-button" type="submit" [disabled]="loginForm.invalid">
        LOG IN
      </button>

      <p class="separator-text">OR</p>

      <!-- Social Login Buttons -->
      <div class="social-buttons-container">
        <button type="button" class="auth-social-login-button">
          <img src="assets/images/auth/google-social.svg" alt="Google">
          Log in with Google
        </button>
        <button type="button" class="auth-social-login-button">
          <img src="assets/images/auth/microsoft-social.svg" alt="Microsoft">
          Log in with Microsoft
        </button>
      </div>
    </form>
  `,
  styleUrl: './login-main-form.component.scss' // Styles loaded from external file
})
export class LoginMainFormComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // Basic password validation
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      console.log('Login Submitted:', this.loginForm.value);
      // Logic for handling login submission
    }
  }

  onForgotPassword() {
    console.log('Forgot Password clicked. You should navigate the user to the reset page.');
  }
}