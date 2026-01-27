import {Component, ElementRef, EventEmitter, Output, ViewChild, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { IndividualCreditService } from "./individual-credit-scoring-api-service";
import { switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-individual-credit-scoring-modal',
  templateUrl: './individual-credit-scoring-modal.component.html',
  styleUrls: ['./individual-credit-scoring-modal.component.css']
})
export class IndividualCreditScoringModalComponent {
  @Input() selectedPlanInput = '';
  @Input() currentUserId: number = null;  // The logged-in user (bank employee/admin)
  @Input() currentUserName: string = '';
  @Output() closeModal= new EventEmitter<void>();
  @Output() formSubmit= new EventEmitter<any>();
  @Output() saved= new EventEmitter<any>();

  // Add these ViewChild references with the others:
  @ViewChild('nationalIdCopyInput') nationalIdCopyInput!: ElementRef<HTMLInputElement>;
  @ViewChild('photographInput') photographInput!: ElementRef<HTMLInputElement>;
  @ViewChild('salaryCertificateInput') salaryCertificateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bankStatementInput') bankStatementInput!: ElementRef<HTMLInputElement>;
  @ViewChild('incomeTaxReturnInput') incomeTaxReturnInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cibConsentFormInput') cibConsentFormInput!: ElementRef<HTMLInputElement>;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Identity & Verification
  @ViewChild('passportInput') passportInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passportPhotoInput') passportPhotoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('utilityInput') utilityInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tinInput') tinInput!: ElementRef<HTMLInputElement>;

  // Employment Document
  @ViewChild('salaryInput') salaryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('employerIdInput') employerIdInput!: ElementRef<HTMLInputElement>;
  @ViewChild('paySlipInput') paySlipInput!: ElementRef<HTMLInputElement>;
  @ViewChild('appointmentInput') appointmentInput!: ElementRef<HTMLInputElement>;

  // Credit Verification
  @ViewChild('cibConsentInput') cibConsentInput!: ElementRef<HTMLInputElement>;
  @ViewChild('loanStatementsInput') loanStatementsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('creditCardInput') creditCardInput!: ElementRef<HTMLInputElement>;

  // Collateral / Asset Verification
  @ViewChild('fdrInput') fdrInput!: ElementRef<HTMLInputElement>;
  @ViewChild('goldInput') goldInput!: ElementRef<HTMLInputElement>;

  // ✅ ADDED: Track the individual being processed (customer/applicant)
  individualId: number = Number(localStorage.getItem('individualId'));

  personalInfoForm!: FormGroup;
  locationForm!: FormGroup;
  basicInfoForm!: FormGroup;
  employerInfoForm!: FormGroup;
  businessInfoForm!: FormGroup;
  creditInfoForm!: FormGroup;
  securityInfoForm!: FormGroup;

  uploadForm!: FormGroup;

  currentStep: number = 1;
  selectedFileName: string = '';
  selectedOption: string = 'Select Option';
  isSelectDropdownOpen: boolean = false;
  selectOptions: string[] = ['Individual', 'Business', 'Joint Account', 'Corporate'];

  expandedSection: string = '';
  financialSections = {
    basicInfo: false,
    employerInfo: false,
    businessInfo: false,
    creditInfo: false,
    securityInfo: false
  };

  expandedUploadSection: string = '';
  uploadSections = {
    identity: false,
    employment: false,
    credit: false,
    declaration: false  // Add this
  };

  expandedNestedSection: string = '';

  uploadedFiles: any = {
    // Identity & Verification
    passport: null,
    passportPhoto: null,
    utility: null,
    tin: null,

    // Employment Document
    salary: null,
    employerId: null,
    paySlip: null,
    appointment: null,

    // Credit Verification
    cibConsent: null,
    loanStatements: null,
    creditCard: null,

    // Collateral / Asset Verification
    fdr: null,
    gold: null
  };

  isUploadSectionValid: boolean = false;

  // Business Information Form Data
  businessUploadInfo = {
    businessType: '',
    yearsInBusiness: '',
    businessRevenue: '',
    industryType: '',
    businessName: ''
  };

  consentAccepted: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' | '' = '';
  showNotificationFlag: boolean = false;
  showUnsavedChangesWarning: boolean = false;
  showCloseConfirmation: boolean = false;
  fileErrorMessage: string = '';

  steps = [
    { id: 1, name: "Person's Info", icon: 'user' },
    { id: 2, name: 'Location', icon: 'location' },
    { id: 3, name: 'Financial Info', icon: 'finance' },
    { id: 4, name: 'Upload Info', icon: 'upload' },
    { id: 5, name: 'User Consent', icon: 'consent' }
  ];

  constructor(
    private fb: FormBuilder,
    private creditService: IndividualCreditService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeLocationForm();
    this.initializeFinancialForms();
    this.initializeUploadForm();
  }


  // onSaveAll(submit: boolean = false) {
  //
  //   if (submit) {
  //     this.closeModal.emit();
  //   }
  //
  //   if (!this.currentUserId) {
  //     this.showNotification('User ID is not set. Please log in.', 'error');
  //     return;
  //   }
  //
  //   const step3Data = {
  //     basicInfo: this.basicInfoForm.value,
  //     employerInfo: this.employerInfoForm.value,
  //     businessInfo: this.businessInfoForm.value,
  //     creditInfo: this.creditInfoForm.value,
  //     securityInfo: this.securityInfoForm.value
  //   };
  //
  //   this.creditService.submitStepOne(this.personalInfoForm.value, this.currentUserId, this.individualId).pipe(
  //     tap(response => {
  //       if (response.individualId) {
  //
  //         localStorage.setItem('individualId', String(response.individualId));
  //         this.individualId = response.individualId;
  //       }
  //     }),
  //     switchMap(() =>
  //       this.creditService.submitStepTwo(this.locationForm.value, this.currentUserId, this.individualId)
  //     ),
  //     switchMap(() =>
  //       this.creditService.submitStepThree(step3Data, this.individualId, this.currentUserId)
  //     ),
  //     switchMap(() =>
  //       this.creditService.submitStepFour(this.uploadForm.value, this.individualId, this.currentUserId)
  //     ),
  //     // If submit is true, call the submitIndividual function
  //     switchMap(response => {
  //       if (submit && this.individualId) {
  //         localStorage.removeItem('individualId');  // ✅ Use removeItem instead of setItem
  //         return this.creditService.submitIndividual(this.individualId, this.currentUserId);
  //
  //       }
  //       return of(response); // If not submitting, pass through the last response
  //     }),
  //     catchError(err => {
  //       console.error('❌ Save All Error:', err);
  //       this.showNotification('Failed to save information', 'error');
  //       return of(null);
  //     })
  //   ).subscribe({
  //     next: (response) => {
  //       if (response?.status === 'SUCCESS') {
  //         if (submit) {
  //           this.showNotification('All information saved and submitted successfully!', 'success');
  //         } else {
  //           this.showNotification('All information saved successfully!', 'success');
  //         }
  //       }
  //     }
  //   });
  // }
  // UPDATED: Load Saved Data from LocalStorage
  // ============================================



  onSaveAll(isFinalSubmit: boolean = false): void {
    // 1. Validation for Final Submission
    if (isFinalSubmit && !this.consentAccepted) {
      this.showNotification('Please accept the user consent to submit.', 'error');
      return;
    }

    if (!this.currentUserId) {
      this.showNotification('User session expired. Please log in.', 'error');
      return;
    }

    // 2. Aggregate Data from all FormGroups and Component State
    const consolidatedPayload = {
      // Personal & Identity
      personal: {
        ...this.personalInfoForm.value,
        id: this.individualId || null // NULL = Insert, VALUE = Update
      },
      // Address Info
      location: this.locationForm.value,
      // Combined Financial Sections
      financial: {
        // Get existing financialId from storage if we've saved before
        financialId: Number(localStorage.getItem('financialInfoId')) || null,
        basicInfo: this.basicInfoForm.value,
        employerInfo: this.employerInfoForm.value,
        businessInfo: this.businessInfoForm.value,
        creditInfo: this.creditInfoForm.value,
        securityInfo: this.securityInfoForm.value
      },
      // Document URLs from Step 4
      uploads: this.uploadForm.value
    };

    const action = isFinalSubmit ? 'SUBMIT' : 'SAVE';

    // 3. Single API call to handle everything
    this.creditService.saveFullCreditScoring(consolidatedPayload, this.currentUserId, action).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          // Update IDs returned from the database
          if (response.individualId) {
            this.individualId = response.individualId;
            localStorage.setItem('individualId', String(this.individualId));
          }
          if (response.financialInfoId) {
            localStorage.setItem('financialInfoId', String(response.financialInfoId));
          }

          if (isFinalSubmit) {
            // Cleanup on successful submission
            localStorage.removeItem('individualId');
            localStorage.removeItem('financialInfoId');
            localStorage.removeItem('creditScoringFormData');
            this.showNotification('Application submitted successfully!', 'success');
            setTimeout(() => this.closeModal.emit(), 1500);
          } else {
            this.showNotification('Progress saved successfully!', 'success');
          }
        } else {
          this.showNotification(response.message || 'Failed to save data.', 'error');
        }
      },
      error: (err) => {
        console.error('Server error during unified save:', err);
        this.showNotification('A connection error occurred.', 'error');
      }
    });
  }

  initializeForm(): void {
    this.personalInfoForm = this.fb.group({
      firstName: [
        '',
        [Validators.required, Validators.minLength(2)]
      ],
      lastName: [
        '',
        [Validators.required, Validators.minLength(2)]
      ],
      fathersName: [
        '',
        [Validators.required, Validators.minLength(2)]
      ],
      mothersName: [
        '',
        [Validators.required, Validators.minLength(2)]
      ],
      dateOfBirth: [
        '',
        [Validators.required, this.ageValidator]
      ],
      gender: [
        '',
        Validators.required
      ],
      maritalStatus: [
        '',
        Validators.required
      ],
      idNumber: [
        '',
        [Validators.required]
      ],
      phoneNumber: [
        '',
        [Validators.required]
      ],
      email: [
        '',
        [Validators.required, Validators.email]
      ],
      uploadId: [
        null
      ]
    });

    this.personalInfoForm.valueChanges.subscribe(() => {
      this.updateFormState();
    });
  }

  initializeLocationForm(): void {
    this.locationForm = this.fb.group({
      presentAddress: ['', [Validators.required, Validators.minLength(5)]],
      permanentAddress: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      stateOrDistrict: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]],
      country: ['', Validators.required],
      lengthOfStay: ['', [Validators.required, Validators.min(0)]]
    });

    this.locationForm.valueChanges.subscribe(() => {
      this.updateFormState();
    });
  }

  initializeFinancialForms(): void {
    // Basic Information Form
    this.basicInfoForm = this.fb.group({
      creditPurpose: ['', Validators.required],  // 1-6
      incomeType: ['', Validators.required]      // 1-6
    });

    // Employment Information Form
    this.employerInfoForm = this.fb.group({
      employerType: ['', Validators.required],              // Dropdown (ID to be mapped)
      employerName: ['', Validators.required],              // Text
      employmentStatus: ['', Validators.required],          // 1: Permanent, 2: Contract
      jobDesignation: ['', Validators.required],            // Text
      jobTenureYears: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],  // Number
      monthlyGrossIncome: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],  // Number
      monthlyNetIncome: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]     // Number
    });

    // Business Information Form
    this.businessInfoForm = this.fb.group({
      businessName: ['', Validators.required],              // Text
      businessType: ['', Validators.required],              // 1: Trading, 2: Service
      industryType: ['', Validators.required],              // Text
      yearsInBusiness: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],  // Number
      monthlyBusinessIncome: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]  // Number
    });

    // Financial and Credit Information Form
    this.creditInfoForm = this.fb.group({
      requestedLoanAmount: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],   // Number
      downPaymentAmount: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],     // Number
      loanTenureMonths: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],      // Number
      repaymentPreference: ['', Validators.required],       // 1: EMI
      existingLoanDetails: ['', Validators.required],       // Textarea
      creditCardDetails: ['', Validators.required]          // Textarea
    });

    // Security / Collateral & Risk Mitigation Form
    this.securityInfoForm = this.fb.group({
      collateralAvailable: ['', Validators.required],       // 1: Yes, 0: No
      collateralType: [''],                                 // 1: Property, 2: FDR (conditional)
      estimatedCollateralValue: ['', Validators.pattern(/^[0-9]+$/)],  // Number (conditional)
      guarantorAvailable: ['', Validators.required],        // 1: Yes, 0: No
      coApplicantAvailable: ['', Validators.required]       // 1: Yes, 0: No
    });

    // Form value change subscriptions for validation tracking
    this.basicInfoForm.valueChanges.subscribe(() => {
      this.financialSections.basicInfo = this.basicInfoForm.valid;
    });

    this.employerInfoForm.valueChanges.subscribe(() => {
      this.financialSections.employerInfo = this.employerInfoForm.valid;
    });

    this.businessInfoForm.valueChanges.subscribe(() => {
      this.financialSections.businessInfo = this.businessInfoForm.valid;
    });

    this.creditInfoForm.valueChanges.subscribe(() => {
      this.financialSections.creditInfo = this.creditInfoForm.valid;
    });

    this.securityInfoForm.valueChanges.subscribe(() => {
      this.financialSections.securityInfo = this.securityInfoForm.valid;
    });
  }


  initializeUploadForm(): void {
    this.uploadForm = this.fb.group({
      // File uploads (store file paths as strings)
      nationalIdCopy: ['', Validators.required],
      photograph: ['', Validators.required],
      salaryCertificate: ['', Validators.required],
      bankStatement: ['', Validators.required],
      incomeTaxReturn: ['', Validators.required],
      cibConsentForm: ['', Validators.required],  // ✅ Changed to file upload

      // Checkbox
      finalDeclaration: [false, Validators.requiredTrue]
    });
  }

  ageValidator(control: any) {
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18 ? null : { underage: true };
  }

  updateFormState(): void {
    // Update any derived state based on form values
  }

  toggleAccordion(section: string): void {
    this.expandedSection = this.expandedSection === section ? '' : section;
  }

  toggleUploadSection(section: string): void {
    this.expandedUploadSection = this.expandedUploadSection === section ? '' : section;
  }

  toggleNestedSection(section: string): void {
    this.expandedNestedSection = this.expandedNestedSection === section ? '' : section;
  }

  close(): void {
    this.showCloseConfirmation = true;
  }

  confirmClose(): void {
    this.showCloseConfirmation = false;
    this.closeModal.emit();
  }

  cancelClose(): void {
    this.showCloseConfirmation = false;
  }

  onStepClick(stepId: number): void {
    this.currentStep = stepId;
    this.loadStepData(stepId);
  }

  loadStepData(stepId: number): void {
    console.log('Loading data for step:', stepId);

    switch(stepId) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        this.loadFinancialData();
        break;
      case 4:
        this.loadUploadData();
        break;
      case 5:
        this.loadConsentData();
        break;
    }
  }

  loadFinancialData(): void {
    // Financial data already in forms
  }

  loadUploadData(): void {
    // Upload data already in component state
    this.updateUploadSectionStatus();
    this.validateUploadSection();
  }

  loadConsentData(): void {
    // Consent data already in component state
  }

  updateUploadSectionStatus(): void {
    // Identity & Verification
    this.uploadSections.identity = !!(
      this.uploadForm.get('nationalIdCopy')?.value &&
      this.uploadForm.get('photograph')?.value
    );

    // Employment Documents
    this.uploadSections.employment = !!(
      this.uploadForm.get('salaryCertificate')?.value
    );

    // Credit Verification
    this.uploadSections.credit = !!(
      this.uploadForm.get('bankStatement')?.value &&
      this.uploadForm.get('incomeTaxReturn')?.value &&
      this.uploadForm.get('cibConsentForm')?.value
    );

    // Declaration
    this.uploadSections.declaration = this.uploadForm.get('finalDeclaration')?.value || false;
  }

  validateUploadSection(): boolean {
    // Identity & Verification (passport is optional)
    const identityValid = !!(
      this.uploadedFiles.passportPhoto &&
      this.uploadedFiles.utility &&
      this.uploadedFiles.tin
    );

    // Employment Document
    const employmentValid = !!(
      this.uploadedFiles.salary &&
      this.uploadedFiles.employerId &&
      this.uploadedFiles.paySlip &&
      this.uploadedFiles.appointment
    );

    // Business Information
    const businessValid = !!(
      this.businessUploadInfo.businessType &&
      this.businessUploadInfo.yearsInBusiness &&
      this.businessUploadInfo.businessRevenue &&
      this.businessUploadInfo.industryType &&
      this.businessUploadInfo.businessName
    );

    // Credit Verification
    const creditValid = !!(
      this.uploadedFiles.cibConsent &&
      this.uploadedFiles.loanStatements &&
      this.uploadedFiles.creditCard
    );

    // Collateral / Asset Verification
    const collateralValid = !!(
      this.uploadedFiles.fdr &&
      this.uploadedFiles.gold
    );

    // All sections must be valid
    this.isUploadSectionValid = identityValid && employmentValid && businessValid && creditValid && collateralValid;

    return this.isUploadSectionValid;
  }

  validateCurrentStep(): boolean {
    switch(this.currentStep) {
      case 1:
        return this.personalInfoForm.valid;
      case 2:
        return this.locationForm.valid;
      case 3:
        return this.basicInfoForm.valid && this.employerInfoForm.valid && this.businessInfoForm.valid && this.creditInfoForm.valid && this.securityInfoForm.valid;
      case 4:
        return this.validateUploadSection();
      case 5:
        return true;
      default:
        return false;
    }
  }

  toggleSelectDropdown(): void {
    this.isSelectDropdownOpen = !this.isSelectDropdownOpen;
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.isSelectDropdownOpen = false;
    console.log('Selected option:', option);
  }

  // ============================================
  // UPDATED: onSave (Save button in Step 1)
  // ============================================
  // onSave(): void {
  //   if (this.personalInfoForm.valid) {
  //     this.onSaveStepOne();
  //   } else {
  //     this.markFormGroupTouched(this.personalInfoForm);
  //     this.showNotification('Please fill in all required fields correctly.', 'error');
  //   }
  // }

  // onSaveFinancial(): void {
  //   this.saveAllDataToLocalStorage();
  //   this.showNotification('Form saved successfully!', 'success');
  // }






  triggerUploadInput(type: string): void {
    switch(type) {
      // New upload form fields
      case 'nationalIdCopy':
        this.nationalIdCopyInput?.nativeElement.click();
        break;
      case 'photograph':
        this.photographInput?.nativeElement.click();
        break;
      case 'salaryCertificate':
        this.salaryCertificateInput?.nativeElement.click();
        break;
      case 'bankStatement':
        this.bankStatementInput?.nativeElement.click();
        break;
      case 'incomeTaxReturn':
        this.incomeTaxReturnInput?.nativeElement.click();
        break;
      case 'cibConsentForm':
        this.cibConsentFormInput?.nativeElement.click();
        break;

      // Old upload fields (Identity & Verification)
      case 'passport':
        this.passportInput?.nativeElement.click();
        break;
      case 'passportPhoto':
        this.passportPhotoInput?.nativeElement.click();
        break;
      case 'utility':
        this.utilityInput?.nativeElement.click();
        break;
      case 'tin':
        this.tinInput?.nativeElement.click();
        break;

      // Employment Document
      case 'salary':
        this.salaryInput?.nativeElement.click();
        break;
      case 'employerId':
        this.employerIdInput?.nativeElement.click();
        break;
      case 'paySlip':
        this.paySlipInput?.nativeElement.click();
        break;
      case 'appointment':
        this.appointmentInput?.nativeElement.click();
        break;

      // Credit Verification
      case 'cibConsent':
        this.cibConsentInput?.nativeElement.click();
        break;
      case 'loanStatements':
        this.loanStatementsInput?.nativeElement.click();
        break;
      case 'creditCard':
        this.creditCardInput?.nativeElement.click();
        break;

      // Collateral / Asset Verification
      case 'fdr':
        this.fdrInput?.nativeElement.click();
        break;
      case 'gold':
        this.goldInput?.nativeElement.click();
        break;
    }
  }

  onUploadFile(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.fileErrorMessage = 'File size must be less than 5MB';
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.fileErrorMessage = 'Only PDF, JPG, JPEG, and PNG files are allowed';
        return;
      }

      this.fileErrorMessage = '';

      // For now, store the file name as the path
      // In production, you would upload to server and get actual path
      const filePath = `/uploads/${file.name}`;

      // Update the form control
      this.uploadForm.patchValue({
        [fieldName]: filePath
      });

      // Also update the old uploadedFiles object for backward compatibility
      this.uploadedFiles[fieldName] = file.name;

      console.log(`File uploaded for ${fieldName}:`, filePath);
    }
  }













  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotificationFlag = true;

    setTimeout(() => {
      this.showNotificationFlag = false;
    }, 3000);
  }

  dismissNotification(): void {
    this.showNotificationFlag = false;
  }
}
