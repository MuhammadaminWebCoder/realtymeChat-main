import { auth, googleProvider, appleProvider } from "@/firebase";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const loginWithProvider = async (provider: "google" | "apple") => {
  let prov;
  if (provider === "google") prov = googleProvider;
  if (provider === "apple") prov = appleProvider;

  const result = await signInWithPopup(auth, prov!);
  return result.user;
};

export const registerWithEmail = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};
