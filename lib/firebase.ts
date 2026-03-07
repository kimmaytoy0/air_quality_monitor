import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDG1K7Cs1X2gU4FRAZFS7NfjGDxh7U1kxs",
  authDomain: "airquality-36305.firebaseapp.com",
  databaseURL:"https://airquality-36305-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "airquality-36305",
  storageBucket: "airquality-36305.appspot.com",
  messagingSenderId: "131066862637",
  appId: "1:131066862637:web:391c2e92d78ff61cec2ca4"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);