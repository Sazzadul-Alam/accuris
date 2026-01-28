import { Component, ElementRef, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BusinessCreditService } from "./business-credit-scoring-api-service";
import { switchMap, tap, catchError } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-business-credit-scoring-modal',
  templateUrl: './business-credit-scoring-modal.component.html',
  styleUrls: ['./business-credit-scoring-modal.component.css']
})
export class BusinessCreditScoringModalComponent {
  @Input() selectedPlanInput = '';
  @Input() currentUserId: number = null;  // The logged-in user (bank employee/admin)
  @Input() currentUserName: string = '';
  @Output() closeModal= new EventEmitter<void>();
  @Output() formSubmit= new EventEmitter<any>();
  @Output() saved= new EventEmitter<any>();

  // Document Upload ViewChild References
  @ViewChild('tradeLicenseInput') tradeLicenseInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tinCertificateInput') tinCertificateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('vatCertificateInput') vatCertificateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('financialStatementsInput') financialStatementsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bankStatementInput') bankStatementInput!: ElementRef<HTMLInputElement>;
  @ViewChild('titleDeedInput') titleDeedInput!: ElementRef<HTMLInputElement>;
  @ViewChild('valuationReportInput') valuationReportInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cibConsentFormInput') cibConsentFormInput!: ElementRef<HTMLInputElement>;

  configurations: any = {
    legalStatuses: [],
    natureOfBusinesses: [],
    designations: [],
    cibStatuses: [],
    financialYears: [],
    auditStatuses: [],
    accountTypes: [],
    repaymentBehaviors: [],
    pastDueStatuses: [],
    chequeReturnHistories: [],
    loanTypes: [],
    loanPurposes: [],
    repaymentModes: [],
    interestTypes: [],
    securityTypes: [],
    propertyTypes: [],
    mortgageStatuses: [],
    guaranteeStatuses: []
  };

  // Track the business being processed
  businessId: number = null;
  financialInfoId: number = null;
  bankingInfoId: number = null;
  loanInfoId: number = null;
  securityInfoId: number = null;
  pendingUploads: { [key: string]: File } = {};

  // Form Groups
  businessProfileForm!: FormGroup;
  ownershipManagementForm!: FormGroup;
  financialInfoForm!: FormGroup;
  bankingRelationshipForm!: FormGroup;
  loanRequirementForm!: FormGroup;
  securityCollateralForm!: FormGroup;
  uploadForm!: FormGroup;

  currentStep: number = 1;
  selectedFileName: string = '';

  expandedSection: string = '';
  businessSections = {
    businessProfile: false,
    ownershipManagement: false,
    financialInfo: false,
    bankingRelationship: false,
    loanRequirement: false,
    securityCollateral: false
  };

  expandedUploadSection: string = '';
  uploadSections = {
    businessDocs: false,
    financialDocs: false,
    securityDocs: false,
    declaration: false
  };

  uploadedFiles: any = {
    tradeLicense: { path: null, filename: null },
    tinCertificate: { path: null, filename: null },
    vatCertificate: { path: null, filename: null },
    financialStatements: { path: null, filename: null },
    bankStatement: { path: null, filename: null },
    titleDeed: { path: null, filename: null },
    valuationReport: { path: null, filename: null },
    cibConsentForm: { path: null, filename: null }
  };

  isUploadSectionValid: boolean = false;

  consentAccepted: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' | '' = '';
  showNotificationFlag: boolean = false;
  showUnsavedChangesWarning: boolean = false;
  showCloseConfirmation: boolean = false;
  fileErrorMessage: string = '';

  steps = [
    { id: 1, name: "Business Profile", icon: 'business' },
    { id: 2, name: 'Ownership & Management', icon: 'people' },
    { id: 3, name: 'Financial Info', icon: 'finance' },
    { id: 4, name: 'Banking Relationship', icon: 'bank' },
    { id: 5, name: 'Loan Requirement', icon: 'loan' },
    { id: 6, name: 'Security & Collateral', icon: 'security' },
    { id: 7, name: 'Upload & Declaration', icon: 'upload' }
  ];

  constructor(
    private fb: FormBuilder,
    private creditService: BusinessCreditService
  ) {}

  private uploadPendingFiles(): Observable<{ [key: string]: { path: string; filename: string } }> {
    const uploadObservables: { [key: string]: Observable<{ path: string; filename: string }> } = {};

    if (Object.keys(this.pendingUploads).length === 0) {
      return of({});
    }

    Object.keys(this.pendingUploads).forEach((fieldName) => {
      const file = this.pendingUploads[fieldName];
      uploadObservables[fieldName] = this.creditService.uploadDocument(file, this.businessId, fieldName);
    });

    return forkJoin(uploadObservables).pipe(
      map((results: { [key: string]: { path: string; filename: string } }) => {
        return results;
      })
    );
  }

  private getConsolidatedPayload() {
    return {
      id: this.businessId || null,

      // Business Profile & Basic Information
      businessName: this.businessProfileForm.value.businessName,
      legalStatusId: this.businessProfileForm.value.legalStatus,
      natureOfBusinessId: this.businessProfileForm.value.natureOfBusiness,
      dateOfIncorporation: this.businessProfileForm.value.dateOfIncorporation,
      tradeLicenseNumber: this.businessProfileForm.value.tradeLicenseNumber,
      tradeLicenseExpiryDate: this.businessProfileForm.value.tradeLicenseExpiryDate,
      tinNumber: this.businessProfileForm.value.tinNumber,
      vatBinNumber: this.businessProfileForm.value.vatBinNumber,
      rjscRegistrationNumber: this.businessProfileForm.value.rjscRegistrationNumber,
      businessAddress: this.businessProfileForm.value.businessAddress,
      factoryAddress: this.businessProfileForm.value.factoryAddress,
      businessMobileNumber: this.businessProfileForm.value.businessMobileNumber,
      businessEmail: this.businessProfileForm.value.businessEmail,

      // Ownership & Management Information
      ownerDirectorName: this.ownershipManagementForm.value.ownerDirectorName,
      fatherMotherName: this.ownershipManagementForm.value.fatherMotherName,
      nationalIdNumber: this.ownershipManagementForm.value.nationalIdNumber,
      dateOfBirth: this.ownershipManagementForm.value.dateOfBirth,
      shareholdingPercentage: this.ownershipManagementForm.value.shareholdingPercentage,
      designationId: this.ownershipManagementForm.value.designation,
      yearsOfBusinessExperience: this.ownershipManagementForm.value.yearsOfBusinessExperience,
      ownerMobileNumber: this.ownershipManagementForm.value.mobileNumber,
      ownerEmail: this.ownershipManagementForm.value.email,
      cibStatusId: this.ownershipManagementForm.value.cibStatus,
      relatedBusinessDetails: this.ownershipManagementForm.value.relatedBusinessDetails,

      // Financial Information
      financialInfoId: this.financialInfoId || null,
      financialYearId: this.financialInfoForm.value.financialYear,
      auditStatusId: this.financialInfoForm.value.auditStatus,
      annualTurnover: this.financialInfoForm.value.annualTurnover,
      grossProfit: this.financialInfoForm.value.grossProfit,
      netProfitAfterTax: this.financialInfoForm.value.netProfitAfterTax,
      totalAssets: this.financialInfoForm.value.totalAssets,
      totalLiabilities: this.financialInfoForm.value.totalLiabilities,
      netWorth: this.financialInfoForm.value.netWorth,
      currentAssets: this.financialInfoForm.value.currentAssets,
      currentLiabilities: this.financialInfoForm.value.currentLiabilities,
      interestExpense: this.financialInfoForm.value.interestExpense,
      ebitda: this.financialInfoForm.value.ebitda,

      // Banking Relationship & Account Conduct
      bankingInfoId: this.bankingInfoId || null,
      existingBankName: this.bankingRelationshipForm.value.existingBankName,
      accountTypeId: this.bankingRelationshipForm.value.accountType,
      relationshipDurationYears: this.bankingRelationshipForm.value.relationshipDurationYears,
      averageBalance: this.bankingRelationshipForm.value.averageBalance,
      limitSanctioned: this.bankingRelationshipForm.value.limitSanctioned,
      averageUtilizationPercentage: this.bankingRelationshipForm.value.averageUtilizationPercentage,
      repaymentBehaviorId: this.bankingRelationshipForm.value.repaymentBehavior,
      pastDueStatusId: this.bankingRelationshipForm.value.pastDueStatus,
      chequeReturnHistoryId: this.bankingRelationshipForm.value.chequeReturnHistory,

      // Loan Requirement Details
      loanInfoId: this.loanInfoId || null,
      loanTypeId: this.loanRequirementForm.value.loanType,
      requestedLoanAmount: this.loanRequirementForm.value.requestedLoanAmount,
      loanPurposeId: this.loanRequirementForm.value.loanPurpose,
      detailedPurposeDescription: this.loanRequirementForm.value.detailedPurposeDescription,
      loanTenureMonths: this.loanRequirementForm.value.loanTenureMonths,
      repaymentModeId: this.loanRequirementForm.value.repaymentMode,
      proposedInterestTypeId: this.loanRequirementForm.value.proposedInterestType,

      // Security & Collateral Information
      securityInfoId: this.securityInfoId || null,
      securityTypeId: this.securityCollateralForm.value.securityType,
      propertyTypeId: this.securityCollateralForm.value.propertyType,
      propertyLocation: this.securityCollateralForm.value.propertyLocation,
      ownershipName: this.securityCollateralForm.value.ownershipName,
      marketValue: this.securityCollateralForm.value.marketValue,
      forcedSaleValue: this.securityCollateralForm.value.forcedSaleValue,
      mortgageStatusId: this.securityCollateralForm.value.mortgageStatus,
      personalGuaranteeId: this.securityCollateralForm.value.personalGuarantee,
      corporateGuaranteeId: this.securityCollateralForm.value.corporateGuarantee,

      // Document Upload URLs and Filenames
      tradeLicenseUrl: this.uploadForm.value.tradeLicense,
      tradeLicenseFilename: this.uploadForm.value.tradeLicenseFilename,
      tinCertificateUrl: this.uploadForm.value.tinCertificate,
      tinCertificateFilename: this.uploadForm.value.tinCertificateFilename,
      vatCertificateUrl: this.uploadForm.value.vatCertificate,
      vatCertificateFilename: this.uploadForm.value.vatCertificateFilename,
      financialStatementsUrl: this.uploadForm.value.financialStatements,
      financialStatementsFilename: this.uploadForm.value.financialStatementsFilename,
      bankStatementUrl: this.uploadForm.value.bankStatement,
      bankStatementFilename: this.uploadForm.value.bankStatementFilename,
      titleDeedUrl: this.uploadForm.value.titleDeed,
      titleDeedFilename: this.uploadForm.value.titleDeedFilename,
      valuationReportUrl: this.uploadForm.value.valuationReport,
      valuationReportFilename: this.uploadForm.value.valuationReportFilename,
      cibConsentFormUrl: this.uploadForm.value.cibConsentForm,
      cibConsentFormFilename: this.uploadForm.value.cibConsentFormFilename
    };
  }

  ngOnInit(): void {
    // Load configurations first
    this.creditService.getAllConfigurations().subscribe({
      next: (configs) => {
        this.configurations = configs;

        // Then load business data
        this.creditService.getLatestBusinessId(this.currentUserId).subscribe({
          next: (response) => {
            this.businessId = response.businessId;
            console.log('Latest Business ID:', this.businessId);

            if (this.businessId) {
              this.loadBusinessData(this.businessId);
            }
          },
          error: (error) => {
            console.error('Error fetching latest business:', error);
            this.businessId = null;
          }
        });
      },
      error: (error) => {
        console.error('Error loading configurations:', error);
      }
    });

    this.initializeBusinessProfileForm();
    this.initializeOwnershipManagementForm();
    this.initializeFinancialInfoForm();
    this.initializeBankingRelationshipForm();
    this.initializeLoanRequirementForm();
    this.initializeSecurityCollateralForm();
    this.initializeUploadForm();

    // Track changes for validation
    this.businessProfileForm.valueChanges.subscribe(() => {
      this.updateFormState();
    });

    this.ownershipManagementForm.valueChanges.subscribe(() => {
      this.updateFormState();
    });
  }

  private loadBusinessData(businessId: number): void {
    this.creditService.getBusinessById(businessId).subscribe({
      next: (data) => {
        this.populateForms(data);
      },
      error: (error) => {
        console.error('Error loading business data:', error);
        this.showNotification('Failed to load existing data', 'error');
      }
    });
  }

  private populateForms(data: any): void {
    // Business Profile Form
    if (data.businessProfile) {
      this.businessProfileForm.patchValue({
        businessName: data.businessProfile.businessName,
        legalStatus: data.businessProfile.legalStatus?.id || '',
        natureOfBusiness: data.businessProfile.natureOfBusiness?.id || '',
        dateOfIncorporation: data.businessProfile.dateOfIncorporation,
        tradeLicenseNumber: data.businessProfile.tradeLicenseNumber,
        tradeLicenseExpiryDate: data.businessProfile.tradeLicenseExpiryDate,
        tinNumber: data.businessProfile.tinNumber,
        vatBinNumber: data.businessProfile.vatBinNumber,
        rjscRegistrationNumber: data.businessProfile.rjscRegistrationNumber,
        businessAddress: data.businessProfile.businessAddress,
        factoryAddress: data.businessProfile.factoryAddress,
        businessMobileNumber: data.businessProfile.businessMobileNumber,
        businessEmail: data.businessProfile.businessEmail
      });
    }

    // Ownership & Management Form
    if (data.ownershipManagement) {
      this.ownershipManagementForm.patchValue({
        ownerDirectorName: data.ownershipManagement.ownerDirectorName,
        fatherMotherName: data.ownershipManagement.fatherMotherName,
        nationalIdNumber: data.ownershipManagement.nationalIdNumber,
        dateOfBirth: data.ownershipManagement.dateOfBirth,
        shareholdingPercentage: data.ownershipManagement.shareholdingPercentage,
        designation: data.ownershipManagement.designation?.id || '',
        yearsOfBusinessExperience: data.ownershipManagement.yearsOfBusinessExperience,
        mobileNumber: data.ownershipManagement.mobileNumber,
        email: data.ownershipManagement.email,
        cibStatus: data.ownershipManagement.cibStatus?.id || '',
        relatedBusinessDetails: data.ownershipManagement.relatedBusinessDetails
      });
    }

    // Financial Information Form
    if (data.financialInfo) {
      this.financialInfoId = data.financialInfo.financialInfoId;

      this.financialInfoForm.patchValue({
        financialYear: data.financialInfo.financialYear?.id || '',
        auditStatus: data.financialInfo.auditStatus?.id || '',
        annualTurnover: data.financialInfo.annualTurnover,
        grossProfit: data.financialInfo.grossProfit,
        netProfitAfterTax: data.financialInfo.netProfitAfterTax,
        totalAssets: data.financialInfo.totalAssets,
        totalLiabilities: data.financialInfo.totalLiabilities,
        netWorth: data.financialInfo.netWorth,
        currentAssets: data.financialInfo.currentAssets,
        currentLiabilities: data.financialInfo.currentLiabilities,
        interestExpense: data.financialInfo.interestExpense,
        ebitda: data.financialInfo.ebitda
      });
    }

    // Banking Relationship Form
    if (data.bankingRelationship) {
      this.bankingInfoId = data.bankingRelationship.bankingInfoId;

      this.bankingRelationshipForm.patchValue({
        existingBankName: data.bankingRelationship.existingBankName,
        accountType: data.bankingRelationship.accountType?.id || '',
        relationshipDurationYears: data.bankingRelationship.relationshipDurationYears,
        averageBalance: data.bankingRelationship.averageBalance,
        limitSanctioned: data.bankingRelationship.limitSanctioned,
        averageUtilizationPercentage: data.bankingRelationship.averageUtilizationPercentage,
        repaymentBehavior: data.bankingRelationship.repaymentBehavior?.id || '',
        pastDueStatus: data.bankingRelationship.pastDueStatus?.id || '',
        chequeReturnHistory: data.bankingRelationship.chequeReturnHistory?.id || ''
      });
    }

    // Loan Requirement Form
    if (data.loanRequirement) {
      this.loanInfoId = data.loanRequirement.loanInfoId;

      this.loanRequirementForm.patchValue({
        loanType: data.loanRequirement.loanType?.id || '',
        requestedLoanAmount: data.loanRequirement.requestedLoanAmount,
        loanPurpose: data.loanRequirement.loanPurpose?.id || '',
        detailedPurposeDescription: data.loanRequirement.detailedPurposeDescription,
        loanTenureMonths: data.loanRequirement.loanTenureMonths,
        repaymentMode: data.loanRequirement.repaymentMode?.id || '',
        proposedInterestType: data.loanRequirement.proposedInterestType?.id || ''
      });
    }

    // Security & Collateral Form
    if (data.securityCollateral) {
      this.securityInfoId = data.securityCollateral.securityInfoId;

      this.securityCollateralForm.patchValue({
        securityType: data.securityCollateral.securityType?.id || '',
        propertyType: data.securityCollateral.propertyType?.id || '',
        propertyLocation: data.securityCollateral.propertyLocation,
        ownershipName: data.securityCollateral.ownershipName,
        marketValue: data.securityCollateral.marketValue,
        forcedSaleValue: data.securityCollateral.forcedSaleValue,
        mortgageStatus: data.securityCollateral.mortgageStatus?.id || '',
        personalGuarantee: data.securityCollateral.personalGuarantee?.id || '',
        corporateGuarantee: data.securityCollateral.corporateGuarantee?.id || ''
      });
    }

    // Upload Form - Store BOTH path and filename
    if (data.uploads) {
      this.uploadForm.patchValue({
        tradeLicense: data.uploads.tradeLicense || '',
        tradeLicenseFilename: data.uploads.tradeLicenseFilename || '',
        tinCertificate: data.uploads.tinCertificate || '',
        tinCertificateFilename: data.uploads.tinCertificateFilename || '',
        vatCertificate: data.uploads.vatCertificate || '',
        vatCertificateFilename: data.uploads.vatCertificateFilename || '',
        financialStatements: data.uploads.financialStatements || '',
        financialStatementsFilename: data.uploads.financialStatementsFilename || '',
        bankStatement: data.uploads.bankStatement || '',
        bankStatementFilename: data.uploads.bankStatementFilename || '',
        titleDeed: data.uploads.titleDeed || '',
        titleDeedFilename: data.uploads.titleDeedFilename || '',
        valuationReport: data.uploads.valuationReport || '',
        valuationReportFilename: data.uploads.valuationReportFilename || '',
        cibConsentForm: data.uploads.cibConsentForm || '',
        cibConsentFormFilename: data.uploads.cibConsentFormFilename || ''
      });

      // Update uploadedFiles for display
      this.uploadedFiles.tradeLicense = {
        path: data.uploads.tradeLicense,
        filename: data.uploads.tradeLicenseFilename
      };
      this.uploadedFiles.tinCertificate = {
        path: data.uploads.tinCertificate,
        filename: data.uploads.tinCertificateFilename
      };
      this.uploadedFiles.vatCertificate = {
        path: data.uploads.vatCertificate,
        filename: data.uploads.vatCertificateFilename
      };
      this.uploadedFiles.financialStatements = {
        path: data.uploads.financialStatements,
        filename: data.uploads.financialStatementsFilename
      };
      this.uploadedFiles.bankStatement = {
        path: data.uploads.bankStatement,
        filename: data.uploads.bankStatementFilename
      };
      this.uploadedFiles.titleDeed = {
        path: data.uploads.titleDeed,
        filename: data.uploads.titleDeedFilename
      };
      this.uploadedFiles.valuationReport = {
        path: data.uploads.valuationReport,
        filename: data.uploads.valuationReportFilename
      };
      this.uploadedFiles.cibConsentForm = {
        path: data.uploads.cibConsentForm,
        filename: data.uploads.cibConsentFormFilename
      };
    }

    console.log('Forms populated successfully');
  }

  onSaveAll(isFinalSubmit: boolean = false): void {
    if (isFinalSubmit && !this.consentAccepted) {
      this.showNotification('Please accept the declaration to submit.', 'error');
      return;
    }

    if (!this.currentUserId) {
      this.showNotification('User session expired. Please log in.', 'error');
      return;
    }

    // Upload pending files first (if businessId exists)
    if (this.businessId && Object.keys(this.pendingUploads).length > 0) {
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
          this.showNotification('Failed to upload one or more files. Please try again.', 'error');
        }
      });
    } else {
      this.performSave(isFinalSubmit);
    }
  }

  private performSave(isFinalSubmit: boolean): void {
    console.log('🟡 PERFORM SAVE - Before creating payload');

    const consolidatedPayload = this.getConsolidatedPayload();

    console.log('🟢 PAYLOAD CREATED:', consolidatedPayload);

    const action = isFinalSubmit ? 'SUBMIT' : 'SAVE';

    // Single API call to handle everything
    this.creditService.saveFullBusinessCreditScoring(consolidatedPayload, this.currentUserId, action).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          // Update IDs returned from the database
          if (response.businessId) {
            this.businessId = response.businessId;
          }
          if (response.financialInfoId) {
            this.financialInfoId = response.financialInfoId;
          }
          if (response.bankingInfoId) {
            this.bankingInfoId = response.bankingInfoId;
          }
          if (response.loanInfoId) {
            this.loanInfoId = response.loanInfoId;
          }
          if (response.securityInfoId) {
            this.securityInfoId = response.securityInfoId;
          }

          if (isFinalSubmit) {
            this.showNotification('Business application submitted successfully!', 'success');
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

  initializeBusinessProfileForm(): void {
    this.businessProfileForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      legalStatus: ['', Validators.required],
      natureOfBusiness: ['', Validators.required],
      dateOfIncorporation: ['', Validators.required],
      tradeLicenseNumber: ['', Validators.required],
      tradeLicenseExpiryDate: ['', Validators.required],
      tinNumber: ['', Validators.required],
      vatBinNumber: ['', Validators.required],
      rjscRegistrationNumber: ['', Validators.required],
      businessAddress: ['', [Validators.required, Validators.minLength(10)]],
      factoryAddress: ['', Validators.minLength(10)],
      businessMobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      businessEmail: ['', [Validators.required, Validators.email]]
    });

    this.businessProfileForm.valueChanges.subscribe(() => {
      this.businessSections.businessProfile = this.businessProfileForm.valid;
    });
  }

  initializeOwnershipManagementForm(): void {
    this.ownershipManagementForm = this.fb.group({
      ownerDirectorName: ['', [Validators.required, Validators.minLength(2)]],
      fatherMotherName: ['', [Validators.required, Validators.minLength(2)]],
      nationalIdNumber: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, this.ageValidator]],
      shareholdingPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      designation: ['', Validators.required],
      yearsOfBusinessExperience: ['', [Validators.required, Validators.min(0)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      cibStatus: ['', Validators.required],
      relatedBusinessDetails: ['', Validators.minLength(10)]
    });

    this.ownershipManagementForm.valueChanges.subscribe(() => {
      this.businessSections.ownershipManagement = this.ownershipManagementForm.valid;
    });
  }

  initializeFinancialInfoForm(): void {
    this.financialInfoForm = this.fb.group({
      financialYear: ['', Validators.required],
      auditStatus: ['', Validators.required],
      annualTurnover: ['', [Validators.required, Validators.min(0)]],
      grossProfit: ['', [Validators.required, Validators.min(0)]],
      netProfitAfterTax: ['', Validators.required],
      totalAssets: ['', [Validators.required, Validators.min(0)]],
      totalLiabilities: ['', [Validators.required, Validators.min(0)]],
      netWorth: ['', Validators.required],
      currentAssets: ['', [Validators.required, Validators.min(0)]],
      currentLiabilities: ['', [Validators.required, Validators.min(0)]],
      interestExpense: ['', [Validators.required, Validators.min(0)]],
      ebitda: ['', Validators.required]
    });

    this.financialInfoForm.valueChanges.subscribe(() => {
      this.businessSections.financialInfo = this.financialInfoForm.valid;
    });
  }

  initializeBankingRelationshipForm(): void {
    this.bankingRelationshipForm = this.fb.group({
      existingBankName: ['', [Validators.required, Validators.minLength(2)]],
      accountType: ['', Validators.required],
      relationshipDurationYears: ['', [Validators.required, Validators.min(0)]],
      averageBalance: ['', [Validators.required, Validators.min(0)]],
      limitSanctioned: ['', [Validators.required, Validators.min(0)]],
      averageUtilizationPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      repaymentBehavior: ['', Validators.required],
      pastDueStatus: ['', Validators.required],
      chequeReturnHistory: ['', Validators.required]
    });

    this.bankingRelationshipForm.valueChanges.subscribe(() => {
      this.businessSections.bankingRelationship = this.bankingRelationshipForm.valid;
    });
  }

  initializeLoanRequirementForm(): void {
    this.loanRequirementForm = this.fb.group({
      loanType: ['', Validators.required],
      requestedLoanAmount: ['', [Validators.required, Validators.min(0)]],
      loanPurpose: ['', Validators.required],
      detailedPurposeDescription: ['', [Validators.required, Validators.minLength(20)]],
      loanTenureMonths: ['', [Validators.required, Validators.min(1)]],
      repaymentMode: ['', Validators.required],
      proposedInterestType: ['', Validators.required]
    });

    this.loanRequirementForm.valueChanges.subscribe(() => {
      this.businessSections.loanRequirement = this.loanRequirementForm.valid;
    });
  }

  initializeSecurityCollateralForm(): void {
    this.securityCollateralForm = this.fb.group({
      securityType: ['', Validators.required],
      propertyType: ['', Validators.required],
      propertyLocation: ['', [Validators.required, Validators.minLength(5)]],
      ownershipName: ['', [Validators.required, Validators.minLength(2)]],
      marketValue: ['', [Validators.required, Validators.min(0)]],
      forcedSaleValue: ['', [Validators.required, Validators.min(0)]],
      mortgageStatus: ['', Validators.required],
      personalGuarantee: ['', Validators.required],
      corporateGuarantee: ['', Validators.required]
    });

    this.securityCollateralForm.valueChanges.subscribe(() => {
      this.businessSections.securityCollateral = this.securityCollateralForm.valid;
    });
  }

  initializeUploadForm(): void {
    this.uploadForm = this.fb.group({
      // File paths
      tradeLicense: ['', Validators.required],
      tradeLicenseFilename: [''],
      tinCertificate: ['', Validators.required],
      tinCertificateFilename: [''],
      vatCertificate: ['', Validators.required],
      vatCertificateFilename: [''],
      financialStatements: ['', Validators.required],
      financialStatementsFilename: [''],
      bankStatement: ['', Validators.required],
      bankStatementFilename: [''],
      titleDeed: ['', Validators.required],
      titleDeedFilename: [''],
      valuationReport: ['', Validators.required],
      valuationReportFilename: [''],
      cibConsentForm: ['', Validators.required],
      cibConsentFormFilename: [''],

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
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        this.loadUploadData();
        break;
    }
  }

  loadUploadData(): void {
    // Upload data already in component state
    this.updateUploadSectionStatus();
    this.validateUploadSection();
  }

  updateUploadSectionStatus(): void {
    // Business Documents
    this.uploadSections.businessDocs = !!(
      this.uploadForm.get('tradeLicense')?.value &&
      this.uploadForm.get('tinCertificate')?.value &&
      this.uploadForm.get('vatCertificate')?.value
    );

    // Financial Documents
    this.uploadSections.financialDocs = !!(
      this.uploadForm.get('financialStatements')?.value &&
      this.uploadForm.get('bankStatement')?.value
    );

    // Security Documents
    this.uploadSections.securityDocs = !!(
      this.uploadForm.get('titleDeed')?.value &&
      this.uploadForm.get('valuationReport')?.value &&
      this.uploadForm.get('cibConsentForm')?.value
    );

    // Declaration
    this.uploadSections.declaration = this.uploadForm.get('finalDeclaration')?.value || false;
  }

  validateUploadSection(): boolean {
    // All required documents must be uploaded
    const allDocsValid = !!(
      this.uploadedFiles.tradeLicense.path &&
      this.uploadedFiles.tinCertificate.path &&
      this.uploadedFiles.vatCertificate.path &&
      this.uploadedFiles.financialStatements.path &&
      this.uploadedFiles.bankStatement.path &&
      this.uploadedFiles.titleDeed.path &&
      this.uploadedFiles.valuationReport.path &&
      this.uploadedFiles.cibConsentForm.path
    );

    this.isUploadSectionValid = allDocsValid && this.uploadForm.get('finalDeclaration')?.value;

    return this.isUploadSectionValid;
  }

  validateCurrentStep(): boolean {
    switch(this.currentStep) {
      case 1:
        return this.businessProfileForm.valid;
      case 2:
        return this.ownershipManagementForm.valid;
      case 3:
        return this.financialInfoForm.valid;
      case 4:
        return this.bankingRelationshipForm.valid;
      case 5:
        return this.loanRequirementForm.valid;
      case 6:
        return this.securityCollateralForm.valid;
      case 7:
        return this.validateUploadSection();
      default:
        return false;
    }
  }

  triggerUploadInput(type: string): void {
    switch(type) {
      case 'tradeLicense':
        this.tradeLicenseInput?.nativeElement.click();
        break;
      case 'tinCertificate':
        this.tinCertificateInput?.nativeElement.click();
        break;
      case 'vatCertificate':
        this.vatCertificateInput?.nativeElement.click();
        break;
      case 'financialStatements':
        this.financialStatementsInput?.nativeElement.click();
        break;
      case 'bankStatement':
        this.bankStatementInput?.nativeElement.click();
        break;
      case 'titleDeed':
        this.titleDeedInput?.nativeElement.click();
        break;
      case 'valuationReport':
        this.valuationReportInput?.nativeElement.click();
        break;
      case 'cibConsentForm':
        this.cibConsentFormInput?.nativeElement.click();
        break;
    }
  }

  onUploadFile(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
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

      this.showNotification(`File selected: ${file.name}`, 'success');
      input.value = '';
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

  nextStep(): void {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.steps.length) {
        this.currentStep++;
      }
    } else {
      this.showNotification('Please complete all required fields before proceeding', 'error');
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(stepId: number): boolean {
    switch(stepId) {
      case 1:
        return this.businessProfileForm.valid;
      case 2:
        return this.ownershipManagementForm.valid;
      case 3:
        return this.financialInfoForm.valid;
      case 4:
        return this.bankingRelationshipForm.valid;
      case 5:
        return this.loanRequirementForm.valid;
      case 6:
        return this.securityCollateralForm.valid;
      case 7:
        return this.validateUploadSection();
      default:
        return false;
    }
  }
}
