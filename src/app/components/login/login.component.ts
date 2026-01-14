import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword = false;
  isEmpty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isEmpty = false;
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      grant_type: ["password", Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    Object.keys(this.loginForm.value).length > 0 && (this.isEmpty = false);
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
      console.log('Login attempt:', { email, password, rememberMe });

      // TODO: Implement your actual login logic here
      // After successful login, navigate to two-step verification
      this.router.navigate(['/two-step-verification']);
      //alert('Login form submitted successfully!\nEmail: ' + email);
    } else {
      alert('Please fill in all required fields correctly');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToLogin(): void {
    console.log('Navigate to login clicked');
  }

  forgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  loginWithGoogle(): void {
    console.log('Google login clicked');
    alert('Google OAuth login will be implemented');
  }

  loginWithMicrosoft(): void {
    console.log('Microsoft login clicked');
    alert('Microsoft OAuth login will be implemented');
  }

  returnHome(): void {
    console.log('Return home clicked');
    this.router.navigate(['/']);
  }

}
