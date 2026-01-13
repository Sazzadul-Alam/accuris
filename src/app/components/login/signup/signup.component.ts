import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  showPassword = false;
  passwordStrength: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Listen to password changes
    this.signupForm.get('password')?.valueChanges.subscribe(password => {
      this.checkPasswordStrength(password || '');
    });
  }

  checkPasswordStrength(password: string) {
    if (!password || password.length === 0) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;

    // Check password criteria
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    // Calculate final strength (1 = weak, 2 = medium, 3 = strong)
    if (strength <= 2) {
      this.passwordStrength = 1; // Weak
    } else if (strength === 3 || strength === 4) {
      this.passwordStrength = 2; // Medium
    } else {
      this.passwordStrength = 3; // Strong
    }
  }

  getStrengthClass(): string {
    if (this.passwordStrength === 0) return '';
    if (this.passwordStrength === 1) return 'weak';
    if (this.passwordStrength === 2) return 'medium';
    if (this.passwordStrength === 3) return 'strong';
    return '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Signup form submitted:', this.signupForm.value);
      this.router.navigate(['/two-factor-auth']);
    }
  }

  signupWithGoogle() {
    console.log('Google signup clicked');
  }

  signupWithMicrosoft() {
    console.log('Microsoft signup clicked');
  }

  returnHome() {
    this.router.navigate(['/landing']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}