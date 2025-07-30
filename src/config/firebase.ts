import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate required environment variables
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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