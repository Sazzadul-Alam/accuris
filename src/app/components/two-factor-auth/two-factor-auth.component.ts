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
      emailOTP: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      phoneOTP: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  sendEmailOTP() {
    const email = this.twoFactorForm.get('email')?.value;
    if (email && this.twoFactorForm.get('email')?.valid) {
      this.emailOTPSent = true;
      console.log('Sending OTP to email:', email);
      // Add your API call to send email OTP here
      alert('OTP sent to your email!');
    } else {
      alert('Please enter a valid email address');
    }
  }

  verifyEmailOTP() {
    const otp = this.twoFactorForm.get('emailOTP')?.value;
    if (otp && otp.length === 6) {
      // Add your API call to verify email OTP here
      console.log('Verifying email OTP:', otp);
      this.emailVerified = true;
      alert('Email verified successfully!');
    } else {
      alert('Please enter a valid 6-digit OTP');
    }
  }

  sendPhoneOTP() {
    const phone = this.twoFactorForm.get('phone')?.value;
    if (phone && this.twoFactorForm.get('phone')?.valid) {
      this.phoneOTPSent = true;
      console.log('Sending OTP to phone:', phone);
      // Add your API call to send phone OTP here
      alert('OTP sent to your phone!');
    } else {
      alert('Please enter a valid phone number');
    }
  }

  verifyPhoneOTP() {
    const otp = this.twoFactorForm.get('phoneOTP')?.value;
    if (otp && otp.length === 6) {
      // Add your API call to verify phone OTP here
      console.log('Verifying phone OTP:', otp);
      this.phoneVerified = true;
      alert('Phone verified successfully!');
    } else {
      alert('Please enter a valid 6-digit OTP');
    }
  }

  onSubmit() {
    if (this.emailVerified && this.phoneVerified) {
      console.log('2FA verification completed');
      // Navigate to next step (User Consent)
      this.router.navigate(['/user-consent']);
    } else {
      alert('Please verify both email and phone to continue');
    }
  }

  goBack() {
    this.router.navigate(['/signup']);
  }

  returnHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}