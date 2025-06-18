import { ref, set } from "firebase/database";
import { db } from "@/firebase"; // bu sizda allaqachon bor

interface UserDataType {
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayName: string | null;
  username: string;
}

export const writeUserToDB = async (user: UserDataType) => {
  try {
    await set(ref(db, `users/${user.uid}`), {
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      username: user.username,
    });
    console.log("✅ User written to database");
  } catch (error) {
    console.error("❌ Failed to write user to database:", error);
  }
};
