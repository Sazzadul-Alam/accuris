// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


export interface UserName {
  firstName: string;
  lastName: string;
  dashboardShow: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private webBackendUrl = 'http://localhost:8181/web-backend';
  private oauthUrl = 'http://localhost:2002'; // OAuth server

  constructor(private http: HttpClient) {}

  getUserIdFromEmail(email: string): Observable<number | null> {
    if (!email) {
      return of(null); // return null immediately if email is empty
    }

    const url = `${this.webBackendUrl}/auth/userid?email=${encodeURIComponent(email)}`;

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

    const url = `${this.webBackendUrl}/auth/username?id=${id}`;

    return this.http.get<UserName>(url).pipe(
      catchError(error => {
        console.error('Error fetching user name:', error);
        return of(null); // fallback to null if error
      })
    );
  }



}
