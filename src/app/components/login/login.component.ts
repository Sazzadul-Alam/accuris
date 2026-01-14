import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import { UserService } from 'src/app/services/user_service/user.service';

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
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
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
    const { email, password } = this.loginForm.value;
    Object.keys(this.loginForm.value).length > 0 && (this.isEmpty = false);
    if (this.loginForm.valid) {
      // this.userService.login(this.loginForm.value).subscribe(
      //   (data: any) => {
      //
      //     localStorage.setItem("token", data.access_token);
      //     localStorage.setItem("refresh_token", data.refresh_token);
      //     localStorage.setItem("expire_in", data.expires_in);
      //
      //     this.userService
      //       .userDetail({
      //         loginId: email
      //       })
      //       .subscribe((d: any) => {
      //         //store user details and session info in local storage
      //         localStorage.setItem("loginId", d.loginId);
      //         localStorage.setItem("userId", d.id);
      //         localStorage.setItem("user", JSON.stringify(d));
      //         localStorage.setItem("currentRole", JSON.stringify(d.roles));
      //         // localStorage.setItem("customSessionId", `${d.loginId}-${uuid.v4()}` + '-' + Date.now());
      //
      //         this.router.navigate(['/dashboard']);
      //
      //       });
      //   },
      //   (error: HttpErrorResponse) => {
      //
      //
      //     // this.alerts.toast('error','An error occurred!');
      //   }
      // );

      this.router.navigate(['/two-step-verification'], {
        state: { email, password }
      });

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
