export const environment = {
  production: true,
  public: false,
  staging: false,
  digiLockerAadhaar:'production',
  // apiURL: 'http://192.168.0.11/api',
  // apiURL: 'http://localhost:55/coreapi/api/',
  // apiURL: 'http://59.179.29.58:55/coreapi/api/',
  // apiURL: 'http://192.168.23.253:55/coreapi/api/',
  // apiURL: 'http://59.179.29.58:55/coreapi/api/',
  // apiURL: 'http://192.168.23.253:55/coreapi/api/',
  //apiURL: 'http://192.168.23.253:8034/api/',   //for different local
 // apiURL: 'http://192.168.23.254:8034/api/', //for local
    // apiURL: 'http://192.168.23.254:61/api/', //for local new 21-09-23
  //  apiURL: 'http://59.179.29.58:55/nsrscoreapi/api/',
  // apiURL: 'http://59.179.29.58:9891/api/', //for public old
  // apiURL: 'http://59.179.29.61:9891/NSRS_CoreAPI/api/', //for public new
   apiURL: 'https://nsrs.kheloindia.gov.in/nsrscoreapi/api/', //for production

  // fileUrl: 'http://192.168.23.254:100/data/NSRS/', // for local
  fileUrl: 'https://nsrs.kheloindia.gov.in/data/',  // for production

  // kitdUrl: 'http://192.168.23.254:74/api/', //for staging
  kitdUrl: 'https://talent.kheloindia.gov.in/kitd_core_api/api/', // production
  gmsApiUrl:'https://digilocker.kheloindia.gov.in/api/',

  secretPasswordKey: 'Eth@n01', // apiURL: 'http://192.168.23.254:8034/api/',   //for local    

  //Keys for Encrypt and Decrypt
  enc_Key: '7739826323491690',
  ency_iv: '7739826323491690',
  encrAppId: '2XtqKhTfVq',

   //ssoLoginUrl: 'http://192.168.23.254:1010/#/', // for staging
    // ssoLoginUrl: 'http://192.168.23.254:62/#/' // for new stagging
  // ssoLoginUrl: 'http://59.179.29.61:9090/#/' // for public
  // ssoLoginUrl: 'https://nsrswebservice.kheloindia.gov.in/#/' // for production
   ssoLoginUrl: 'https://account.kheloindia.gov.in/#/', // for production
   scriptUrl: 'https://app.digio.in/sdk/v11/digio.js',
   envDigioType: 'production',
   fileUrlACTC: "https://actc.kheloindia.gov.in/data/actc/",  //for production ACTC,
};
