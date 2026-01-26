import { Component } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth-service";

@Component({
  selector: 'app-sign-up-parent',
  templateUrl: './sign-up-parent.component.html',
  styleUrls: ['./sign-up-parent.component.css']
})
export class SignUpParentComponent {
  steps: number;
  stepFormData: {
    signup?: any;
    twoFactor?: any;
    consent?: any;
  } = {};

  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.steps = 1;
  }

  returnHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  getFormValue(event: any) {
    switch (this.steps) {
      case 1:
        this.stepFormData.signup = event;
        break;

      case 2:
        this.stepFormData.twoFactor = event;
        break;

      case 3:
        this.stepFormData.consent = event;
        break;
    }
  }

  getStepValue($event: any) {
    console.log("step value from parent: ", $event);

    // If moving from step 1 to step 2, call signup API
    if (this.steps === 1 && $event === 2) {
      this.createAccount();
    } else {
      this.steps = $event;
    }
  }

  // Call signup API when moving to step 2
  createAccount() {
    if (!this.stepFormData.signup) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const signupData = {
      firstName: this.stepFormData.signup.firstName,
      lastName: this.stepFormData.signup.lastName,
      email: this.stepFormData.signup.email,
      password: this.stepFormData.signup.password
    };

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.isLoading = false;

        if (response.status === 'SUCCESS') {
          // Move to step 2 (two-factor verification)
          this.steps = 2;
        } else if (response.status === 'EMAIL_EXISTS') {
          this.errorMessage = 'Email already registered. Please login.';
        } else if (response.status === 'EMAIL_PENDING_VERIFICATION') {
          // User already exists but not verified, move to step 2
          this.steps = 2;
        } else {
          this.errorMessage = response.message || 'Signup failed. Please try again.';
        }
      },
      error: (error) => {
        console.error('Signup error:', error);
        this.isLoading = false;

        if (error.status === 400) {
          this.errorMessage = error.error.message || 'Invalid input. Please check your information.';
        } else if (error.status === 409) {
          this.errorMessage = error.error.message || 'Email already exists.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    });
  }

  signupWithMicrosoft() {
    // Implement Microsoft signup
  }

  signupWithGoogle() {
    // Implement Google signup
  }
}
