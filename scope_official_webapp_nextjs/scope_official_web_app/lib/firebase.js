import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClQBAnjI1kzsh0qwF2x2pqyxnCoMWoeBo",
  authDomain: "scope-webapp.firebaseapp.com",
  projectId: "scope-webapp",
  storageBucket: "scope-webapp.firebasestorage.app",
  messagingSenderId: "1082124319796",
  appId: "1:1082124319796:web:406be92a1496f1bac31e61"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);