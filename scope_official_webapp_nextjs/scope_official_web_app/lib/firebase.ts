import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// REPLACE THESE VALUES WITH YOUR ACTUAL FIREBASE CONFIG
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

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);

export default app;