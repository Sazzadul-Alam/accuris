import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-two-factor-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.css']
})
export class TwoFactorAuthComponent implements OnInit {
  twoFactorForm!: FormGroup;
  emailOTPSent = false;
  phoneOTPSent = false;
  emailVerified = false;
  phoneVerified = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.twoFactorForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      emailOTP: [''],  // Removed validation for testing
      phone: ['', [Validators.required]],  // Simplified validation
      phoneOTP: ['']   // Removed validation for testing
    });
  }

  sendEmailOTP() {
    const email = this.twoFactorForm.get('email')?.value;
    if (email) {
      this.emailOTPSent = true;
      console.log('OTP sent to email:', email);
      alert('OTP sent to your email! (Mock - enter any code)');
    } else {
      alert('Please enter an email address');
    }
  }

  verifyEmailOTP() {
    const otp = this.twoFactorForm.get('emailOTP')?.value;
    if (otp) {
      console.log('Verifying email OTP:', otp);
      this.emailVerified = true;
      console.log('Email verified set to:', this.emailVerified);
    } else {
      alert('Please enter an OTP code');
    }
  }

  sendPhoneOTP() {
    const phone = this.twoFactorForm.get('phone')?.value;
    if (phone) {
      this.phoneOTPSent = true;
      console.log('OTP sent to phone:', phone);
      alert('OTP sent to your phone! (Mock - enter any code)');
    } else {
      alert('Please enter a phone number');
    }
  }

  verifyPhoneOTP() {
    const otp = this.twoFactorForm.get('phoneOTP')?.value;
    if (otp) {
      console.log('Verifying phone OTP:', otp);
      this.phoneVerified = true;
      console.log('Phone verified set to:', this.phoneVerified);
    } else {
      alert('Please enter an OTP code');
    }
  }

  onSubmit() {
  console.log('=== onSubmit DEBUG ===');
  console.log('Email verified:', this.emailVerified);
  console.log('Phone verified:', this.phoneVerified);
  
  // TEMPORARY: Force navigation for testing
  console.log('Forcing navigation to user-consent...');
  this.router.navigate(['/user-consent']).then(
    success => {
      console.log('Navigation successful:', success);
      if (!success) {
        console.error('Navigation returned false - route may not exist');
      }
    },
    error => {
      console.error('Navigation failed with error:', error);
    }
  );
}

  goBack() {
    this.router.navigate(['/signup']);
  }

  returnHome() {
    this.router.navigate(['/landing']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}