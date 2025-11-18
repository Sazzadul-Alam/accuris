import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ContactFieldToVerifyComponent } from "./contact-field-to-verify/contact-field-to-verify.component";
import { OtpFieldToVerifyComponent } from './otp-field-to-verify/otp-field-to-verify.component';

@Component({
  selector: 'app-signup-two-tier-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, ContactFieldToVerifyComponent, OtpFieldToVerifyComponent],
  templateUrl: './signup-two-tier-auth-form.component.html',
  styleUrl: './signup-two-tier-auth-form.component.scss'
})
export class SignupTwoTierAuthFormComponent {

  form = new FormGroup({
    email: new FormControl(''),
    phone: new FormControl(''),
    emailOtp: new FormControl(''),
    phoneOtp: new FormControl(''),
  });

}
