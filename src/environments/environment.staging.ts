export const environment = {
    production: false,
    public: false,
    staging: true,
    digiLockerAadhaar:'staging',
 // apiURL: 'http://192.168.23.254:8034/api/', //for local
    apiURL: 'http://192.168.23.254:61/api/', //for local new 21-09-23
    fileUrl: 'http://192.168.23.254:100/data/NSRS/',
    kitdUrl: 'http://192.168.23.254:74/api/', 
    gmsApiUrl:'https://digilocker.kheloindia.gov.in/api/',      
  //Keys for Encrypt and Decrypt
    secretPasswordKey: 'Eth@n01',
    enc_Key: '7739826323491690',
    ency_iv: '7739826323491690',
    encrAppId: '2XtqKhTfVq',
   //ssoLoginUrl: 'http://192.168.23.254:1010/#/', // for staging
    ssoLoginUrl: 'http://192.168.23.254:62/#/', // for new stagging
    envDigioType: 'sandbox',
    fileUrlACTC: 'http://192.168.23.254:100/data/ACTC/any/',  //file static url to open file upload on local,
}