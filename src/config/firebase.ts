import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate required environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBYK7NzlXyCT8dWKo6ghXECbp0xJXClhCI",
  authDomain: "pollify-50468.firebaseapp.com",
  projectId: "pollify-50468",
  storageBucket: "pollify-50468.firebasestorage.app",
  messagingSenderId: "868568931115",
  appId: "1:868568931115:web:6f9750cd5da781255d436e",
  measurementId: "G-YGZYGD5BZZ"
};

// Check for missing or placeholder values
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value || value.includes('your_') || value === 'undefined')
  .map(([key]) => `VITE_FIREBASE_${key.toUpperCase()}`);

if (missingVars.length > 0) {
  console.error('❌ Missing or invalid Firebase environment variables:', missingVars);
  console.error('📝 Please update your .env file with actual Firebase configuration values');
  console.error('🔗 Get your config from: https://console.firebase.google.com/project/YOUR_PROJECT/settings/general');
}

const firebaseConfig = {
  ...requiredEnvVars,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;