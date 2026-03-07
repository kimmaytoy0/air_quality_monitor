import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDG1K7Cs1X2gU4FRAZFS7NfjGDxh7U1kxs",
  authDomain: "airquality-36305.firebaseapp.com",
  databaseURL: "https://airquality-36305-default-rtdb.asia-southeast1.firebasedatabase.app ",
  projectId: "airquality-36305",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);