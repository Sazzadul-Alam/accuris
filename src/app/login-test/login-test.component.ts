import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-test.component.html',
  styleUrls: ['./login-test.component.scss']
})
export class LoginTestComponent {
  // Form group for reactive forms
  loginForm: FormGroup;

  // For displaying status messages to the user
  message: string = '';
  isError: boolean = false;

  // Expose environment and localStorage for display within the HTML template
  environment = environment;
  localStorage = localStorage;

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private router: Router
  ) {
    // Initialize the form with validators
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      grant_type: ['password', Validators.required]
    });
  }

  /**
   * Checks local storage for the token and returns a formatted status string.
   */
  getTokenStatus(): string {
    const token = localStorage.getItem('access_token');
    return token ? '✅ Stored (' + token.substring(0, 10) + '...)' : '❌ Missing';
  }

  /**
   * Executes the backend authentication call.
   */
  signIn() {
    // Check if form is valid
    if (this.loginForm.invalid) {
      return;
    }

    this.message = 'Attempting sign-in...';
    this.isError = false;

    // Get form values
    const user = this.loginForm.value;

    // 1. Prepare headers with Basic Auth
    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa('web:webpass')}`
    });

    // 2. Prepare request body
    const body = {
      username: user.username,
      password: user.password,
      grant_type: user.grant_type
    };

    // 3. Make the API call
    this.httpClient.post(`${environment.baseUrl}/security/authenticate`, body, { headers })
      .subscribe({
        next: (result: any) => {
          // Check for OAuth2 response format
          if (result && result['access_token']) {
            // 4. Success: Store OAuth2 tokens
            localStorage.setItem('username', user.username);
            localStorage.setItem('access_token', result['access_token']);
            localStorage.setItem('refresh_token', result['refresh_token']);
            localStorage.setItem('id_token', result['id_token']);
            localStorage.setItem('token_type', result['token_type']);
            localStorage.setItem('expires_in', result['expires_in']);
            localStorage.setItem('scope', result['scope']);

            this.message = 'SUCCESS! OAuth2 tokens stored and routing to dashboard.';

            // 5. Navigate on success
            setTimeout(() => {
              this.router.navigate(['/dashboard/home']);
            }, 1000);

          } else {
            // Success response, but missing expected token/data
            this.isError = true;
            this.message = 'Login failed: Authentication successful, but response format unexpected.';
            console.log('Response received:', result);
          }
        },
        error: (err) => {
          // 6. Error: Handle server or bad credential error
          this.isError = true;
          this.message = `Login failed: Server error or bad credentials. (Status: ${err.status})`;
          console.error('Authentication Error:', err);
        }
      });
  }
}