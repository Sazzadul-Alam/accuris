import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent {
  setPasswordForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength: number = 0; // 0 = none, 1 = weak, 2 = medium, 3 = strong
  passwordsMatch = true;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.setPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  // Toggle password visibility for Create Password field
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Toggle password visibility for Re-Enter Password field
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Check password strength
  checkPasswordStrength(): void {
    const password = this.setPasswordForm.get('password')?.value || '';
    
    if (password.length === 0) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;
    
    // Check length
    if (password.length >= 8) strength++;
    
    // Check for numbers and letters
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    
    // Check for special characters and numbers
    if (/[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    this.passwordStrength = Math.max(1, strength); // Minimum 1 if there's any password
    
    // Check if passwords match
    this.checkPasswordsMatch();
  }

  // Check if passwords match
  checkPasswordsMatch(): void {
    const password = this.setPasswordForm.get('password')?.value;
    const confirmPassword = this.setPasswordForm.get('confirmPassword')?.value;
    
    if (confirmPassword.length > 0) {
      this.passwordsMatch = password === confirmPassword;
    } else {
      this.passwordsMatch = true;
    }
  }

  // Check if form is valid and passwords match
  isFormValid(): boolean {
    return this.setPasswordForm.valid && 
           this.passwordsMatch && 
           this.setPasswordForm.get('password')?.value === this.setPasswordForm.get('confirmPassword')?.value;
  }

  // Submit form
  onSubmit(): void {
    if (this.isFormValid()) {
      console.log('Password set successfully!');
      // Handle password reset logic here
      // After successful password reset, redirect to login
      this.router.navigate(['/login']);
    }
  }

  // Navigate to login page
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Return to home
  returnHome(): void {
    this.router.navigate(['/']);
  }
}