import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYK7NzlXyCT8dWKo6ghXECbp0xJXClhCI",
  authDomain: "pollify-50468.firebaseapp.com",
  projectId: "pollify-50468",
  storageBucket: "pollify-50468.firebasestorage.app",
  messagingSenderId: "868568931115",
  appId: "1:868568931115:web:6f9750cd5da781255d436e",
  measurementId: "G-YGZYGD5BZZ"
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

// Add additional scopes if needed
googleProvider.addScope('email');
googleProvider.addScope('profile');

export default app;