import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import ApiEndpoint from "../ApiEndpoint";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  getdashboardInfo(obj): Observable<any> {
    return this.httpClient.post(`${ApiEndpoint.baseURL}/dashboard`, obj);
  }
}
