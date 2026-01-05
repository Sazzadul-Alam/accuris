import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-consent',
  templateUrl: './user-consent.component.html',
  styleUrls: ['./user-consent.component.css']
})
export class UserConsentComponent {
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
