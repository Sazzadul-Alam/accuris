import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-field-to-verify',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './otp-field-to-verify.component.html',
  styleUrls: ['./otp-field-to-verify.component.scss']
})
export class OtpFieldToVerifyComponent {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() formControlName!: string;
}
