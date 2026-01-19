import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../services/user_service/user.service";

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
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {

  }

  ngOnInit(): void {
    this.consentForm = this.fb.group({
      agreeToTerms: [false, Validators.requiredTrue]
    });
    if (this.formData) {
      this.consentForm.patchValue(this.formData.consent);
    }
    this.consentForm.valueChanges.subscribe(value => {
      this.userConsentValue.emit(value);
    });
  }

  onSubmit(): void {
    if (this.consentForm.valid) {
      const fullStepData = {
        ...this.formData,
        consent: this.consentForm.value
      };
      console.log("full signup value: ", fullStepData);

      // this.userConsentValue.emit(fullStepData);
      this.userService.signup(fullStepData).subscribe(
         (data: any) => {
           this.router.navigate(['/login']);
         });

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
