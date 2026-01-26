import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @Input() formData: any;
  @Output() step = new EventEmitter();
  @Output() formValue = new EventEmitter();

  signupForm!: FormGroup;
  showPassword = false;
  passwordStrength: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    if (this.formData) {
      this.signupForm.patchValue(this.formData);
    }

    this.signupForm.valueChanges.subscribe(value => {
      this.formValue.emit(value);
    });
  }

  checkPasswordStrength() {
    const password = this.signupForm.get('password')?.value || '';

    if (password.length === 0) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;

    if (password.length >= 6) {
      strength = 1;
    }

    if (password.length >= 8 && /\d/.test(password)) {
      strength = 2;
    }

    if (
      password.length >= 8 &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      strength = 3;
    }

    this.passwordStrength = strength;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      // Emit form data
      this.formValue.emit(this.signupForm.value);
      // Emit step change to parent (parent will handle API call)
      this.step.emit(2);
      console.log('Signup form submitted:', this.signupForm.value);
    }
  }

  signupWithGoogle() {
    console.log('Google signup clicked');
  }

  signupWithMicrosoft() {
    console.log('Microsoft signup clicked');
  }

  returnHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
