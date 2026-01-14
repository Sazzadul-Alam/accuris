import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

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
   password: string;


  constructor(private router: Router,
              private fb: FormBuilder)
  {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { email: string; password: string };

    if (state) {
      this.email = state.email;
      this.password = state.password;
    }
  }

  ngOnInit() {
    this.verificationForm = this.fb.group({
      method: ['email', Validators.required],
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  sendCode() {
    const method = this.verificationForm.get('method')?.value;
    this.codeSent = true;

    console.log('Sending code via:', method);
    // Add your API call to send verification code here

    if (method === 'email') {
      alert('Verification code sent to your email!');
    } else {
      alert('Verification code sent to your phone!');
    }
  }

  verifyCode() {
    const code = this.verificationForm.get('code')?.value;

    if (code && code.length === 6) {
      // Add your API call to verify code here
      console.log('Verifying code:', code);
      this.codeVerified = true;
      alert('Code verified successfully!');
    } else {
      alert('Please enter a valid 6-digit code');
    }
  }

  onSubmit() {
    if (this.codeVerified && this.verificationForm.valid) {
      console.log('Verification completed');
      // Navigate to dashboard or next page
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
