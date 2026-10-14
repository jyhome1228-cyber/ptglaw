/*
 * PENTAGON Firestore configuration.
 * Browser SDK configuration is public by design; it is NOT an admin credential.
 * This module only exports configuration. It does NOT initialize authentication,
 * replace existing JSON CMS, or access the database until imported by a later module.
 */
export const firebaseConfig = Object.freeze({
  apiKey: "AIzaSyDPUSZ7n8am8Uqsreh2MfC6ZESOnRVAYFE",
  authDomain: "ptglaw-8f411.firebaseapp.com",
  projectId: "ptglaw-8f411",
  storageBucket: "ptglaw-8f411.firebasestorage.app",
  messagingSenderId: "119145887319",
  appId: "1:119145887319:web:3c65e3ec199c9d8d9b1512"
});

export const collections = Object.freeze({
  news: "news",
  cases: "cases",
  admins: "admins"
});
