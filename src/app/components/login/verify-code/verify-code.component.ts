import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent implements OnInit {
  verifyCodeForm!: FormGroup;
  email: string = '';
  showCode = false;
  resendTimer = 59;
  canResend = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get email from query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });

    this.verifyCodeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Start countdown timer
    this.startResendTimer();
  }

  startResendTimer() {
    this.canResend = false;
    this.resendTimer = 59;
    
    const interval = setInterval(() => {
      this.resendTimer--;
      
      if (this.resendTimer <= 0) {
        this.canResend = true;
        clearInterval(interval);
      }
    }, 1000);
  }

  toggleCodeVisibility() {
    this.showCode = !this.showCode;
  }

  resendCode() {
    if (this.canResend) {
      console.log('Resending code to:', this.email);
      // Add your resend logic here
      this.startResendTimer();
    }
  }

  onSubmit() {
    if (this.verifyCodeForm.valid) {
      console.log('Verification code submitted:', this.verifyCodeForm.value.code);
      // Navigate to reset password page
      this.router.navigate(['/forgot-password/reset-password'], {
        queryParams: { 
          email: this.email,
          code: this.verifyCodeForm.value.code 
        }
      });
    }
  }

  returnHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}