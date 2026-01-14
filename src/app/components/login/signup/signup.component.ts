import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @Input() formData: any;
  signupForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength: number = 0;
  steps: number;
  @Output() step = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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

    // Weak: length >= 6
    if (password.length >= 6) {
      strength = 1;
    }

    // Medium: length >= 8 and contains numbers
    if (password.length >= 8 && /\d/.test(password)) {
      strength = 2;
    }

    // Strong: length >= 8, contains numbers, uppercase, and special characters
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
  @Output() formValue = new EventEmitter();

  onSubmit() {
    if (this.signupForm.valid) {
      this.steps = 2;
      this.step.emit(this.steps);
      this.formValue.emit(this.signupForm.value);
      console.log('Signup form submitted:', this.signupForm.value);
    }
  }

  signupWithGoogle() {
    console.log('Google signup clicked');
    // Add Google signup logic
  }

  signupWithMicrosoft() {
    console.log('Microsoft signup clicked');
    // Add Microsoft signup logic
  }

  returnHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
