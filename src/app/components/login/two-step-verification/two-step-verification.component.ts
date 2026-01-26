import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth-service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-two-step-verification',
  templateUrl: './two-step-verification.component.html',
  styleUrls: ['./two-step-verification.component.css']
})
export class TwoStepVerificationComponent {
  verificationForm!: FormGroup;
  codeSent = false;
  codeVerified = false;
  email: string;
  password: string; // Store password for OAuth
  rememberMe: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { email: string; password: string; rememberMe: boolean };

    if (state) {
      this.email = state.email;
      this.password = state.password; // Get password from login page
      this.rememberMe = state.rememberMe || false;
    } else {
      // If no state, redirect back to login
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {

    console.log(`the password is ${this.password}`);
    this.verificationForm = this.fb.group({
      method: ['email', Validators.required],
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  // Check if code is 6 digits
  isCodeComplete(): boolean {
    const code = this.verificationForm.get('code')?.value;
    return code && code.length === 6;
  }

  // PHASE 2: Request OTP
  sendCode() {
    const method = this.verificationForm.get('method')?.value;

    this.authService.requestOtp(this.email, method.toUpperCase()).subscribe({
      next: (res: any) => {
        console.log('OTP request response:', res);

        if (res.status === 'OTP_SENT') {
          this.codeSent = true;
          alert(res.message || 'Verification code sent successfully!');
        } else {
          alert(res.message || 'Failed to send verification code');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('OTP request failed:', err);
        alert('Failed to send verification code. Please try again.');
      }
    });
  }

  // PHASE 3: Verify OTP
  verifyCode() {
    const code = this.verificationForm.get('code')?.value;

    if (!code || code.length !== 6) {
      return;
    }

    // Call API to verify OTP
    this.authService.verifyOtp(this.email, code, this.rememberMe).subscribe({
      next: (res: any) => {
        console.log('OTP verification response:', res);

        if (res.status === 'SUCCESS') {
          // Store user session data from web-backend
          if (res.userId) {
            localStorage.setItem('user_id', res.userId.toString());
          }
          if (res.sessionId) {
            localStorage.setItem('session_id', res.sessionId.toString());
          }

          // PHASE 4: Get OAuth tokens after successful OTP verification
          this.getOAuthTokens();
        } else {
          this.codeVerified = false;
          alert(res.message || 'Invalid verification code. Please try again.');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('OTP verification failed:', err);
        this.codeVerified = false;

        if (err.status === 401) {
          alert('Invalid or expired verification code.');
        } else if (err.status === 429) {
          alert('Too many attempts. Please try again later.');
        } else {
          alert('Verification failed. Please try again.');
        }
      }
    });
  }

  // PHASE 4: Get OAuth tokens
  getOAuthTokens() {
    this.authService.authenticate(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('OAuth tokens received:', res);

        // Store OAuth tokens
        if (res.access_token) {
          this.authService.setToken(res.access_token);
        }
        if (res.refresh_token) {
          this.authService.setRefreshToken(res.refresh_token);
        }

        // Mark as verified and show success
        this.codeVerified = true;
        console.log('Authentication complete!');
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to get OAuth tokens:', err);
        alert('Authentication completed but failed to get access tokens. Please try logging in again.');
        this.codeVerified = false;
      }
    });
  }

  onSubmit() {
    if (this.codeVerified && this.verificationForm.valid) {
      console.log('Verification completed, navigating to dashboard');
      this.router.navigate(['/dashboard']);
    } else {
      alert('Please verify the code before submitting');
    }
  }

  returnHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
