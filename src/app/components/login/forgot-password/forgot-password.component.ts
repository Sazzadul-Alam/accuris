import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      console.log('Password reset requested for:', this.forgotPasswordForm.value.email);
      // Add your password reset logic here
      alert('Password reset link sent to your email!');
      this.router.navigate(['/login']);
    }
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  returnHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  loginWithGoogle() {
    console.log('Google login clicked');
    // Add Google login logic
  }

  loginWithMicrosoft() {
    console.log('Microsoft login clicked');
    // Add Microsoft login logic
  }

}
