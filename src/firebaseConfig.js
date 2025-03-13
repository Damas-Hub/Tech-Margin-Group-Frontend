import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBX_KgEmcFcYH9yQbs_Kc0GufHBF191-dE",
  authDomain: "tech-margin-group-fa802.firebaseapp.com",
  projectId: "tech-margin-group-fa802",
  storageBucket: "tech-margin-group-fa802.appspot.com",
  messagingSenderId: "606769289886",
  appId: "1:606769289886:web:071e32ccae5a819d84b98f",
  measurementId: "G-WF13ZZ07M8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Firestore database
const auth = getAuth(app);      // Firebase authentication

export { db, auth };
