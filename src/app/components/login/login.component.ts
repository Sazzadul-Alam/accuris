import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "../../services/auth-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword = false;
  isEmpty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isEmpty = false;
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      alert('Please fill in all required fields correctly');
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;

    // PHASE 1: Login with email/password
    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        // Navigate to two-factor-auth page
        console.log('Password verification successful:', res);
        this.router.navigate(['/two-step-verification'], {
          state: { email, rememberMe, password }
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Login failed:', err);
        if (err.status === 401) {
          alert('Invalid credentials. Please try again.');
        } else if (err.status === 403) {
          alert('Account is locked or disabled.');
        } else {
          alert('An error occurred while logging in. Please try again later.');
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  forgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  returnHome(): void {
    this.router.navigate(['/']);
  }

  navigateToLogin(): void {
    console.log('Navigate to login clicked');
  }

  loginWithGoogle(): void {
    alert('Google login not implemented yet.');
  }

  loginWithMicrosoft(): void {
    alert('Microsoft login not implemented yet.');
  }
}
