
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnEBGDyW5OvPZcgKbZnfxRGiVZyJReOwQ",
  authDomain: "scope-website-a1f46.firebaseapp.com",
  projectId: "scope-website-a1f46",
  storageBucket: "scope-website-a1f46.firebasestorage.app",
  messagingSenderId: "540664957632",
  appId: "1:540664957632:web:2b4c8b2a9affdf09013b25",
  measurementId: "G-PBEXVR0SYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;