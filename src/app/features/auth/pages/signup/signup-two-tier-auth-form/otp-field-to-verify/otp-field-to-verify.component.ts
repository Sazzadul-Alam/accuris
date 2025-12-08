import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp-field-to-verify',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './otp-field-to-verify.component.html',
  styleUrls: ['./otp-field-to-verify.component.scss']
})
export class OtpFieldToVerifyComponent {
  @Input() placeholder: string = 'Enter OTP';
  @Input() type: string = 'text';
  @Input() control!: FormControl;

  // Use the FormControl's validity
  get hasValue(): boolean {
    return this.control.valid && !!this.control.value;
  }
}