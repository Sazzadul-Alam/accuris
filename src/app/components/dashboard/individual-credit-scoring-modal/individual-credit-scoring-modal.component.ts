import {Component, ElementRef, EventEmitter, Output, ViewChild, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { IndividualCreditService } from "./individual-credit-scoring-api-service";
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-individual-credit-scoring-modal',
  templateUrl: './individual-credit-scoring-modal.component.html',
  styleUrls: ['./individual-credit-scoring-modal.component.css'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class IndividualCreditScoringModalComponent {

  // ==================== INPUTS & OUTPUTS ====================
  @Input() selectedPlanInput = '';
  @Input() currentUserId: number = null;
  @Input() currentUserName: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();
  @Output() saved = new EventEmitter<any>();

  // ==================== VIEW CHILDREN (FILE INPUTS) ====================
  @ViewChild('idCopyInput') idCopyInput!: ElementRef<HTMLInputElement>;
  @ViewChild('photographInput') photographInput!: ElementRef<HTMLInputElement>;
  @ViewChild('salaryCertificateInput') salaryCertificateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bankStatementInput') bankStatementInput!: ElementRef<HTMLInputElement>;
  @ViewChild('incomeTaxReturnInput') incomeTaxReturnInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cibConsentFormInput') cibConsentFormInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passportInput') passportInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passportPhotoInput') passportPhotoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('utilityInput') utilityInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tinInput') tinInput!: ElementRef<HTMLInputElement>;
  @ViewChild('salaryInput') salaryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('employerIdInput') employerIdInput!: ElementRef<HTMLInputElement>;
  @ViewChild('paySlipInput') paySlipInput!: ElementRef<HTMLInputElement>;
  @ViewChild('appointmentInput') appointmentInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cibConsentInput') cibConsentInput!: ElementRef<HTMLInputElement>;
  @ViewChild('loanStatementsInput') loanStatementsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('creditCardInput') creditCardInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fdrInput') fdrInput!: ElementRef<HTMLInputElement>;
  @ViewChild('goldInput') goldInput!: ElementRef<HTMLInputElement>;

  // ==================== FORMS ====================
  personalInfoForm!: FormGroup;
  locationForm!: FormGroup;
  basicInfoForm!: FormGroup;
  employerInfoForm!: FormGroup;
  businessInfoForm!: FormGroup;
  creditInfoForm!: FormGroup;
  securityInfoForm!: FormGroup;
  uploadForm!: FormGroup;

  // ==================== STATE MANAGEMENT ====================
  currentStep: number = 1;
  individualId: number = null;
  financialInfoId: number = null;
  hasUnsavedChanges = false;
  consentAccepted: boolean = false;

  // Step validation control (set to false to disable for testing)
  enforceStepValidation: boolean = false;

  // ==================== NOTIFICATION STATE ====================
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'warning' | 'info' = 'success';

  // ==================== MODAL STATE ====================
  showCloseConfirmation: boolean = false;

  // ==================== FILE UPLOAD STATE ====================
  pendingUploads: { [key: string]: File } = {};
  uploadedFiles: any = {
    idCopy: { path: null, filename: null },
    photograph: { path: null, filename: null },
    salaryCertificate: { path: null, filename: null },
    bankStatement: { path: null, filename: null },
    incomeTaxReturn: { path: null, filename: null },
    cibConsentForm: { path: null, filename: null }
  };
  fileErrorMessage: string = '';

  // ==================== ACCORDION/SECTION STATE ====================
  expandedSection: string = '';
  expandedUploadSection: string = '';
  expandedNestedSection: string = '';

  financialSections = {
    basicInfo: false,
    employerInfo: false,
    businessInfo: false,
    creditInfo: false,
    securityInfo: false
  };

  uploadSections = {
    identity: false,
    employment: false,
    credit: false,
    declaration: false
  };

  // ==================== CONFIGURATION DATA ====================
  configurations: any = {
    genders: [],
    maritalStatuses: [],
    employerTypes: [],
    employmentStatuses: [],
    businessTypes: [],
    creditPurposes: [],
    incomeTypes: [],
    repaymentPreferences: [],
    collateralTypes: []
  };

  // ==================== UI STATE ====================
  selectedFileName: string = '';
  selectedOption: string = 'Select Option';
  isSelectDropdownOpen: boolean = false;
  selectOptions: string[] = ['Individual', 'Business', 'Joint Account', 'Corporate'];
  isUploadSectionValid: boolean = false;

  businessUploadInfo = {
    businessType: '',
    yearsInBusiness: '',
    businessRevenue: '',
    industryType: '',
    businessName: ''
  };

  steps = [
    { id: 1, name: "Person's Info", icon: 'user' },
    { id: 2, name: 'Location', icon: 'location' },
    { id: 3, name: 'Financial Info', icon: 'finance' },
    { id: 4, name: 'Upload Info', icon: 'upload' },
    { id: 5, name: 'User Consent', icon: 'consent' }
  ];

  // ==================== CONSTRUCTOR ====================
  constructor(
    private fb: FormBuilder,
    private creditService: IndividualCreditService
  ) {}

  // ==================== LIFECYCLE HOOKS ====================
  ngOnInit(): void {
    // Load configurations first
    this.creditService.getAllConfigurations().subscribe({
      next: (configs) => {
        this.configurations = configs;

        // Then load individual data
        this.creditService.getLatestIndividualId(this.currentUserId).subscribe({
          next: (response) => {
            this.individualId = response.individualId;
            console.log('Latest Individual ID:', this.individualId);

            if (this.individualId) {
              this.loadIndividualData(this.individualId);
            } else {
              this.startTrackingChanges();
            }
          },
          error: (error) => {
            console.error('Error fetching latest individual:', error);
            this.individualId = null;
            this.startTrackingChanges();
          }
        });
      },
      error: (error) => {
        console.error('Error loading configurations:', error);
      }
    });

    this.initializeForm();
    this.initializeLocationForm();
    this.initializeFinancialForms();
    this.initializeUploadForm();

    // Track changes to gender and marital status
    this.personalInfoForm.get('gender')?.valueChanges.subscribe(value => {
      console.log('👤 Gender changed to:', value);
    });

    this.personalInfoForm.get('maritalStatus')?.valueChanges.subscribe(value => {
      console.log('💍 Marital Status changed to:', value);
    });
  }

  // ==================== FORM INITIALIZATION ====================
  initializeForm(): void {
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      fathersName: ['', [Validators.required, Validators.minLength(2)]],
      mothersName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', [Validators.required, this.ageValidator]],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      idNumber: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      uploadId: [null]
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
    this.basicInfoForm = this.fb.group({
      creditPurpose: ['', Validators.required],
      incomeType: ['', Validators.required]
    });

    this.employerInfoForm = this.fb.group({
      employerType: ['', Validators.required],
      employerName: ['', Validators.required],
      employmentStatus: ['', Validators.required],
      jobDesignation: ['', Validators.required],
      jobTenureYears: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      monthlyGrossIncome: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      monthlyNetIncome: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });

    this.businessInfoForm = this.fb.group({
      businessName: ['', Validators.required],
      businessType: ['', Validators.required],
      industryType: ['', Validators.required],
      yearsInBusiness: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      monthlyBusinessIncome: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });

    this.creditInfoForm = this.fb.group({
      requestedLoanAmount: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      downPaymentAmount: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      loanTenureMonths: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      repaymentPreference: ['', Validators.required],
      existingLoanDetails: ['', Validators.required],
      creditCardDetails: ['', Validators.required]
    });

    this.securityInfoForm = this.fb.group({
      collateralAvailable: ['', Validators.required],
      collateralType: [''],
      estimatedCollateralValue: ['', Validators.pattern(/^[0-9]+$/)],
      guarantorAvailable: ['', Validators.required],
      coApplicantAvailable: ['', Validators.required]
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
      idCopy: ['', Validators.required],
      idCopyFilename: [''],
      photograph: ['', Validators.required],
      photographFilename: [''],
      salaryCertificate: ['', Validators.required],
      salaryCertificateFilename: [''],
      bankStatement: ['', Validators.required],
      bankStatementFilename: [''],
      incomeTaxReturn: ['', Validators.required],
      incomeTaxReturnFilename: [''],
      cibConsentForm: ['', Validators.required],
      cibConsentFormFilename: [''],
      finalDeclaration: [false, Validators.requiredTrue]
    });
  }

  // ==================== VALIDATORS ====================
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

  // ==================== DATA LOADING ====================
  private loadIndividualData(individualId: number): void {
    this.creditService.getIndividualById(individualId).subscribe({
      next: (data) => {
        this.populateForms(data);

        setTimeout(() => {
          this.startTrackingChanges();
        }, 100);
      },
      error: (error) => {
        console.error('Error loading individual data:', error);
        this.showAlert('Failed to load existing data', 'error');
        this.startTrackingChanges();
      }
    });
  }

  private populateForms(data: any): void {
    // Personal Info Form
    if (data.personal) {
      this.personalInfoForm.patchValue({
        firstName: data.personal.firstName,
        lastName: data.personal.lastName,
        fathersName: data.personal.fathersName,
        mothersName: data.personal.mothersName,
        dateOfBirth: data.personal.dateOfBirth,
        gender: data.personal.gender?.id || '',
        maritalStatus: data.personal.maritalStatus?.id || '',
        idNumber: data.personal.idNumber,
        phoneNumber: data.personal.phoneNumber,
        email: data.personal.email,
        uploadId: data.personal.uploadId
      });
    }

    // Location Form
    if (data.location) {
      this.locationForm.patchValue({
        presentAddress: data.location.presentAddress,
        permanentAddress: data.location.permanentAddress,
        city: data.location.city,
        stateOrDistrict: data.location.stateOrDistrict,
        postalCode: data.location.postalCode,
        country: data.location.country,
        lengthOfStay: data.location.lengthOfStay
      });
    }

    // Financial Forms
    if (data.financial) {
      this.financialInfoId = data.financial.financialId;

      if (data.financial.basicInfo) {
        this.basicInfoForm.patchValue({
          creditPurpose: data.financial.basicInfo.creditPurpose && data.financial.basicInfo.creditPurpose.length > 0
            ? data.financial.basicInfo.creditPurpose[0].id
            : '',
          incomeType: data.financial.basicInfo.incomeType && data.financial.basicInfo.incomeType.length > 0
            ? data.financial.basicInfo.incomeType[0].id
            : ''
        });
      }

      if (data.financial.employerInfo) {
        this.employerInfoForm.patchValue({
          employerType: data.financial.employerInfo.employerType?.id || '',
          employerName: data.financial.employerInfo.employerName,
          employmentStatus: data.financial.employerInfo.employmentStatus?.id || '',
          jobDesignation: data.financial.employerInfo.jobDesignation,
          jobTenureYears: data.financial.employerInfo.jobTenureYears,
          monthlyGrossIncome: data.financial.employerInfo.monthlyGrossIncome,
          monthlyNetIncome: data.financial.employerInfo.monthlyNetIncome
        });
      }

      if (data.financial.businessInfo) {
        this.businessInfoForm.patchValue({
          businessName: data.financial.businessInfo.businessName,
          businessType: data.financial.businessInfo.businessType?.id || '',
          industryType: data.financial.businessInfo.industryType,
          yearsInBusiness: data.financial.businessInfo.yearsInBusiness,
          monthlyBusinessIncome: data.financial.businessInfo.monthlyBusinessIncome
        });
      }

      if (data.financial.creditInfo) {
        this.creditInfoForm.patchValue({
          requestedLoanAmount: data.financial.creditInfo.requestedLoanAmount,
          downPaymentAmount: data.financial.creditInfo.downPaymentAmount,
          loanTenureMonths: data.financial.creditInfo.loanTenureMonths,
          repaymentPreference: data.financial.creditInfo.repaymentPreference?.id || '',
          existingLoanDetails: data.financial.creditInfo.existingLoanDetails,
          creditCardDetails: data.financial.creditInfo.creditCardDetails
        });
      }

      if (data.financial.securityInfo) {
        this.securityInfoForm.patchValue({
          collateralAvailable: data.financial.securityInfo.collateralAvailable,
          collateralType: data.financial.securityInfo.collateralType?.id || '',
          estimatedCollateralValue: data.financial.securityInfo.estimatedCollateralValue,
          guarantorAvailable: data.financial.securityInfo.guarantorAvailable,
          coApplicantAvailable: data.financial.securityInfo.coApplicantAvailable
        });
      }
    }

    // Upload Form
    if (data.uploads) {
      this.uploadForm.patchValue({
        idCopy: data.uploads.idCopy || '',
        idCopyFilename: data.uploads.idCopyFilename || '',
        photograph: data.uploads.photograph || '',
        photographFilename: data.uploads.photographFilename || '',
        salaryCertificate: data.uploads.salaryCertificate || '',
        salaryCertificateFilename: data.uploads.salaryCertificateFilename || '',
        bankStatement: data.uploads.bankStatement || '',
        bankStatementFilename: data.uploads.bankStatementFilename || '',
        incomeTaxReturn: data.uploads.incomeTaxReturn || '',
        incomeTaxReturnFilename: data.uploads.incomeTaxReturnFilename || '',
        cibConsentForm: data.uploads.cibConsentForm || '',
        cibConsentFormFilename: data.uploads.cibConsentFormFilename || ''
      });

      // Update uploadedFiles for display
      this.uploadedFiles.idCopy = {
        path: data.uploads.idCopy,
        filename: data.uploads.idCopyFilename
      };
      this.uploadedFiles.photograph = {
        path: data.uploads.photograph,
        filename: data.uploads.photographFilename
      };
      this.uploadedFiles.salaryCertificate = {
        path: data.uploads.salaryCertificate,
        filename: data.uploads.salaryCertificateFilename
      };
      this.uploadedFiles.bankStatement = {
        path: data.uploads.bankStatement,
        filename: data.uploads.bankStatementFilename
      };
      this.uploadedFiles.incomeTaxReturn = {
        path: data.uploads.incomeTaxReturn,
        filename: data.uploads.incomeTaxReturnFilename
      };
      this.uploadedFiles.cibConsentForm = {
        path: data.uploads.cibConsentForm,
        filename: data.uploads.cibConsentFormFilename
      };
    }

    console.log('Forms populated successfully');
  }

  // ==================== CHANGE TRACKING ====================
  private startTrackingChanges(): void {
    this.personalInfoForm.valueChanges.subscribe(() => this.hasUnsavedChanges = true);
    this.locationForm.valueChanges.subscribe(() => this.hasUnsavedChanges = true);
    this.basicInfoForm.valueChanges.subscribe(() => this.hasUnsavedChanges = true);
    this.employerInfoForm.valueChanges.subscribe(() => this.hasUnsavedChanges = true);
    this.businessInfoForm.valueChanges.subscribe(() => this.hasUnsavedChanges = true);
    this.creditInfoForm.valueChanges.subscribe(() => this.hasUnsavedChanges = true);
    this.securityInfoForm.valueChanges.subscribe(() => this.hasUnsavedChanges = true);
    this.uploadForm.valueChanges.subscribe(() => this.hasUnsavedChanges = true);

    console.log('✅ Started tracking form changes');
  }

  updateFormState(): void {
    // Update any derived state based on form values
  }

  // ==================== SAVE & SUBMIT ====================
  onSaveAll(isFinalSubmit: boolean = false): void {
    if (isFinalSubmit && !this.consentAccepted) {
      this.showAlert('Please accept the user consent to submit.', 'error');
      return;
    }

    if (!this.currentUserId) {
      this.showAlert('User session expired. Please log in.', 'error');
      return;
    }

    // Upload pending files first (if individualId exists)
    if (this.individualId && Object.keys(this.pendingUploads).length > 0) {
      this.uploadPendingFiles().subscribe({
        next: (uploadedData: { [key: string]: { path: string; filename: string } }) => {
          // Update uploadForm with paths and filenames
          Object.keys(uploadedData).forEach((fieldName) => {
            this.uploadForm.patchValue({
              [fieldName]: uploadedData[fieldName].path,
              [`${fieldName}Filename`]: uploadedData[fieldName].filename
            });

            this.uploadedFiles[fieldName] = {
              path: uploadedData[fieldName].path,
              filename: uploadedData[fieldName].filename
            };
          });

          // Clear pending uploads
          this.pendingUploads = {};

          // Now save with uploaded paths
          this.performSave(isFinalSubmit);
        },
        error: (err) => {
          console.error('Error uploading files:', err);
          this.showAlert('Failed to upload one or more files. Please try again.', 'error');
        }
      });
    } else {
      this.performSave(isFinalSubmit);
    }
  }

  private performSave(isFinalSubmit: boolean): void {
    console.log('🟡 PERFORM SAVE - Before creating payload:');
    console.log('   Gender:', this.personalInfoForm.get('gender')?.value);
    console.log('   Marital Status:', this.personalInfoForm.get('maritalStatus')?.value);

    const consolidatedPayload = this.getConsolidatedPayload();

    console.log('🟢 PAYLOAD CREATED:', consolidatedPayload);
    console.log('   Payload genderId:', consolidatedPayload.genderId);
    console.log('   Payload maritalStatusId:', consolidatedPayload.maritalStatusId);

    const action = isFinalSubmit ? 'SUBMIT' : 'SAVE';

    // Single API call to handle everything
    this.creditService.saveFullCreditScoring(consolidatedPayload, this.currentUserId, action).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          // Update IDs returned from the database
          if (response.individualId) {
            this.individualId = response.individualId;
          }
          if (response.financialInfoId) {
            this.financialInfoId = response.financialInfoId;
          }

          this.hasUnsavedChanges = false;

          if (isFinalSubmit) {
            this.showAlert('Application submitted successfully!', 'success');
            setTimeout(() => this.closeModal.emit(), 1500);
          } else {
            this.showAlert('Progress saved successfully!', 'success');
          }
        } else {
          this.showAlert(response.message || 'Failed to save data.', 'error');
        }
      },
      error: (err) => {
        console.error('Server error during unified save:', err);
        this.showAlert('A connection error occurred.', 'error');
      }
    });
  }

  private getConsolidatedPayload() {
    const basicInfo = this.basicInfoForm.value;

    return {
      id: this.individualId || null,
      firstName: this.personalInfoForm.value.firstName,
      lastName: this.personalInfoForm.value.lastName,
      fatherName: this.personalInfoForm.value.fathersName,
      motherName: this.personalInfoForm.value.mothersName,
      dateOfBirth: this.personalInfoForm.value.dateOfBirth,
      genderId: this.personalInfoForm.value.gender,
      maritalStatusId: this.personalInfoForm.value.maritalStatus,
      phoneNumber: this.personalInfoForm.value.phoneNumber,
      email: this.personalInfoForm.value.email,
      nationalIdPassportNo: this.personalInfoForm.value.idNumber,

      presentAddress: this.locationForm.value.presentAddress,
      permanentAddress: this.locationForm.value.permanentAddress,
      city: this.locationForm.value.city,
      stateProvince: this.locationForm.value.stateOrDistrict,
      postalCode: this.locationForm.value.postalCode,
      countryCode: this.locationForm.value.country,

      idCopyUrl: this.uploadForm.value.idCopy,
      idCopyFilename: this.uploadForm.value.idCopyFilename,
      photographUrl: this.uploadForm.value.photograph,
      photographFilename: this.uploadForm.value.photographFilename,
      salaryCertificateUrl: this.uploadForm.value.salaryCertificate,
      salaryCertificateFilename: this.uploadForm.value.salaryCertificateFilename,
      bankStatementUrl: this.uploadForm.value.bankStatement,
      bankStatementFilename: this.uploadForm.value.bankStatementFilename,
      incomeTaxReturnUrl: this.uploadForm.value.incomeTaxReturn,
      incomeTaxReturnFilename: this.uploadForm.value.incomeTaxReturnFilename,
      cibConsentFormUrl: this.uploadForm.value.cibConsentForm,
      cibConsentFormFilename: this.uploadForm.value.cibConsentFormFilename,

      financialId: this.financialInfoId || null,

      employerTypeId: this.employerInfoForm.value.employerType,
      employerName: this.employerInfoForm.value.employerName,
      employmentStatusId: this.employerInfoForm.value.employmentStatus,
      jobDesignation: this.employerInfoForm.value.jobDesignation,
      jobTenureYears: this.employerInfoForm.value.jobTenureYears,
      monthlyGrossIncome: this.employerInfoForm.value.monthlyGrossIncome,
      monthlyNetIncome: this.employerInfoForm.value.monthlyNetIncome,

      businessName: this.businessInfoForm.value.businessName,
      businessTypeId: this.businessInfoForm.value.businessType,
      industryType: this.businessInfoForm.value.industryType,
      yearsInBusiness: this.businessInfoForm.value.yearsInBusiness,
      monthlyBusinessIncome: this.businessInfoForm.value.monthlyBusinessIncome,

      requestedLoanAmount: this.creditInfoForm.value.requestedLoanAmount,
      downPaymentAmount: this.creditInfoForm.value.downPaymentAmount,
      loanTenureMonths: this.creditInfoForm.value.loanTenureMonths,
      repaymentPreferenceId: this.creditInfoForm.value.repaymentPreference,
      existingLoanDetails: this.creditInfoForm.value.existingLoanDetails,
      creditCardDetails: this.creditInfoForm.value.creditCardDetails,

      collateralAvailable: this.securityInfoForm.value.collateralAvailable,
      collateralTypeId: this.securityInfoForm.value.collateralType,
      estimatedCollateralValue: this.securityInfoForm.value.estimatedCollateralValue,
      guarantorAvailable: this.securityInfoForm.value.guarantorAvailable,
      coApplicantAvailable: this.securityInfoForm.value.coApplicantAvailable,

      incomeTypeId: basicInfo.incomeType ? [basicInfo.incomeType] : [],
      creditPurposeId: basicInfo.creditPurpose ? [basicInfo.creditPurpose] : []
    };
  }

  // ==================== FILE UPLOAD ====================
  private uploadPendingFiles(): Observable<{ [key: string]: { path: string; filename: string } }> {
    const uploadObservables: { [key: string]: Observable<{ path: string; filename: string }> } = {};

    if (Object.keys(this.pendingUploads).length === 0) {
      return of({});
    }

    Object.keys(this.pendingUploads).forEach((fieldName) => {
      const file = this.pendingUploads[fieldName];
      uploadObservables[fieldName] = this.creditService.uploadDocument(file, this.individualId, fieldName);
    });

    return forkJoin(uploadObservables).pipe(
      map((results: { [key: string]: { path: string; filename: string } }) => {
        return results;
      })
    );
  }

  triggerUploadInput(type: string): void {
    switch(type) {
      case 'idCopy':
        this.idCopyInput?.nativeElement.click();
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
      case 'cibConsent':
        this.cibConsentInput?.nativeElement.click();
        break;
      case 'loanStatements':
        this.loanStatementsInput?.nativeElement.click();
        break;
      case 'creditCard':
        this.creditCardInput?.nativeElement.click();
        break;
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

      // Store the file temporarily for later upload
      this.pendingUploads[fieldName] = file;

      // Update form with original filename for display
      this.uploadForm.patchValue({
        [`${fieldName}Filename`]: file.name
      });

      // Update uploadedFiles for display
      this.uploadedFiles[fieldName] = {
        path: null,
        filename: file.name
      };

      // this.showAlert(`File selected: ${file.name}`, 'success');
      input.value = '';
    }
  }

  // ==================== NAVIGATION & UI ====================
  onStepClick(stepId: number): void {
    // Check if step validation is enforced
    if (this.enforceStepValidation) {
      // Can only navigate to next step if current step is valid
      if (stepId > this.currentStep && !this.validateCurrentStep()) {
        this.showAlert('Please complete the current step before proceeding.', 'warning');
        return;
      }
    }

    this.currentStep = stepId;
    this.loadStepData(stepId);
  }

  goToNextStep(): void {
    // Validate current step before proceeding
    if (!this.validateCurrentStep()) {
      this.showAlert('Please complete all required fields in this step.', 'error');
      return;
    }

    // Move to next step if not at the end
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      this.loadStepData(this.currentStep);
    }
  }

  goToPreviousStep(): void {
    // Always allow going back
    if (this.currentStep > 1) {
      this.currentStep--;
      this.loadStepData(this.currentStep);
    }
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

  toggleAccordion(section: string): void {
    this.expandedSection = this.expandedSection === section ? '' : section;
  }

  toggleUploadSection(section: string): void {
    this.expandedUploadSection = this.expandedUploadSection === section ? '' : section;
  }

  toggleNestedSection(section: string): void {
    this.expandedNestedSection = this.expandedNestedSection === section ? '' : section;
  }

  toggleSelectDropdown(): void {
    this.isSelectDropdownOpen = !this.isSelectDropdownOpen;
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.isSelectDropdownOpen = false;
    console.log('Selected option:', option);
  }

  // ==================== VALIDATION ====================
  updateUploadSectionStatus(): void {
    this.uploadSections.identity = !!(
      this.uploadForm.get('idCopy')?.value &&
      this.uploadForm.get('photograph')?.value
    );

    this.uploadSections.employment = !!(
      this.uploadForm.get('salaryCertificate')?.value
    );

    this.uploadSections.credit = !!(
      this.uploadForm.get('bankStatement')?.value &&
      this.uploadForm.get('incomeTaxReturn')?.value &&
      this.uploadForm.get('cibConsentForm')?.value
    );

    this.uploadSections.declaration = this.uploadForm.get('finalDeclaration')?.value || false;
  }

  validateUploadSection(): boolean {
    const identityValid = !!(
      this.uploadedFiles.passportPhoto &&
      this.uploadedFiles.utility &&
      this.uploadedFiles.tin
    );

    const employmentValid = !!(
      this.uploadedFiles.salary &&
      this.uploadedFiles.employerId &&
      this.uploadedFiles.paySlip &&
      this.uploadedFiles.appointment
    );

    const businessValid = !!(
      this.businessUploadInfo.businessType &&
      this.businessUploadInfo.yearsInBusiness &&
      this.businessUploadInfo.businessRevenue &&
      this.businessUploadInfo.industryType &&
      this.businessUploadInfo.businessName
    );

    const creditValid = !!(
      this.uploadedFiles.cibConsent &&
      this.uploadedFiles.loanStatements &&
      this.uploadedFiles.creditCard
    );

    const collateralValid = !!(
      this.uploadedFiles.fdr &&
      this.uploadedFiles.gold
    );

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

  // ==================== MODAL CONTROLS ====================
  close(): void {
    if (this.hasUnsavedChanges) {
      this.showCloseConfirmation = true;
    } else {
      this.confirmClose();
    }
  }

  confirmClose(): void {
    this.showCloseConfirmation = false;
    this.closeModal.emit();
  }

  cancelClose(): void {
    this.showCloseConfirmation = false;
  }

  // ==================== NOTIFICATIONS ====================
  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
  }

  onNotificationDismissed(): void {
    this.showNotification = false;
  }
}
