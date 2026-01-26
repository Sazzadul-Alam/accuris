// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private webBackendUrl = 'http://localhost:8181/web-backend';
  private oauthUrl = 'http://localhost:2002'; // OAuth server

  constructor(private http: HttpClient) {}

  // ===== Token Storage =====
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('session_id');
  }

  // ===== PHASE 1: Web-backend Login =====
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.webBackendUrl}/auth/login`, {
      email,
      password,
      rememberMe: false
    });
  }

  // ===== PHASE 2: Request OTP =====
  requestOtp(email: string, otpMethod: string = 'EMAIL'): Observable<any> {
    return this.http.post(`${this.webBackendUrl}/auth/request-otp`, {
      email,
      otpMethod: otpMethod.toUpperCase()
    });
  }

  // ===== PHASE 3: Verify OTP =====
  verifyOtp(email: string, otp: string, rememberMe: boolean = false): Observable<any> {
    return this.http.post(`${this.webBackendUrl}/auth/verify-otp`, {
      email,
      otp,
      rememberMe
    });
  }

  // ===== PHASE 4: OAuth Authenticate (called after OTP verification) =====
  authenticate(email: string, password: string): Observable<any> {

    console.log(`EMAIL IS ${email}, and the password is ${password}`);

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + window.btoa('web:webpass'), // client_id:client_secret
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.oauthUrl}/authenticate`, {
      email,
      password_hash: password
    }, { headers });
  }

  // ===== Token Validation =====
  validateToken(token?: string): Observable<boolean> {
    console.log(`Validating Token`);
    const tokenToValidate = token || this.getToken();

    if (!tokenToValidate) {
      return of(false);
    }

    return this.http.post<any>(`${this.oauthUrl}/validate?token=${tokenToValidate}`, {})
      .pipe(
        map(res => {
        console.log(`Token is valid!!!`);// if backend says token is valid
          return true;
        }),
        catchError(err => {
          console.log(`Token is invalid!!!`);
          // invalid or expired token
          return of(false);
        })
      );
  }

  // ===== Check if user is authenticated =====
  isAuthenticated(): Observable<boolean> {
    return this.validateToken();
  }

  // ===== Logout =====
  logout(): void {
    const token = this.getToken();
    if (token) {
      // optionally call backend /logout/revoke-token
      this.http.get(`${this.oauthUrl}/logout/revoke-token`).subscribe();
      this.removeToken();
    }
  }

  // ===== SIGNUP PHASE 1: Register new user =====
  signup(signupData: any): Observable<any> {
    return this.http.post(`${this.webBackendUrl}/auth/signup`, signupData);
  }


  // ===== SIGNUP PHASE 2: Request OTP for email verification =====
  requestEmailOtp(otpRequest: any): Observable<any> {
    return this.http.post(`${this.webBackendUrl}/auth/signup/email-otp`, {
      primaryEmail: otpRequest.primaryEmail,
      email2fa: otpRequest.email2fa  // lowercase 'f'
    });
  }

// ===== SIGNUP PHASE 3: Verify OTP and activate account =====
  verifySignupOtp(verifyRequest: any): Observable<any> {
    return this.http.post(`${this.webBackendUrl}/auth/signup/verify-otp`, {
      primaryEmail: verifyRequest.primaryEmail,
      otp: verifyRequest.otp
    });
  }

}
