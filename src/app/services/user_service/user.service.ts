import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import ApiEndpoint from "../ApiEndpoint";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }
  login(user) {
    const headers = {'Authorization': `Basic ${btoa('web:webpass')}`} //UAT
    return this.httpClient.post(`${ApiEndpoint.OAUTH_TOKEN}`,{username:user.email, password:user.password, grant_type:user.grant_type},{headers});
  }
  userDetail(user) {
    return this.httpClient.get(`${ApiEndpoint.baseURL}/user/info`);
  }
}
