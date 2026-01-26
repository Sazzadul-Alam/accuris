import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth-service";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-two-factor-auth',
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.css']
})
export class TwoFactorAuthComponent implements OnInit {
  @Input() formData: any;
  @Output() twoFactorAuthValue = new EventEmitter();
  @Output() step = new EventEmitter();

  twoFactorForm!: FormGroup;
  emailOTPSent = false;
  phoneOTPSent = false;
  emailVerified = false;
  phoneVerified = false;
  steps: number;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.twoFactorForm = this.fb.group({
      email: [this.formData?.signup?.email || '', [Validators.required, Validators.email]],
      emailOTP: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      phone: [''],
      phoneOTP: ['']
    });

    if (this.formData) {
      this.twoFactorForm.patchValue(this.formData);
    }

    this.twoFactorForm.valueChanges.subscribe(value => {
      this.twoFactorAuthValue.emit(value);
    });
  }

  sendEmailOTP() {
    const email2fa = this.formData?.signup?.email;
    const primaryEmail = this.formData?.signup?.email;

    if (!email2fa) {
      alert('Please enter an email address');
      return;
    }

    this.isLoading = true;

    this.authService.requestEmailOtp({
      primaryEmail: primaryEmail,
      email2fa: email2fa
    }).subscribe({
      next: (res: any) => {
        console.log('OTP request response:', res);
        this.isLoading = false;

        if (res.status === 'OTP_SENT') {
          this.emailOTPSent = true;
          alert(res.message || 'Verification code sent to your email!');
        } else {
          alert(res.message || 'Failed to send verification code');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('OTP request failed:', err);
        this.isLoading = false;
        alert('Failed to send verification code. Please try again.');
      }
    });
  }

  verifyEmailOTP() {
    const otp = this.twoFactorForm.get('emailOTP')?.value;
    const primaryEmail = this.formData?.signup?.email;

    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP code');
      return;
    }

    this.isLoading = true;

    this.authService.verifySignupOtp({
      primaryEmail: primaryEmail,
      otp: otp
    }).subscribe({
      next: (res: any) => {
        console.log('OTP verification response:', res);
        this.isLoading = false;

        if (res.status === 'SUCCESS') {
          this.emailVerified = true;
          alert(res.message || 'Email verified successfully!');
          console.log('Email verified set to:', this.emailVerified);
        } else if (res.status === 'ALREADY_VERIFIED') {
          this.emailVerified = true;
          alert(res.message || 'Email already verified.');
        } else if (res.status === 'INVALID_OTP') {
          alert(res.message || 'Invalid verification code. Please try again.');
        } else if (res.status === 'EXPIRED_OTP') {
          alert(res.message || 'Verification code has expired. Please request a new one.');
        } else {
          alert(res.message || 'Verification failed. Please try again.');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('OTP verification failed:', err);
        this.isLoading = false;

        if (err.status === 400) {
          alert('Invalid or expired verification code.');
        } else if (err.status === 404) {
          alert('User not found. Please signup again.');
        } else {
          alert('Verification failed. Please try again.');
        }
      }
    });
  }

  sendPhoneOTP() {
    const phone = this.twoFactorForm.get('phone')?.value;
    if (phone) {
      this.phoneOTPSent = true;
      console.log('OTP sent to phone:', phone);
      alert('Phone verification coming soon!');
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
      alert('Phone verification coming soon!');
    } else {
      alert('Please enter an OTP code');
    }
  }

  onSubmit() {
    console.log('Email verified:', this.emailVerified);
    console.log('Phone verified:', this.phoneVerified);

    if (this.emailVerified) {
      // Email verified successfully, redirect to login
      alert('Account verified successfully! Please login.');
      this.router.navigate(['/login']);
    } else {
      alert('Please verify your email first');
    }
  }

  goBack() {
    this.steps = 1;
    this.step.emit(this.steps);
  }

  returnHome() {
    this.router.navigate(['/landing']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
