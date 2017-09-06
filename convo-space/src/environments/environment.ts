// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCcO7vEOw_b20z38K99Ky989IEg08NPgPc",
    authDomain: "convo-space.firebaseapp.com",
    databaseURL: "https://convo-space.firebaseio.com",
    projectId: "convo-space",
    storageBucket: "convo-space.appspot.com",
    messagingSenderId: "478184344515"
  }
};
