import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNvtR_0bp3SeIbRoa-kGUd5GH0-nNrkBk",
  authDomain: "kandoban-oauth.firebaseapp.com",
  projectId: "kandoban-oauth",
  storageBucket: "kandoban-oauth.firebasestorage.app",
  messagingSenderId: "819001402749",
  appId: "1:819001402749:web:d05748c84b4ff155485814",
  measurementId: "G-J14RVCEF5C",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});
const db = getFirestore(firebaseApp);

export {
  auth,
  provider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut,
  db,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
};
