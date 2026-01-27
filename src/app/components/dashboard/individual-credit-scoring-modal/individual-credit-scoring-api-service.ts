import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interface for the unified API request structure
 */
export interface IndividualCreditRequest {
  param: string;  // 'person info', 'location', 'financial info', 'final submit'
  pId: number | null;
  userId: number;
  dataSet: any;
}

/**
 * Interface for the unified API response structure
 */
export interface IndividualCreditResponse {
  status: string;           // 'SUCCESS' or 'FAIL'
  message: string;          // Message from stored procedure
  individualId: number | null;     // ID of the individual
  financialInfoId: number | null;  // ID of financial info (when applicable)
}

@Injectable({
  providedIn: 'root'
})
export class IndividualCreditService {
  // Updated to use the unified endpoint
  private baseUrl = 'http://localhost:8181/web-backend/api/individual-credit-scoring-form';

  constructor(private http: HttpClient) {}

  /**
   * Map gender string to ID
   * Male -> 1, Female -> 2, Other -> 3
   */
  private mapGender(gender: string): number {
    const genderMap: { [key: string]: number } = {
      'Male': 1,
      'Female': 2,
      'Other': 3
    };
    return genderMap[gender] || 3; // Default to 'Other' if not found
  }

  /**
   * Map marital status string to ID
   * Single -> 1, Married -> 2, Divorced -> 3, Widowed -> 4, Separated -> 5, Unspecified -> 6
   */
  private mapMaritalStatus(maritalStatus: string): number {
    const maritalStatusMap: { [key: string]: number } = {
      'Single': 1,
      'Married': 2,
      'Divorced': 3,
      'Widowed': 4,
      'Separated': 5,
      'Unspecified': 6
    };
    return maritalStatusMap[maritalStatus] || 6; // Default to 'Unspecified' if not found
  }

  /**
   * Format date to YYYY-MM-DD string
   */
  private formatDate(date: any): string {
    if (!date) return '';

    // If it's already a string in the correct format, return it
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // If it's a Date object or other format, convert it
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Submits Step 1 data (Person Info) using the unified endpoint
   *
   * @param step1Data - Form data from personalInfoForm
   * @param userId - The logged-in user ID (who is creating this individual record)
   * @returns Observable with the response containing the new individualId
   */
  submitStepOne(step1Data: any, userId: number, individualId: number): Observable<IndividualCreditResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    console.log(`Current INDIVIDUALID PASSED: ${individualId}`);
    // Construct the payload for the unified endpoint
    const payload: IndividualCreditRequest = {
      param: 'person info',
      pId: null,  // Always null for new individual
      userId: userId,  // The logged-in user creating this record
      dataSet: {
        id: individualId,  // Always null for new individual
        firstName: step1Data.firstName,
        lastName: step1Data.lastName,
        fatherName: step1Data.fathersName,  // Map from form field name
        motherName: step1Data.mothersName,  // Map from form field name
        dateOfBirth: this.formatDate(step1Data.dateOfBirth),
        genderId: this.mapGender(step1Data.gender),
        maritalStatusId: this.mapMaritalStatus(step1Data.maritalStatus),
        phoneNumber: step1Data.phoneNumber,
        email: step1Data.email,
        nationalIdPassportNo: step1Data.idNumber,  // Map from form field name
        idCopyUrl: ''  // File name or URL
      }
    };

    console.log('Submitting Step 1 - Person Info:', payload);

    return this.http.post<IndividualCreditResponse>(
      `${this.baseUrl}/process`,
      payload,
      { headers }
    );
  }

  /**
   * Submits Step 2 data (Location Info) using the unified endpoint
   *
   * @param step2Data - Form data from locationForm
   * @param individualId - The individual's ID from step 1 response
   * @param userId - The logged-in user ID
   * @returns Observable with the response
   */
  submitStepTwo(step2Data: any, userId: number, individualId: number): Observable<IndividualCreditResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Construct the payload for the unified endpoint
    const payload: IndividualCreditRequest = {
      param: 'location',
      pId: individualId,  // The individual to update
      userId: userId,
      dataSet: {
        id: individualId,  // Include in dataSet as well
        presentAddress: step2Data.presentAddress,
        permanentAddress: step2Data.permanentAddress,
        city: step2Data.city,
        stateProvince: step2Data.stateOrDistrict,  // Map from form field name
        postalCode: step2Data.postalCode,
        countryCode: step2Data.country  // Map from form field name
      }
    };

    console.log('Submitting Step 2 - Location:', payload);

    return this.http.post<IndividualCreditResponse>(
      `${this.baseUrl}/process`,
      payload,
      { headers }
    );
  }

  /**
   * Submits Step 3 data (Financial Info) using the unified endpoint
   *
   * @param step3Data - Combined financial form data (basicInfo, employerInfo, businessInfo, creditInfo)
   * @param individualId - The individual's ID from step 1 response
   * @param userId - The logged-in user ID
   * @returns Observable with the response containing financialInfoId
   */
  submitStepThree(step3Data: any, individualId: number, userId: number): Observable<IndividualCreditResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload: IndividualCreditRequest = {
      param: 'financial info',
      pId: individualId,
      userId: userId,
      dataSet: {
        financialId: null,  // null for new, or pass existing ID for update
        individualsId: individualId,

        // Employment Information (from employerInfoForm)
        employerTypeId: step3Data.employerInfo?.employerType ? parseInt(step3Data.employerInfo.employerType) : null,
        employerName: step3Data.employerInfo?.employerName || null,
        employmentStatusId: step3Data.employerInfo?.employmentStatus ? parseInt(step3Data.employerInfo.employmentStatus) : null,
        jobDesignation: step3Data.employerInfo?.jobDesignation || null,
        jobTenureYears: step3Data.employerInfo?.jobTenureYears ? parseInt(step3Data.employerInfo.jobTenureYears) : null,
        monthlyGrossIncome: step3Data.employerInfo?.monthlyGrossIncome ? parseFloat(step3Data.employerInfo.monthlyGrossIncome) : null,
        monthlyNetIncome: step3Data.employerInfo?.monthlyNetIncome ? parseFloat(step3Data.employerInfo.monthlyNetIncome) : null,

        // Business Information (from businessInfoForm)
        businessName: step3Data.businessInfo?.businessName || null,
        businessTypeId: step3Data.businessInfo?.businessType ? parseInt(step3Data.businessInfo.businessType) : null,
        industryType: step3Data.businessInfo?.industryType || null,
        yearsInBusiness: step3Data.businessInfo?.yearsInBusiness ? parseInt(step3Data.businessInfo.yearsInBusiness) : null,
        monthlyBusinessIncome: step3Data.businessInfo?.monthlyBusinessIncome ? parseFloat(step3Data.businessInfo.monthlyBusinessIncome) : null,

        // Financial and Credit Information (from creditInfoForm)
        requestedLoanAmount: step3Data.creditInfo?.requestedLoanAmount ? parseFloat(step3Data.creditInfo.requestedLoanAmount) : null,
        downPaymentAmount: step3Data.creditInfo?.downPaymentAmount ? parseFloat(step3Data.creditInfo.downPaymentAmount) : null,
        loanTenureMonths: step3Data.creditInfo?.loanTenureMonths ? parseInt(step3Data.creditInfo.loanTenureMonths) : null,
        repaymentPreferenceId: step3Data.creditInfo?.repaymentPreference ? parseInt(step3Data.creditInfo.repaymentPreference) : null,
        existingLoanDetails: step3Data.creditInfo?.existingLoanDetails || null,
        creditCardDetails: step3Data.creditInfo?.creditCardDetails || null,

        // Banking and Debt Information
        bankName: null,  // Not in current forms
        activeBankAccounts: null,  // Not in current forms
        totalOutstandingLoanAmount: null,  // Not in current forms
        totalMonthlyEmi: null,  // Not in current forms
        debtBurdenRatio: null,  // Not in current forms
        repaymentBehaviorId: null,  // Not in current forms
        cibStatusId: null,  // Not in current forms

        // Security / Collateral & Risk Mitigation (from securityInfoForm)
        collateralAvailable: step3Data.securityInfo?.collateralAvailable ? parseInt(step3Data.securityInfo.collateralAvailable) : null,
        collateralTypeId: step3Data.securityInfo?.collateralType ? parseInt(step3Data.securityInfo.collateralType) : null,
        estimatedCollateralValue: step3Data.securityInfo?.estimatedCollateralValue ? parseFloat(step3Data.securityInfo.estimatedCollateralValue) : null,
        guarantorAvailable: step3Data.securityInfo?.guarantorAvailable ? parseInt(step3Data.securityInfo.guarantorAvailable) : null,
        coApplicantAvailable: step3Data.securityInfo?.coApplicantAvailable ? parseInt(step3Data.securityInfo.coApplicantAvailable) : null,

        // Arrays for mappings - convert single values to arrays
        incomeTypeId: step3Data.basicInfo?.incomeType ? [parseInt(step3Data.basicInfo.incomeType)] : [],
        creditPurposeId: step3Data.basicInfo?.creditPurpose ? [parseInt(step3Data.basicInfo.creditPurpose)] : []
      }
    };

    console.log('Submitting Step 3 - Financial Info:', payload);

    return this.http.post<IndividualCreditResponse>(
      `${this.baseUrl}/process`,
      payload,
      { headers }
    );
  }




  /**
   * Submit all steps at once (Final Submit)
   * Useful if you want to submit everything in a single transaction
   */
  submitFinalSubmit(allData: any, userId: number): Observable<IndividualCreditResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload: IndividualCreditRequest = {
      param: 'final submit',
      pId: null,
      userId: userId,
      dataSet: {
        // Combine all form data
        // Person Info
        id: null,
        firstName: allData.step1.firstName,
        lastName: allData.step1.lastName,
        fatherName: allData.step1.fathersName,
        motherName: allData.step1.mothersName,
        dateOfBirth: this.formatDate(allData.step1.dateOfBirth),
        genderId: this.mapGender(allData.step1.gender),
        maritalStatusId: this.mapMaritalStatus(allData.step1.maritalStatus),
        phoneNumber: allData.step1.phoneNumber,
        email: allData.step1.email,
        nationalIdPassportNo: allData.step1.idNumber,
        idCopyUrl: '',

        // Location
        presentAddress: allData.step2.presentAddress,
        permanentAddress: allData.step2.permanentAddress,
        city: allData.step2.city,
        stateProvince: allData.step2.stateOrDistrict,
        postalCode: allData.step2.postalCode,
        countryCode: allData.step2.country,

        // Financial Info - TODO: Add when structure is finalized
      }
    };

    console.log('Submitting Final Submit (All Steps):', payload);

    return this.http.post<IndividualCreditResponse>(
      `${this.baseUrl}/process`,
      payload,
      { headers }
    );
  }
}
