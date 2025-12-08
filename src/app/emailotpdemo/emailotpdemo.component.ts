import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

interface Log {
  time: string;
  message: string;
  type: 'info' | 'error' | 'warn';
}

@Component({
  selector: 'email-otp-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="card">
    <h1>2FA Email OTP Demo</h1>

    <!-- Step 1: Email -->
    <div *ngIf="currentStep === 'email'" class="step">
      <input type="email" [(ngModel)]="email" placeholder="name@company.com" />
      <button (click)="sendOtp()" [disabled]="!isValidEmail() || isLoading">
        {{ isLoading ? 'Sending...' : 'Send OTP' }}
      </button>
    </div>

    <!-- Step 2: OTP -->
    <div *ngIf="currentStep === 'otp'" class="step">
      <p>Code sent to <strong>{{ email }}</strong></p>
      <input type="text" [(ngModel)]="otpCode" maxlength="6" placeholder="000000" />
      <button (click)="verifyOtp()" [disabled]="otpCode.length < 4 || isLoading">
        {{ isLoading ? 'Verifying...' : 'Verify & Login' }}
      </button>
      <button (click)="reset()" class="link">Change email</button>
      <button (click)="sendOtp()" class="link">Resend OTP</button>
    </div>

    <!-- Logs -->
    <div class="logs">
      <div *ngFor="let log of logs">
        [{{ log.time }}] <span [class]="log.type">{{ log.message }}</span>
      </div>
      <div *ngIf="logs.length === 0"><i>Ready to start...</i></div>
    </div>
  </div>
  `,
  styleUrls: ['./emailotpdemo.component.css']
})
export class EmailOtpDemoComponent {
  email: string = 'aiengineteam@gmail.com';
  otpCode: string = '';
  currentStep: 'email' | 'otp' = 'email';
  isLoading: boolean = false;

  logs: Log[] = [];

  isValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  private addLog(message: string, type: 'info' | 'error' | 'warn' = 'info') {
    this.logs = [{ time: new Date().toLocaleTimeString(), message, type }, ...this.logs];
  }

  async sendOtp() {
    this.isLoading = true;
    this.addLog(`Sending OTP to ${this.email}...`);
    try {
      const res = await fetch('http://localhost:9090/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.addLog('OTP Sent!', 'info');
      this.currentStep = 'otp';
    } catch (err: any) {
      this.addLog(`Error: ${err.message}`, 'error');
      this.currentStep = 'otp'; // simulate for demo
    } finally {
      this.isLoading = false;
    }
  }

  async verifyOtp() {
    this.isLoading = true;
    this.addLog(`Verifying OTP ${this.otpCode}...`);
    try {
      const res = await fetch('http://localhost:9090/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, otp: this.otpCode })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const success = (await res.text()).trim().toLowerCase() === 'true';
      if (success) {
        this.addLog('✅ Verification Successful!', 'info');
        this.reset();
      } else {
        this.addLog('❌ Invalid OTP', 'error');
        this.otpCode = '';
      }
    } catch (err: any) {
      this.addLog(`Verification Error: ${err.message}`, 'error');
      this.otpCode = '';
    } finally {
      this.isLoading = false;
    }
  }

  reset() {
    this.currentStep = 'email';
    this.otpCode = '';
    this.addLog('Reset form to step 1');
  }
}
