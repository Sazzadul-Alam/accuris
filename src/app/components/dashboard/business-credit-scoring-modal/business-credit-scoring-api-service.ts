import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BusinessCreditResponse {
  status: string;
  message: string;
  businessId: number | null;
  financialInfoId: number | null;
  bankingInfoId: number | null;
  loanInfoId: number | null;
  securityInfoId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class BusinessCreditService {
  private baseUrl = 'http://localhost:8181/web-backend/api/business-credit-scoring-form';

  constructor(private http: HttpClient) {}

  uploadDocument(file: File, businessId: number, fieldName: string): Observable<{ path: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ path: string; filename: string }>(
      `${this.baseUrl}/upload/${businessId}/${fieldName}`,
      formData
    );
  }

  saveFullBusinessCreditScoring(allData: any, userId: number, action: 'SAVE' | 'SUBMIT'): Observable<BusinessCreditResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const payload = {
      param: action,
      userId: userId,
      dataSet: {
        id: allData.id || null,

        // Business Profile & Basic Information
        businessName: allData.businessName,
        legalStatusId: this.toInt(allData.legalStatusId),
        natureOfBusinessId: this.toInt(allData.natureOfBusinessId),
        dateOfIncorporation: this.formatDate(allData.dateOfIncorporation),
        tradeLicenseNumber: allData.tradeLicenseNumber,
        tradeLicenseExpiryDate: this.formatDate(allData.tradeLicenseExpiryDate),
        tinNumber: allData.tinNumber,
        vatBinNumber: allData.vatBinNumber,
        rjscRegistrationNumber: allData.rjscRegistrationNumber,
        businessAddress: allData.businessAddress,
        factoryAddress: allData.factoryAddress,
        businessMobileNumber: allData.businessMobileNumber,
        businessEmail: allData.businessEmail,

        // Ownership & Management Information
        ownerDirectorName: allData.ownerDirectorName,
        fatherMotherName: allData.fatherMotherName,
        nationalIdNumber: allData.nationalIdNumber,
        dateOfBirth: this.formatDate(allData.dateOfBirth),
        shareholdingPercentage: this.toFloat(allData.shareholdingPercentage),
        designationId: this.toInt(allData.designationId),
        yearsOfBusinessExperience: this.toInt(allData.yearsOfBusinessExperience),
        ownerMobileNumber: allData.ownerMobileNumber,
        ownerEmail: allData.ownerEmail,
        cibStatusId: this.toInt(allData.cibStatusId),
        relatedBusinessDetails: allData.relatedBusinessDetails,

        // Financial Information
        financialInfoId: allData.financialInfoId || null,
        financialYearId: this.toInt(allData.financialYearId),
        auditStatusId: this.toInt(allData.auditStatusId),
        annualTurnover: this.toFloat(allData.annualTurnover),
        grossProfit: this.toFloat(allData.grossProfit),
        netProfitAfterTax: this.toFloat(allData.netProfitAfterTax),
        totalAssets: this.toFloat(allData.totalAssets),
        totalLiabilities: this.toFloat(allData.totalLiabilities),
        netWorth: this.toFloat(allData.netWorth),
        currentAssets: this.toFloat(allData.currentAssets),
        currentLiabilities: this.toFloat(allData.currentLiabilities),
        interestExpense: this.toFloat(allData.interestExpense),
        ebitda: this.toFloat(allData.ebitda),

        // Banking Relationship & Account Conduct
        bankingInfoId: allData.bankingInfoId || null,
        existingBankName: allData.existingBankName,
        accountTypeId: this.toInt(allData.accountTypeId),
        relationshipDurationYears: this.toInt(allData.relationshipDurationYears),
        averageBalance: this.toFloat(allData.averageBalance),
        limitSanctioned: this.toFloat(allData.limitSanctioned),
        averageUtilizationPercentage: this.toFloat(allData.averageUtilizationPercentage),
        repaymentBehaviorId: this.toInt(allData.repaymentBehaviorId),
        pastDueStatusId: this.toInt(allData.pastDueStatusId),
        chequeReturnHistoryId: this.toInt(allData.chequeReturnHistoryId),

        // Loan Requirement Details
        loanInfoId: allData.loanInfoId || null,
        loanTypeId: this.toInt(allData.loanTypeId),
        requestedLoanAmount: this.toFloat(allData.requestedLoanAmount),
        loanPurposeId: this.toInt(allData.loanPurposeId),
        detailedPurposeDescription: allData.detailedPurposeDescription,
        loanTenureMonths: this.toInt(allData.loanTenureMonths),
        repaymentModeId: this.toInt(allData.repaymentModeId),
        proposedInterestTypeId: this.toInt(allData.proposedInterestTypeId),

        // Security & Collateral Information
        securityInfoId: allData.securityInfoId || null,
        securityTypeId: this.toInt(allData.securityTypeId),
        propertyTypeId: this.toInt(allData.propertyTypeId),
        propertyLocation: allData.propertyLocation,
        ownershipName: allData.ownershipName,
        marketValue: this.toFloat(allData.marketValue),
        forcedSaleValue: this.toFloat(allData.forcedSaleValue),
        mortgageStatusId: this.toInt(allData.mortgageStatusId),
        personalGuaranteeId: this.toInt(allData.personalGuaranteeId),
        corporateGuaranteeId: this.toInt(allData.corporateGuaranteeId),

        // Document Upload URLs and Filenames
        tradeLicenseUrl: allData.tradeLicenseUrl || '',
        tradeLicenseFilename: allData.tradeLicenseFilename || '',
        tinCertificateUrl: allData.tinCertificateUrl || '',
        tinCertificateFilename: allData.tinCertificateFilename || '',
        vatCertificateUrl: allData.vatCertificateUrl || '',
        vatCertificateFilename: allData.vatCertificateFilename || '',
        financialStatementsUrl: allData.financialStatementsUrl || '',
        financialStatementsFilename: allData.financialStatementsFilename || '',
        bankStatementUrl: allData.bankStatementUrl || '',
        bankStatementFilename: allData.bankStatementFilename || '',
        titleDeedUrl: allData.titleDeedUrl || '',
        titleDeedFilename: allData.titleDeedFilename || '',
        valuationReportUrl: allData.valuationReportUrl || '',
        valuationReportFilename: allData.valuationReportFilename || '',
        cibConsentFormUrl: allData.cibConsentFormUrl || '',
        cibConsentFormFilename: allData.cibConsentFormFilename || ''
      }
    };

    return this.http.post<BusinessCreditResponse>(`${this.baseUrl}/process`, payload, { headers });
  }

  // --- Helpers ---
  private toInt(val: any): number | null {
    return val ? parseInt(val) : null;
  }

  private toFloat(val: any): number | null {
    return val ? parseFloat(val) : null;
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  }

  getLatestBusinessId(userId: number): Observable<{ businessId: number | null }> {
    return this.http.get<{ businessId: number | null }>(
      `${this.baseUrl}/latest-business/${userId}`
    );
  }

  getBusinessById(businessId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/business/${businessId}`
    );
  }

  getAllConfigurations(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/configurations`);
  }
}
