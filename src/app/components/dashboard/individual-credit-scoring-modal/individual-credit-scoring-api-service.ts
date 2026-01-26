import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interface representing the structure expected by the Backend API for Person Info
 */
export interface PersonInfoPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  nationalIdPassportNo: string;
  idCopyUrl: string;
}

/**
 * Interface representing the structure expected by the Backend API for Location
 */
export interface LocationPayload {
  id: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class IndividualCreditService {
  private baseUrl = 'http://localhost:8181/web-backend/api/individual-credit';

  constructor(private http: HttpClient) {}

  /**
   * Submits Step 1 data (Person Info).
   * Maps 'idNumber' from the UI to 'nationalIdPassportNo' for the API.
   */
  submitStepOne(step1Data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Construct the payload using the Interface
    const payload: PersonInfoPayload = {
      firstName: step1Data.firstName,
      lastName: step1Data.lastName,
      dateOfBirth: step1Data.dateOfBirth,
      gender: step1Data.gender,
      phoneNumber: step1Data.phoneNumber,
      nationalIdPassportNo: step1Data.idNumber, // Mapping UI key to API key
      idCopyUrl: step1Data.uploadId || ""
    };

    return this.http.post<any>(`${this.baseUrl}/person-info`, payload, { headers });
  }

  /**
   * Submits Step 2 data (Location Info).
   * Updates location for the individual with the given ID.
   */
  submitStepTwo(step2Data: any, individualId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Construct the payload using the Interface
    const payload: LocationPayload = {
      id: individualId, // Use the ID from step 1 response
      addressLine1: step2Data.addressLine1,
      addressLine2: step2Data.addressLine2 || '',
      city: step2Data.city,
      stateProvince: step2Data.stateProvince,
      postalCode: step2Data.zipPostalCode, // Mapping UI key to API key
      countryCode: step2Data.country // Mapping UI key to API key
    };

    return this.http.put<any>(`${this.baseUrl}/location`, payload, { headers });
  }
}
