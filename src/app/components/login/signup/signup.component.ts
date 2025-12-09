import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      agreeTerms: [false, Validators.requiredTrue]
    });
  }

  checkPasswordStrength() {
    const password = this.signupForm.get('password')?.value || '';
    
    if (password.length === 0) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;
    
    // Weak: length >= 6
    if (password.length >= 6) {
      strength = 1;
    }
    
    // Medium: length >= 8 and contains numbers
    if (password.length >= 8 && /\d/.test(password)) {
      strength = 2;
    }
    
    // Strong: length >= 8, contains numbers, uppercase, and special characters
    if (
      password.length >= 8 &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      strength = 3;
    }
    
    this.passwordStrength = strength;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
  if (this.signupForm.valid) {
    console.log('Signup form submitted:', this.signupForm.value);
    // Navigate to 2FA page
    this.router.navigate(['/two-factor-auth']);
  }
}

  signupWithGoogle() {
    console.log('Google signup clicked');
    // Add Google signup logic
  }

  signupWithMicrosoft() {
    console.log('Microsoft signup clicked');
    // Add Microsoft signup logic
  }

  returnHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}