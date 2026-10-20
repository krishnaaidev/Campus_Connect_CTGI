import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAIiP0Tl8d6oX52l4k6NBrI30TJGEyIfq8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "campus-connect-ctgi.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "campus-connect-ctgi",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "campus-connect-ctgi.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "650737172801",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:650737172801:web:72d889853bc4ecfeeea1c0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1LJ5RL90FR"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
