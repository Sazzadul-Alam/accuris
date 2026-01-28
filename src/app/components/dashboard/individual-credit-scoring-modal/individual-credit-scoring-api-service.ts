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

  // individual-credit-scoring-api-service.ts

  uploadDocument(file: File, individualId: number, fieldName: string): Observable<{ path: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ path: string; filename: string }>(
      `${this.baseUrl}/upload/${individualId}/${fieldName}`,
      formData
    );
  }

  saveFullCreditScoring(allData: any, userId: number, action: 'SAVE' | 'SUBMIT'): Observable<IndividualCreditResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const payload = {
      param: action,
      userId: userId,
      dataSet: {
        id: allData.id || null,
        firstName: allData.firstName,
        lastName: allData.lastName,
        fatherName: allData.fatherName,
        motherName: allData.motherName,
        dateOfBirth: this.formatDate(allData.dateOfBirth),
        genderId: allData.genderId,
        maritalStatusId: allData.maritalStatusId,
        phoneNumber: allData.phoneNumber,
        email: allData.email,
        nationalIdPassportNo: allData.nationalIdPassportNo,

        presentAddress: allData.presentAddress,
        permanentAddress: allData.permanentAddress,
        city: allData.city,
        stateProvince: allData.stateProvince,
        postalCode: allData.postalCode,
        countryCode: allData.countryCode,

        financialId: allData.financialId || null,
        employerTypeId: this.toInt(allData.employerTypeId),
        employerName: allData.employerName,
        employmentStatusId: this.toInt(allData.employmentStatusId),
        jobDesignation: allData.jobDesignation,
        jobTenureYears: this.toInt(allData.jobTenureYears),
        monthlyGrossIncome: this.toFloat(allData.monthlyGrossIncome),
        monthlyNetIncome: this.toFloat(allData.monthlyNetIncome),

        businessName: allData.businessName,
        businessTypeId: this.toInt(allData.businessTypeId),
        industryType: allData.industryType,
        yearsInBusiness: this.toInt(allData.yearsInBusiness),
        monthlyBusinessIncome: this.toFloat(allData.monthlyBusinessIncome),

        requestedLoanAmount: this.toFloat(allData.requestedLoanAmount),
        downPaymentAmount: this.toFloat(allData.downPaymentAmount),
        loanTenureMonths: this.toInt(allData.loanTenureMonths),
        repaymentPreferenceId: this.toInt(allData.repaymentPreferenceId),
        existingLoanDetails: allData.existingLoanDetails,
        creditCardDetails: allData.creditCardDetails,

        collateralAvailable: this.toInt(allData.collateralAvailable),
        collateralTypeId: this.toInt(allData.collateralTypeId),
        estimatedCollateralValue: this.toFloat(allData.estimatedCollateralValue),
        guarantorAvailable: this.toInt(allData.guarantorAvailable),
        coApplicantAvailable: this.toInt(allData.coApplicantAvailable),

        incomeTypeId: allData.incomeTypeId || [],
        creditPurposeId: allData.creditPurposeId || [],

        // ✅ PATHS AND FILENAMES
        idCopyUrl: allData.idCopyUrl || '',
        idCopyFilename: allData.idCopyFilename || '',
        photographUrl: allData.photographUrl || '',
        photographFilename: allData.photographFilename || '',
        salaryCertificateUrl: allData.salaryCertificateUrl || '',
        salaryCertificateFilename: allData.salaryCertificateFilename || '',
        bankStatementUrl: allData.bankStatementUrl || '',
        bankStatementFilename: allData.bankStatementFilename || '',
        incomeTaxReturnUrl: allData.incomeTaxReturnUrl || '',
        incomeTaxReturnFilename: allData.incomeTaxReturnFilename || '',
        cibConsentFormUrl: allData.cibConsentFormUrl || '',
        cibConsentFormFilename: allData.cibConsentFormFilename || ''
      }
    };

    return this.http.post<IndividualCreditResponse>(`${this.baseUrl}/process`, payload, { headers });
  }

  // --- Helpers ---
  private toInt(val: any): number | null { return val ? parseInt(val) : null; }
  private toFloat(val: any): number | null { return val ? parseFloat(val) : null; }



  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  }

  getLatestIndividualId(userId: number): Observable<{ individualId: number | null }> {
    return this.http.get<{ individualId: number | null }>(
      `${this.baseUrl}/latest-individual/${userId}`
    );
  }

  getIndividualById(individualId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/individual/${individualId}`
    );
  }

  getAllConfigurations(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/configurations`);
  }

}
