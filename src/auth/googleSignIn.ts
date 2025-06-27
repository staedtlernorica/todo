// authService.js
import { auth, provider, signInWithPopup, signOut } from "../config/firebase";

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error(err);
  }
};

export const logout = async () => {
  await signOut(auth);
};
