import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment'; // adjust path if needed

declare const google: any; // avoid TS errors for google.accounts

@Component({
  selector: 'app-login-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login-test.component.html',
  styleUrls: ['./login-test.component.scss']
})
export class LoginTestComponent implements AfterViewInit {

  loading = false;

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    grant_type: ['password', Validators.required]
  });

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngAfterViewInit(): void {
    // Initialize Google Identity Services
    // NOTE: ensure environment.googleClientId is set
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response),
      // optional UX mode: "popup" or "redirect". default behaviour of renderButton will open a popup.
      // ux_mode: 'popup'
    });

    // Render the button inside the div with id "googleBtn"
    google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      {
        theme: 'outline',
        size: 'large',
        width: 300
      }
    );

    // Optional: show One Tap (comment out if you don't want it)
    // google.accounts.id.prompt();
  }

  // ---------- Username / Password login (existing flow) ----------
  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const payload = this.form.value;

    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa('web:webpass')}`
    });

    this.http.post(`${environment.baseUrl}/security/authenticate`, payload, { headers })
      .subscribe({
        next: (res) => {
          console.log('Login success:', res);
          // TODO: store token, redirect, etc.
          this.loading = false;
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.loading = false;
        }
      });
  }

  // ---------- Google credential handler ----------
  handleCredentialResponse(response: { credential?: string }) {
    // response.credential is the ID token (JWT)
    if (!response || !response.credential) {
      console.error('No credential returned from Google');
      return;
    }
    const idToken = response.credential;
    console.log('Google ID token (raw):', idToken);

    const decoded = this.decodeJwt(idToken);
    console.log('Decoded ID token payload:', decoded);

    // Option A: If you want to test client-side, just keep token in console.
    // Option B: To log in via your backend, send the idToken to your backend endpoint:
    // Example (uncomment when backend is ready):
    //
    // this.http.post(`${environment.baseUrl}/security/authenticate/google`, { id_token: idToken })
    //   .subscribe({
    //     next: (res) => {
    //       console.log('Backend accepted Google token, returned:', res);
    //       // store access_token, refresh_token etc.
    //     },
    //     error: (err) => console.error('Backend error verifying Google token', err)
    //   });

    // For now we just stop loading if it was set
    this.loading = false;
  }

  decodeJwt(token: string | null) {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      // atob can throw for incorrect input; wrap in try/catch
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(json)));
    } catch (e) {
      console.error('Failed to decode JWT', e);
      return null;
    }
  }

  // Optional method: If you want a manual "Sign in with Google" click that triggers the popup
  // rather than relying on the rendered button, use this:
  promptGooglePopup() {
    google.accounts.id.prompt(); // may show One Tap or prompt
  }
}
