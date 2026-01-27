import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IndividualCreditResponse {
  status: string;
  message: string;
  individualId: number | null;
  financialInfoId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class IndividualCreditService {
  private baseUrl = 'http://localhost:8181/web-backend/api/individual-credit-scoring-form';

  constructor(private http: HttpClient) {}

  /**
   * THE UNIFIED FUNCTION
   * Consolidates all steps into one payload for sp_save_full_individual_credit_scoring
   */
  saveFullCreditScoring(allData: any, userId: number, action: 'SAVE' | 'SUBMIT'): Observable<IndividualCreditResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const payload = {
      param: action, // 'SAVE' or 'SUBMIT'
      userId: userId,
      dataSet: {
        // --- Individual & Location Info ---
        id: allData.personal?.id || null, // NULL = Insert, Value = Update
        firstName: allData.personal?.firstName,
        lastName: allData.personal?.lastName,
        fatherName: allData.personal?.fathersName,
        motherName: allData.personal?.mothersName,
        dateOfBirth: this.formatDate(allData.personal?.dateOfBirth),
        genderId: this.mapGender(allData.personal?.gender),
        maritalStatusId: this.mapMaritalStatus(allData.personal?.maritalStatus),
        phoneNumber: allData.personal?.phoneNumber,
        email: allData.personal?.email,
        nationalIdPassportNo: allData.personal?.idNumber,

        presentAddress: allData.location?.presentAddress,
        permanentAddress: allData.location?.permanentAddress,
        city: allData.location?.city,
        stateProvince: allData.location?.stateOrDistrict,
        postalCode: allData.location?.postalCode,
        countryCode: allData.location?.country,

        // --- Financial Info ---
        financialId: allData.financial?.financialId || null,
        employerTypeId: this.toInt(allData.financial?.employerInfo?.employerType),
        employerName: allData.financial?.employerInfo?.employerName,
        employmentStatusId: this.toInt(allData.financial?.employerInfo?.employmentStatus),
        jobDesignation: allData.financial?.employerInfo?.jobDesignation,
        jobTenureYears: this.toInt(allData.financial?.employerInfo?.jobTenureYears),
        monthlyGrossIncome: this.toFloat(allData.financial?.employerInfo?.monthlyGrossIncome),
        monthlyNetIncome: this.toFloat(allData.financial?.employerInfo?.monthlyNetIncome),

        businessName: allData.financial?.businessInfo?.businessName,
        businessTypeId: this.toInt(allData.financial?.businessInfo?.businessType),
        industryType: allData.financial?.businessInfo?.industryType,
        yearsInBusiness: this.toInt(allData.financial?.businessInfo?.yearsInBusiness),
        monthlyBusinessIncome: this.toFloat(allData.financial?.businessInfo?.monthlyBusinessIncome),

        requestedLoanAmount: this.toFloat(allData.financial?.creditInfo?.requestedLoanAmount),
        downPaymentAmount: this.toFloat(allData.financial?.creditInfo?.downPaymentAmount),
        loanTenureMonths: this.toInt(allData.financial?.creditInfo?.loanTenureMonths),
        repaymentPreferenceId: this.toInt(allData.financial?.creditInfo?.repaymentPreference),
        existingLoanDetails: allData.financial?.creditInfo?.existingLoanDetails,
        creditCardDetails: allData.financial?.creditInfo?.creditCardDetails,

        collateralAvailable: this.toInt(allData.financial?.securityInfo?.collateralAvailable),
        collateralTypeId: this.toInt(allData.financial?.securityInfo?.collateralType),
        estimatedCollateralValue: this.toFloat(allData.financial?.securityInfo?.estimatedCollateralValue),
        guarantorAvailable: this.toInt(allData.financial?.securityInfo?.guarantorAvailable),
        coApplicantAvailable: this.toInt(allData.financial?.securityInfo?.coApplicantAvailable),

        // --- Arrays for Mappings ---
        incomeTypeId: allData.financial?.basicInfo?.incomeType ? [this.toInt(allData.financial.basicInfo.incomeType)] : [],
        creditPurposeId: allData.financial?.basicInfo?.creditPurpose ? [this.toInt(allData.financial.basicInfo.creditPurpose)] : [],

        // --- Document Uploads ---
        idCopyUrl: allData.uploads?.nationalIdCopy || '',
        photographUrl: allData.uploads?.photograph || '',
        salaryCertificateUrl: allData.uploads?.salaryCertificate || '',
        bankStatementUrl: allData.uploads?.bankStatement || '',
        incomeTaxReturnUrl: allData.uploads?.incomeTaxReturn || '',
        cibConsentFormUrl: allData.uploads?.cibConsentForm || ''
      }
    };

    return this.http.post<IndividualCreditResponse>(`${this.baseUrl}/process`, payload, { headers });
  }

  // --- Helpers ---
  private toInt(val: any): number | null { return val ? parseInt(val) : null; }
  private toFloat(val: any): number | null { return val ? parseFloat(val) : null; }

  private mapGender(gender: string): number {
    const map: any = { 'Male': 1, 'Female': 2, 'Other': 3 };
    return map[gender] || 3;
  }

  private mapMaritalStatus(status: string): number {
    const map: any = { 'Single': 1, 'Married': 2, 'Divorced': 3, 'Widowed': 4, 'Separated': 5 };
    return map[status] || 6;
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  }
}
