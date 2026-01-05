import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-individual-credit-scoring-modal',
  templateUrl: './individual-credit-scoring-modal.component.html',
  styleUrls: ['./individual-credit-scoring-modal.component.css']
})
export class IndividualCreditScoringModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passportInput') passportInput!: ElementRef<HTMLInputElement>;
  @ViewChild('utilityInput') utilityInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tinInput') tinInput!: ElementRef<HTMLInputElement>;

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

  expandedSection: string = 'basicInfo';
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
    credit: false
  };

  uploadedFiles: any = {
    passport: null,
    utility: null,
    tin: null
  };

  consentAccepted: boolean = false;

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
    this.loadSavedData();
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
      businessName: [''],
      businessType: [''],
      registrationNumber: [''],
      annualRevenue: ['', Validators.pattern(/^[0-9]+$/)],
      yearsInBusiness: ['', Validators.pattern(/^[0-9]+$/)]
    });

    this.creditInfoForm = this.fb.group({
      bankName: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      existingLoans: ['', Validators.required],
      totalDebt: ['', Validators.pattern(/^[0-9]+$/)],
      creditScore: ['', Validators.pattern(/^[0-9]{3}$/)],
      assets: ['', Validators.pattern(/^[0-9]+$/)]
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
    console.log('Toggle nested section:', section);
  }

  close(): void {
    const hasUnsavedChanges = this.personalInfoForm.dirty || this.locationForm.dirty ||
      this.basicInfoForm.dirty || this.employerInfoForm.dirty ||
      this.businessInfoForm.dirty || this.creditInfoForm.dirty;

    if (hasUnsavedChanges) {
      const confirmClose = confirm('You have unsaved changes. Are you sure you want to close?');
      if (confirmClose) {
        this.closeModal.emit();
      }
    } else {
      this.closeModal.emit();
    }
  }

  onStepClick(stepId: number): void {
    if (stepId <= this.currentStep) {
      this.currentStep = stepId;
      this.loadStepData(stepId);
    } else {
      if (this.validateCurrentStep()) {
        this.currentStep = stepId;
        this.loadStepData(stepId);
      } else {
        alert('Please complete the current step before proceeding.');
      }
    }
  }

  loadStepData(stepId: number): void {
    console.log('Loading data for step:', stepId);

    switch(stepId) {
      case 1:
        const savedPersonalData = localStorage.getItem('creditScoringStep1');
        if (savedPersonalData) {
          const parsedData = JSON.parse(savedPersonalData);
          this.personalInfoForm.patchValue(parsedData);
          if (parsedData.uploadId) {
            this.selectedFileName = 'Previously uploaded file';
          }
        }
        break;
      case 2:
        const savedLocationData = localStorage.getItem('creditScoringStep2');
        if (savedLocationData) {
          const parsedData = JSON.parse(savedLocationData);
          this.locationForm.patchValue(parsedData);
        }
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
    const savedBasicInfo = localStorage.getItem('creditScoringBasicInfo');
    if (savedBasicInfo) {
      const parsedData = JSON.parse(savedBasicInfo);
      this.basicInfoForm.patchValue(parsedData);
    }

    const savedEmployerInfo = localStorage.getItem('creditScoringEmployerInfo');
    if (savedEmployerInfo) {
      const parsedData = JSON.parse(savedEmployerInfo);
      this.employerInfoForm.patchValue(parsedData);
    }

    const savedBusinessInfo = localStorage.getItem('creditScoringBusinessInfo');
    if (savedBusinessInfo) {
      const parsedData = JSON.parse(savedBusinessInfo);
      this.businessInfoForm.patchValue(parsedData);
    }

    const savedCreditInfo = localStorage.getItem('creditScoringCreditInfo');
    if (savedCreditInfo) {
      const parsedData = JSON.parse(savedCreditInfo);
      this.creditInfoForm.patchValue(parsedData);
    }
  }

  loadUploadData(): void {
    const savedUploadData = localStorage.getItem('creditScoringUploadData');
    if (savedUploadData) {
      this.uploadedFiles = JSON.parse(savedUploadData);
      this.uploadSections.identity = !!(this.uploadedFiles.passport || this.uploadedFiles.utility || this.uploadedFiles.tin);
    }
  }

  loadConsentData(): void {
    const savedConsent = localStorage.getItem('creditScoringConsent');
    if (savedConsent) {
      this.consentAccepted = JSON.parse(savedConsent);
    }
  }

  validateCurrentStep(): boolean {
    switch(this.currentStep) {
      case 1:
        return this.personalInfoForm.valid;
      case 2:
        return this.locationForm.valid;
      case 3:
        return this.basicInfoForm.valid && this.employerInfoForm.valid && this.creditInfoForm.valid;
      case 4:
        return true;
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
      const formData = this.personalInfoForm.value;
      localStorage.setItem('creditScoringStep1', JSON.stringify(formData));
      console.log('Personal info saved:', formData);
      this.showNotification('Form saved successfully!', 'success');
    } else {
      this.markFormGroupTouched(this.personalInfoForm);
      this.showNotification('Please fill in all required fields correctly.', 'error');
    }
  }

  onSaveLocation(): void {
    if (this.locationForm.valid) {
      const formData = this.locationForm.value;
      localStorage.setItem('creditScoringStep2', JSON.stringify(formData));
      console.log('Location info saved:', formData);
      this.showNotification('Location saved successfully!', 'success');
    } else {
      this.markFormGroupTouched(this.locationForm);
      this.showNotification('Please fill in all required fields correctly.', 'error');
    }
  }

  onSaveFinancial(): void {
    localStorage.setItem('creditScoringBasicInfo', JSON.stringify(this.basicInfoForm.value));
    localStorage.setItem('creditScoringEmployerInfo', JSON.stringify(this.employerInfoForm.value));
    localStorage.setItem('creditScoringBusinessInfo', JSON.stringify(this.businessInfoForm.value));
    localStorage.setItem('creditScoringCreditInfo', JSON.stringify(this.creditInfoForm.value));

    console.log('Financial info saved');
    this.showNotification('Financial information saved successfully!', 'success');
  }

  onSubmitFinancial(): void {
    if (!this.basicInfoForm.valid || !this.employerInfoForm.valid || !this.creditInfoForm.valid) {
      this.showNotification('Please complete all required sections.', 'error');
      return;
    }

    this.onSaveFinancial();

    if (this.currentStep < 5) {
      this.currentStep++;
      console.log('Moving to step:', this.currentStep);
      this.loadStepData(this.currentStep);
    }
  }

  triggerUploadInput(type: string): void {
    switch(type) {
      case 'passport':
        this.passportInput?.nativeElement.click();
        break;
      case 'utility':
        this.utilityInput?.nativeElement.click();
        break;
      case 'tin':
        this.tinInput?.nativeElement.click();
        break;
    }
  }

  onUploadFile(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, JPG, JPEG, and PNG files are allowed');
        return;
      }

      this.uploadedFiles[type] = file.name;
      this.uploadSections.identity = true;
      console.log(`File uploaded for ${type}:`, file.name);
    }
  }

  onSaveUpload(): void {
    localStorage.setItem('creditScoringUploadData', JSON.stringify(this.uploadedFiles));
    console.log('Upload info saved');
    this.showNotification('Upload information saved successfully!', 'success');
  }

  onNextFromUpload(): void {
    this.onSaveUpload();

    if (this.currentStep < 5) {
      this.currentStep++;
      console.log('Moving to step:', this.currentStep);
      this.loadStepData(this.currentStep);
    }
  }

  onSaveConsent(): void {
    localStorage.setItem('creditScoringConsent', JSON.stringify(this.consentAccepted));
    console.log('Consent saved:', this.consentAccepted);
    this.showNotification('Consent saved successfully!', 'success');
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
      console.log('Moving to step:', this.currentStep);
      this.loadStepData(this.currentStep);
    } else {
      this.submitForm();
    }
  }

  saveCurrentStepData(): void {
    if (this.currentStep === 1) {
      const formData = this.personalInfoForm.value;
      localStorage.setItem('creditScoringStep1', JSON.stringify(formData));
      console.log('Step 1 data saved:', formData);
    } else if (this.currentStep === 2) {
      const formData = this.locationForm.value;
      localStorage.setItem('creditScoringStep2', JSON.stringify(formData));
      console.log('Step 2 data saved:', formData);
    } else if (this.currentStep === 3) {
      this.onSaveFinancial();
    }
  }

  submitForm(): void {
    const step1Data = JSON.parse(localStorage.getItem('creditScoringStep1') || '{}');
    const step2Data = JSON.parse(localStorage.getItem('creditScoringStep2') || '{}');
    const basicInfoData = JSON.parse(localStorage.getItem('creditScoringBasicInfo') || '{}');
    const employerInfoData = JSON.parse(localStorage.getItem('creditScoringEmployerInfo') || '{}');
    const businessInfoData = JSON.parse(localStorage.getItem('creditScoringBusinessInfo') || '{}');
    const creditInfoData = JSON.parse(localStorage.getItem('creditScoringCreditInfo') || '{}');
    const uploadData = JSON.parse(localStorage.getItem('creditScoringUploadData') || '{}');
    const consentData = JSON.parse(localStorage.getItem('creditScoringConsent') || 'false');

    const completeFormData = {
      step1: step1Data,
      step2: step2Data,
      step3: {
        basicInfo: basicInfoData,
        employerInfo: employerInfoData,
        businessInfo: businessInfoData,
        creditInfo: creditInfoData
      },
      step4: uploadData,
      step5: { consentAccepted: consentData },
      submittedAt: new Date().toISOString()
    };

    console.log('Submitting complete form:', completeFormData);
    this.formSubmit.emit(completeFormData);

    this.showNotification('Form submitted successfully!', 'success');

    localStorage.removeItem('creditScoringStep1');
    localStorage.removeItem('creditScoringStep2');
    localStorage.removeItem('creditScoringBasicInfo');
    localStorage.removeItem('creditScoringEmployerInfo');
    localStorage.removeItem('creditScoringBusinessInfo');
    localStorage.removeItem('creditScoringCreditInfo');
    localStorage.removeItem('creditScoringUploadData');
    localStorage.removeItem('creditScoringConsent');

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
        alert('File size must be less than 5MB');
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, JPG, JPEG, and PNG files are allowed');
        return;
      }

      this.selectedFileName = file.name;
      this.personalInfoForm.patchValue({ uploadId: file });
      console.log('File selected:', file.name);
      this.convertFileToBase64(file);
    }
  }

  convertFileToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      console.log('File converted to base64');
      localStorage.setItem('uploadedIdFile', base64String);
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
    if (type === 'success') {
      alert('✓ ' + message);
    } else {
      alert('✗ ' + message);
    }
  }

  loadSavedData(): void {
    const savedPersonalData = localStorage.getItem('creditScoringStep1');
    if (savedPersonalData) {
      const parsedData = JSON.parse(savedPersonalData);
      this.personalInfoForm.patchValue(parsedData);
      if (parsedData.uploadId) {
        this.selectedFileName = 'Previously uploaded file';
      }
    }

    const savedLocationData = localStorage.getItem('creditScoringStep2');
    if (savedLocationData) {
      const parsedData = JSON.parse(savedLocationData);
      this.locationForm.patchValue(parsedData);
    }

    this.loadFinancialData();
    this.loadUploadData();
    this.loadConsentData();
  }
}
