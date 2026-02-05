import {environment} from "../../environments/environment";

export default class ApiEndpoint {
 public static baseURL = environment.baseURL;
  public static oauthBaseURL = environment.oauthBaseURL;
 public static OAUTH_TOKEN = `${environment.oauthBaseURL}/authenticate`;





}
