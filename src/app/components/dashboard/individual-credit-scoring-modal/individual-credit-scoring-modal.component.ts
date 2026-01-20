import {Component, ElementRef, EventEmitter, Output, ViewChild, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-individual-credit-scoring-modal',
  templateUrl: './individual-credit-scoring-modal.component.html',
  styleUrls: ['./individual-credit-scoring-modal.component.css']
})
export class IndividualCreditScoringModalComponent {
  @Input() selectedPlanInput = '';
  @Output() closeModal= new EventEmitter<void>();
  @Output() formSubmit= new EventEmitter<any>();
  @Output() saved= new EventEmitter<any>();
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

  personalInfoForm!: FormGroup;
  locationForm!: FormGroup;
  basicInfoForm!: FormGroup;
  employerInfoForm!: FormGroup;
  businessInfoForm!: FormGroup;
  creditInfoForm!: FormGroup;

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
    creditInfo: false
  };

  expandedUploadSection: string = '';
  uploadSections = {
    identity: false,
    employment: false,
    business: false,
    credit: false,
    collateral: false
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeLocationForm();
    this.initializeFinancialForms();
    this.loadSavedDataFromLocalStorage();
  }

  saveAllDataToLocalStorage(): void {
    const allFormData = {
      step1: this.personalInfoForm.value,
      step2: this.locationForm.value,
      step3: {
        basicInfo: this.basicInfoForm.value,
        employerInfo: this.employerInfoForm.value,
        businessInfo: this.businessInfoForm.value,
        creditInfo: this.creditInfoForm.value
      },
      step4: {
        uploadedFiles: this.uploadedFiles,
        businessUploadInfo: this.businessUploadInfo,
        selectedFileName: this.selectedFileName
      },
      step5: {
        consentAccepted: this.consentAccepted
      },
      savedAt: new Date().toISOString()
    };

    localStorage.setItem('creditScoringFormData', JSON.stringify(allFormData));
    console.log('All form data saved to localStorage');
    this.saved.emit();
  }
  loadSavedDataFromLocalStorage(): void {
    const savedData = localStorage.getItem('creditScoringFormData');

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        // Load Step 1 - Personal Info
        if (parsedData.step1) {
          this.personalInfoForm.patchValue(parsedData.step1);
          if (parsedData.step4?.selectedFileName) {
            this.selectedFileName = parsedData.step4.selectedFileName;
          }
        }

        // Load Step 2 - Location
        if (parsedData.step2) {
          this.locationForm.patchValue(parsedData.step2);
        }

        // Load Step 3 - Financial Info
        if (parsedData.step3) {
          if (parsedData.step3.basicInfo) {
            this.basicInfoForm.patchValue(parsedData.step3.basicInfo);
          }
          if (parsedData.step3.employerInfo) {
            this.employerInfoForm.patchValue(parsedData.step3.employerInfo);
          }
          if (parsedData.step3.businessInfo) {
            this.businessInfoForm.patchValue(parsedData.step3.businessInfo);
          }
          if (parsedData.step3.creditInfo) {
            this.creditInfoForm.patchValue(parsedData.step3.creditInfo);
          }
        }

        // Load Step 4 - Upload Info
        if (parsedData.step4) {
          if (parsedData.step4.uploadedFiles) {
            this.uploadedFiles = { ...parsedData.step4.uploadedFiles };
          }
          if (parsedData.step4.businessUploadInfo) {
            this.businessUploadInfo = { ...parsedData.step4.businessUploadInfo };
          }
          this.updateUploadSectionStatus();
          this.validateUploadSection();
        }

        // Load Step 5 - Consent
        if (parsedData.step5) {
          this.consentAccepted = parsedData.step5.consentAccepted || false;
        }

        console.log('Form data loaded from localStorage');
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }

  initializeForm(): void {
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      dateOfBirth: ['', [Validators.required, this.ageValidator]],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)]],
      idNumber: ['', [Validators.required, Validators.minLength(5)]],
      uploadId: [null]
    });

    this.personalInfoForm.valueChanges.subscribe(() => {
      this.updateFormState();
    });
  }

  initializeLocationForm(): void {
    this.locationForm = this.fb.group({
      addressLine1: ['', [Validators.required, Validators.minLength(5)]],
      addressLine2: [''],
      city: ['', [Validators.required, Validators.minLength(2)]],
      stateProvince: ['', Validators.required],
      zipPostalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]],
      country: ['', Validators.required]
    });

    this.locationForm.valueChanges.subscribe(() => {
      this.updateFormState();
    });
  }

  initializeFinancialForms(): void {
    this.basicInfoForm = this.fb.group({
      occupation: ['', Validators.required],
      monthlyIncome: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      employmentStatus: ['', Validators.required],
      sourceOfIncome: ['', Validators.required]
    });

    this.employerInfoForm = this.fb.group({
      employerName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      yearsEmployed: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      employerAddress: ['', Validators.required]
    });

    this.businessInfoForm = this.fb.group({
      businessName: ['', Validators.required],
      businessType: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      annualRevenue: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      yearsInBusiness: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });

    this.creditInfoForm = this.fb.group({
      bankName: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      existingLoans: ['', Validators.required],
      totalDebt: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      creditScore: ['', Validators.pattern(/^[0-9]{3}$/)],
      assets: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });

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


    // const hasUnsavedChanges = this.personalInfoForm.dirty || this.locationForm.dirty ||
    //   this.basicInfoForm.dirty || this.employerInfoForm.dirty ||
    //   this.businessInfoForm.dirty || this.creditInfoForm.dirty;
    //
    // if (hasUnsavedChanges) {
    //   this.showUnsavedChangesWarning = true;
    // } else {
    //   this.closeModal.emit();
    // }
  }

  // confirmClose(): void {
  //   this.showUnsavedChangesWarning = false;
  //   this.closeModal.emit();
  // }

  confirmClose(): void {
    this.showCloseConfirmation = false;
    this.closeModal.emit();
  }

  // cancelClose(): void {
  //   this.showUnsavedChangesWarning = false;
  // }

  cancelClose(): void {
    this.showCloseConfirmation = false;
  }

  onStepClick(stepId: number): void {

    this.currentStep = stepId;
    this.loadStepData(stepId);

    // if (stepId <= this.currentStep) {
    //   this.currentStep = stepId;
    //   this.loadStepData(stepId);
    // } else {
    //   if (this.validateCurrentStep()) {
    //     this.currentStep = stepId;
    //     this.loadStepData(stepId);
    //   } else {
    //     this.showNotification('Please complete the current step before proceeding.', 'error');
    //   }
    // }
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
    // Identity & Verification (passport is optional, others required)
    this.uploadSections.identity = !!(
      this.uploadedFiles.passportPhoto &&
      this.uploadedFiles.utility &&
      this.uploadedFiles.tin
    );

    // Employment Document (all required)
    this.uploadSections.employment = !!(
      this.uploadedFiles.salary &&
      this.uploadedFiles.employerId &&
      this.uploadedFiles.paySlip &&
      this.uploadedFiles.appointment
    );

    // Business Information (all required)
    this.uploadSections.business = !!(
      this.businessUploadInfo.businessType &&
      this.businessUploadInfo.yearsInBusiness &&
      this.businessUploadInfo.businessRevenue &&
      this.businessUploadInfo.industryType &&
      this.businessUploadInfo.businessName
    );

    // Credit Verification (all required)
    this.uploadSections.credit = !!(
      this.uploadedFiles.cibConsent &&
      this.uploadedFiles.loanStatements &&
      this.uploadedFiles.creditCard
    );

    // Collateral / Asset Verification (all required)
    this.uploadSections.collateral = !!(
      this.uploadedFiles.fdr &&
      this.uploadedFiles.gold
    );
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
        return this.basicInfoForm.valid && this.employerInfoForm.valid && this.businessInfoForm.valid && this.creditInfoForm.valid;
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

  onSave(): void {
    if (this.personalInfoForm.valid) {
      this.saveAllDataToLocalStorage();
      this.showNotification('Form saved successfully!', 'success');
    } else {
      this.markFormGroupTouched(this.personalInfoForm);
      this.showNotification('Please fill in all required fields correctly.', 'error');
    }
  }

  // onSave(): void {
  //   if (this.personalInfoForm.valid) {
  //     const formData = this.personalInfoForm.value;
  //     console.log('Personal info (in-memory):', formData);
  //     this.showNotification('Form updated!', 'success');
  //   } else {
  //     this.markFormGroupTouched(this.personalInfoForm);
  //     this.showNotification('Please fill in all required fields correctly.', 'error');
  //   }
  // }

  // onSaveLocation(): void {
  //   if (this.locationForm.valid) {
  //     const formData = this.locationForm.value;
  //     this.showNotification('Location updated!', 'success');
  //   } else {
  //     this.markFormGroupTouched(this.locationForm);
  //     this.showNotification('Please fill in all required fields correctly.', 'error');
  //   }
  // }

  onSaveLocation(): void {
    if (this.locationForm.valid) {
      this.saveAllDataToLocalStorage();
      this.showNotification('Form saved successfully!', 'success');
    } else {
      this.markFormGroupTouched(this.locationForm);
      this.showNotification('Please fill in all required fields correctly.', 'error');
    }
  }

  onSaveFinancial(): void {
    this.saveAllDataToLocalStorage();
    this.showNotification('Form saved successfully!', 'success');
  }

  onSubmitFinancial(): void {
    if (!this.basicInfoForm.valid || !this.employerInfoForm.valid || !this.businessInfoForm.valid || !this.creditInfoForm.valid) {
      this.showNotification('Please complete all required sections.', 'error');
      return;
    }

    this.onSaveFinancial();

    if (this.currentStep < 5) {
      this.currentStep++;
      this.loadStepData(this.currentStep);
    }
  }

  triggerUploadInput(type: string): void {
    switch(type) {
      // Identity & Verification
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

  onUploadFile(event: Event, type: string): void {
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
      this.uploadedFiles[type] = file.name;
      this.updateUploadSectionStatus();
      this.validateUploadSection();
      console.log(`File uploaded for ${type}:`, file.name);
    }
  }

  onBusinessInfoChange(field: string, value: string): void {
    this.businessUploadInfo[field as keyof typeof this.businessUploadInfo] = value;
    this.updateUploadSectionStatus();
    this.validateUploadSection();
  }

  onSaveUpload(): void {
    this.saveAllDataToLocalStorage();
    this.showNotification('Form saved successfully!', 'success');
  }

  saveAll() {
    this.saveAllDataToLocalStorage();
  }

  onNextFromUpload(): void {
    this.onSaveUpload();

    if (this.currentStep < 5) {
      this.currentStep++;
      this.loadStepData(this.currentStep);
    }
  }

  onSaveConsent(): void {
    this.saveAllDataToLocalStorage();
    this.showNotification('Form saved successfully!', 'success');
  }

  onSubmitConsent(): void {
    if (!this.consentAccepted) {
      this.showNotification('Please accept the terms and conditions to proceed.', 'error');
      return;
    }
    this.onSaveConsent();
    this.submitForm();
  }

  onNext(): void {
    if (this.currentStep === 1 && !this.personalInfoForm.valid) {
      this.markFormGroupTouched(this.personalInfoForm);
      this.showNotification('Please fill in all required fields correctly.', 'error');
      return;
    }

    if (this.currentStep === 2 && !this.locationForm.valid) {
      this.markFormGroupTouched(this.locationForm);
      this.showNotification('Please fill in all required fields correctly.', 'error');
      return;
    }

    if (this.currentStep < 5) {
      this.saveCurrentStepData();
      this.currentStep++;
      this.loadStepData(this.currentStep);
    } else {
      this.submitForm();
    }
  }

  saveCurrentStepData(): void {
    console.log(`Current data for step ${this.currentStep} is held in forms.`);
  }

  submitForm(): void {
    const completeFormData = {
      step1: this.personalInfoForm.value,
      step2: this.locationForm.value,
      step3: {
        basicInfo: this.basicInfoForm.value,
        employerInfo: this.employerInfoForm.value,
        businessInfo: this.businessInfoForm.value,
        creditInfo: this.creditInfoForm.value
      },
      step4: {
        uploadedFiles: this.uploadedFiles,
        businessUploadInfo: this.businessUploadInfo
      },
      step5: { consentAccepted: this.consentAccepted },
      submittedAt: new Date().toISOString()
    };

    console.log('Submitting complete form:', completeFormData);
    this.formSubmit.emit(completeFormData);

    // Clear saved data from localStorage
    localStorage.removeItem('creditScoringFormData');

    // this.showNotification('Form submitted successfully!', 'success');

    setTimeout(() => {
      this.closeModal.emit();
    }, 1500);
  }

  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event): void {
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
      this.selectedFileName = file.name;
      this.personalInfoForm.patchValue({ uploadId: file });
      this.convertFileToBase64(file);
    }
  }

  convertFileToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      console.log('File converted to base64');
    };
    reader.readAsDataURL(file);
  }

  returnHome(): void {
    this.close();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      control?.markAsDirty();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
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
