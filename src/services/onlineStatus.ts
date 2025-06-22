import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, onDisconnect, serverTimestamp } from "firebase/database";

export const setUserOnlineStatus = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const db = getDatabase();
  const userOnlineRef = ref(db, `users/${user.uid}/online`);
  const userLastSeenRef = ref(db, `users/${user.uid}/lastSeen`);

  // 1. Avval online: true deb yozamiz
  set(userOnlineRef, true)
    .then(() => {
      console.log("✅ Online written");
    })
    .catch((err) => {
      console.error("❌ Failed to write online:", err);
    });

  // 2. Brauzer yopilganda offline qilishni sozlaymiz
  onDisconnect(userOnlineRef).set(false);
  onDisconnect(userLastSeenRef).set(serverTimestamp());
};
