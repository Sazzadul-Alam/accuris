import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactFieldToVerifyComponent } from "./contact-field-to-verify/contact-field-to-verify.component";
import { OtpFieldToVerifyComponent } from './otp-field-to-verify/otp-field-to-verify.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup-two-tier-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, ContactFieldToVerifyComponent, OtpFieldToVerifyComponent, CommonModule],
  templateUrl: './signup-two-tier-auth-form.component.html',
  styleUrls: ['./signup-two-tier-auth-form.component.css']
})
export class SignupTwoTierAuthFormComponent {

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[\d\s\-+()]+$/),
      Validators.minLength(10)
    ]),
    emailOtp: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    phoneOtp: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    }
  }
}