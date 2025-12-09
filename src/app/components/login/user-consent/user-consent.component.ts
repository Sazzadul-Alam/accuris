import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-consent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-consent.component.html',
  styleUrls: ['./user-consent.component.css']
})
export class UserConsentComponent implements OnInit {
  consentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.consentForm = this.fb.group({
      agreeToTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  onSubmit(): void {
    if (this.consentForm.valid) {
      console.log('User agreed to terms');
      alert('Account created successfully!');
    }
  }

  goBack(): void {
    this.router.navigate(['/two-factor-auth']);
  }

  returnHome(): void {
    this.router.navigate(['/landing']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}