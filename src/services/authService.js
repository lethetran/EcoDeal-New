// src/services/authService.js
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const register = async (email, password, displayName = "") => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }
  return credential;
};

export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

export const resetPassword = (email) =>
  sendPasswordResetEmail(auth, email);

export const logout = () => signOut(auth);
