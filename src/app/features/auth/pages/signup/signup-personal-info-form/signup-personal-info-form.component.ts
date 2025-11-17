import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-signup-personal-info-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup-personal-info-form.component.html',
  styleUrl: './signup-personal-info-form.component.scss'
})
export class SignupPersonalInfoFormComponent {
  showPassword = false;

  signupForm = new FormGroup({
    firstName: new FormControl('', { validators: [Validators.required] }),
    lastName: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)]
    }),
    acceptTerms: new FormControl(false, {
      validators: [Validators.requiredTrue]
    })
  });

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form Submitted:', this.signupForm.value);
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  get passwordStrength(): string {
    const pwd = this.signupForm.get('password')?.value ?? '';
    if (pwd.length > 10) return 'Strong';
    if (pwd.length >= 6) return 'Medium';
    if (pwd.length >= 1) return 'Weak';
    return 'None'
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

