import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOGrga_UUA4vEv9iVPrnW8UBPbsX-amC4",
  authDomain: "airqualitymonitor-12e1a.firebaseapp.com",
  databaseURL: "https://airqualitymonitor-12e1a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "airqualitymonitor-12e1a",
  storageBucket: "airqualitymonitor-12e1a.firebasestorage.app",
  messagingSenderId: "795366625752",
  appId: "1:795366625752:web:b55be2180f1765779fa2ad",
  measurementId: "G-TVRTF93ZX3",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);