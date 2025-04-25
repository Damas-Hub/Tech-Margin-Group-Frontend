import { initializeApp, getApps, getApp, FirebaseApp, deleteApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  Auth,
} from "firebase/auth";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Main app initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Secondary app handling
let secondaryApp = null;

const getSecondaryApp = () => {
  if (!secondaryApp) {
    secondaryApp = initializeApp(firebaseConfig, "Secondary");
  }
  return secondaryApp;
};

const getSecondaryAuth = () => getAuth(getSecondaryApp());

const cleanupSecondaryApp = async () => {
  if (secondaryApp) {
    await deleteApp(secondaryApp);
    secondaryApp = null;
  }
};

export {
  db,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getSecondaryAuth,
  getSecondaryApp,
  cleanupSecondaryApp,
};
