// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  public: false,
  staging: false,
  digiLockerAadhaar:'staging',
  // apiURL: 'http://192.168.0.11/api',
  // apiURL: 'http://localhost:55/coreapi/api/',
  // apiURL: 'http://192.168.23.253:55/coreapi/api/',
  // apiURL: 'http://59.179.29.58:55/coreapi/api/',
  //  apiURL: 'http://192.168.23.253:55/coreapi/api/',
  // apiURL: 'http://192.168.23.253:8034/api/', //for local old
    // apiURL: 'http://192.168.23.254:8034/api/', //for local new
    apiURL: 'http://192.168.23.254:61/api/', //for local new 21-09-23
  // apiURL:  'http://59.179.29.58:55/nsrscoreapi/api/', //for public old 
  // apiURL: 'http://59.179.29.59:9891/api/', //for public old 
  // apiURL: 'http://59.179.29.60:9891/api/', //for public new 
  fileUrl: 'http://192.168.23.254:100/data/NSRS/',  //file static url to open file upload on local,
  kitdUrl: 'http://192.168.23.254:74/api/',
  gmsApiUrl:'https://digilocker.kheloindia.gov.in/api/',

  secretPasswordKey: 'Eth@n01',

  //Keys for Encrypt and Decrypt
  enc_Key: '7739826323491690',
  ency_iv: '7739826323491690',
  encrAppId: '2XtqKhTfVq',
  ssoLoginUrl: 'http://localhost:5000/#/',
  envDigioType: 'sandbox',
  fileUrlACTC: 'http://192.168.23.254:100/data/ACTC/any/',  //file static url to open file upload on local,
  //  ssoLoginUrl: 'http://192.168.23.253:85/#/'
  // ssoLoginUrl: 'http://192.168.23.254:62/#/', // for new stagging
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
