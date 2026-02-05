// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import ApiEndpoint from "../ApiEndpoint";


export interface UserName {
  firstName: string;
  lastName: string;
  dashboardShow: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getUserIdFromEmail(email: string): Observable<number | null> {
    if (!email) {
      return of(null); // return null immediately if email is empty
    }

    const url = `${ApiEndpoint.baseURL}/auth/userid?email=${encodeURIComponent(email)}`;

    return this.http.get<number>(url).pipe(
      map((userId: number) => userId ?? null), // convert undefined to null
      catchError((error) => {
        console.error('Error fetching userId:', error);
        return of(null); // fallback to null on error
      })
    );
  }

  getUserNameFromId(id: number): Observable<UserName | null> {
    if (!id) {
      return of(null);
    }

    const url = `${ApiEndpoint.baseURL}/auth/username?id=${id}`;

    return this.http.get<UserName>(url).pipe(
      catchError(error => {
        console.error('Error fetching user name:', error);
        return of(null); // fallback to null if error
      })
    );
  }


  isDashBoardShow(formData: FormData): Observable<any> {
    return this.http.post<any>(
      `${ApiEndpoint.baseURL}/home/dashboard`,
      formData
    );
  }
}
