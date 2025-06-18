import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider,signInWithPhoneNumber } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBLKq00T8I-Jsvs_Sm8bu7qZFeqc0ATfYs",
  authDomain: "chat-app-a0912.firebaseapp.com",
  databaseURL: "https://chat-app-a0912-default-rtdb.firebaseio.com",
  projectId: "chat-app-a0912",
  storageBucket: "chat-app-a0912.firebasestorage.app",
  messagingSenderId: "1084477383670",
  appId: "1:1084477383670:web:0e3dcee613bbb0b1831dd7",
  measurementId: "G-KDR3TYC19P"
};
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app);

const googleProvider = new GoogleAuthProvider()
const appleProvider  = new OAuthProvider("apple.com");

export {db, auth, googleProvider, appleProvider, signInWithPhoneNumber };
