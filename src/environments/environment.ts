// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //apiURL: 'http://192.168.0.11/api',
  //apiURL: 'http://localhost:5096/api/',
  apiURL: 'http://192.168.23.253:8034/api/',
  secretPasswordKey: 'Eth@n01',

  //Keys for Encrypt and Decrypt
  enc_Key: '37ZA3D89B64C115122DF9178C8R99c1x',
  ency_iv: '213A26DBB4A358C5',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
