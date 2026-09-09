/**
 * ============================================================================
 * firebase.ts - Firebase SDK Configuration & Authentication Services
 * ============================================================================
 * Configures Firebase App, Google Auth Provider, and Firebase Storage
 * for KIXORA Luxury Footwear ecosystem.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeVd8RGT0KyFr-h5qKZE99iyL33HxNk9Y",
  authDomain: "kixora-99964.firebaseapp.com",
  projectId: "kixora-99964",
  storageBucket: "kixora-99964.firebasestorage.app",
  messagingSenderId: "659042300916",
  appId: "1:659042300916:web:69fdf6fae0978fa1fcbfa1",
  measurementId: "G-8RTGY4LCXC",
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google OAuth Provider with email/profile scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Initialize Cloud Storage
export const storage = getStorage(app);

/**
 * 1-Click Google Sign-In with Native Firebase Popup
 * Returns authenticated Google user credential with real email, name, and photo.
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  return await signInWithPopup(auth, googleProvider);
};

/**
 * Sign out from Firebase
 */
export const firebaseLogout = async (): Promise<void> => {
  await signOut(auth);
};
