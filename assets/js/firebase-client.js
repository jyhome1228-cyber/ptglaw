import {initializeApp,getApps,getApp} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js';
import {getFirestore} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
import {getAuth} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import {firebaseConfig} from './firebase-config.js';
const app=getApps().length?getApp():initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth=getAuth(app);
