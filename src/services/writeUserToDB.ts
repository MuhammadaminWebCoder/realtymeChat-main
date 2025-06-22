import { ref, update } from "firebase/database";
import { db } from "@/firebase";

interface UserDataType {
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayName: string | null;
  username: string;
}

export const writeUserToDB = async (user: UserDataType) => {
  try {
    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, {
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      username: user.username
      // ❌ online ni yo‘q qilmang
    });
    console.log("✅ User updated in database");
  } catch (error) {
    console.error("❌ Failed to update user:", error);
  }
};
