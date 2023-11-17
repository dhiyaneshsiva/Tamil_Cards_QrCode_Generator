import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAT3zwoc3tokTJ2x-VaiHB9whJv-aYZZug",
  authDomain: "qrcode-tamil-cards.firebaseapp.com",
  projectId: "qrcode-tamil-cards",
  storageBucket: "qrcode-tamil-cards.appspot.com",
  messagingSenderId: "634730676271",
  appId: "1:634730676271:web:f3785947a905297bda86da",
  measurementId: "G-1H90SX7500",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
