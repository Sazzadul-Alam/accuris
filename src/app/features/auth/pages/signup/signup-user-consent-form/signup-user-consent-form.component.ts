import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup-user-consent-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup-user-consent-form.component.html',
  styleUrls: ['./signup-user-consent-form.component.scss']
})
export class SignupUserConsentFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  onGoBack(): void {
    // Navigate back logic
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}