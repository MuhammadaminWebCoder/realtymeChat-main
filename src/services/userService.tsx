import { get, ref } from "firebase/database";
import { db } from "@/firebase";

export const fetchAllUsers = async () => {
  const snapshot = await get(ref(db, 'users'));
  if (!snapshot.exists()) return [];
  
  const data = snapshot.val();
  return Object.entries(data).map(([uid, value]: [string, any]) => ({
    uid,
    ...value,
  }));
};
