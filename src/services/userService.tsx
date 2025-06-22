import { db } from "@/firebase";
import { ref, onValue, off } from "firebase/database";
import type { User } from "@/store/zustandStore";

export const subscribeToUsers = (callback: (users: User[]) => void) => {
  const usersRef = ref(db, "users");

  const handleSnapshot = (snapshot: any) => {
    const data = snapshot.val();
    if (!data) return callback([]);

    const usersArray = Object.entries(data).map(([uid, val]: [string, any]) => ({
      uid,
      ...val,
      isActive: val.online === true,
    }));

    callback(usersArray);
  };

  onValue(usersRef, handleSnapshot); // 👈 listenerni o‘rnatamiz

  return () => {
    // ✅ off() uchun aynan shu listener function kerak
    off(usersRef, "value", handleSnapshot);
  };
};
