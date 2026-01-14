import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-consent',
  templateUrl: './user-consent.component.html',
  styleUrls: ['./user-consent.component.css']
})
export class UserConsentComponent {
  @Input() formData: any;
  consentForm: FormGroup;
  steps: number;
  @Output() step = new EventEmitter();
  @Output() userConsentValue = new EventEmitter();
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
    if (this.formData) {
      this.consentForm.patchValue(this.formData);
    }
  }

  onSubmit(): void {
    if (this.consentForm.valid) {
      // this.steps = 3;
      // this.step.emit(this.steps);
      this.userConsentValue.emit(this.consentForm.value);

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
