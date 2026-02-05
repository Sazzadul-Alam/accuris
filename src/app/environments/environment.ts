// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  loginUrl: 'http://192.168.26.121:8002',
  logoutURI: 'https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=http://192.168.26.121:4200',
  adUrl: 'http://192.168.26.121:8002/ad-backend',
  app1: 'http://192.168.26.121:4000/web-backend',
  app2: 'http://192.168.26.121:4000/web-backend',
  app99: 'http://192.168.26.121:4000/web-backend',
  baseURL: 'http://192.168.26.121:4000/web-backend',
  oauthBaseURL:'http://192.168.14.136:3000/security',
  adForward: 'https://192.168.26.121:4000/active-directoryservice',


  // app1: 'http://192.168.14.136:3000/webservice',
  // app2: 'http://192.168.14.136:3000/webservice',
  // app99: 'http://192.168.14.136:3000/webservice',
  // baseURL: 'http://192.168.14.136:3000/webservice',
  // oauthBaseURL:'http://192.168.14.136:3000/security',


  // production: true,
  // loginUrl: 'https://uat-eaportal.bkash.com/login',
  // adForward: 'https://uat-eaportal.bkash.com/active-directoryservice',
  // adUrl: 'https://uat-eaportal.bkash.com/adservice',
  // logoutURI: 'https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=https://uat-eaportal.bkash.com/login',
  // baseURL: 'https://uat-eaportal.bkash.com/webservice',
  // oauthBaseURL:'https://uat-eaportal.bkash.com/security',
  // app1:'https://uat-eaportal.bkash.com/app1-webservice',
  // app2:'https://uat-eaportal.bkash.com/app2-webservice',
};
