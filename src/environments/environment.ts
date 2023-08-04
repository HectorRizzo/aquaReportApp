// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'https://api-monitoreofugas.test/api/v1/',
  // baseUrl: 'https://api-monitoreofugas.test',
   apiUrl: 'http://127.0.0.1:8000/api/v1/',
   baseUrl: 'http://127.0.0.1:8000/',
  //baseUrl: 'https://f2fb-2800-bf0-830c-1104-e0a0-fd55-abfb-2347.sa.ngrok.io',
  //apiUrl: 'https://f2fb-2800-bf0-830c-1104-e0a0-fd55-abfb-2347.sa.ngrok.io/api/v1/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
