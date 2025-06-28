// services/fetchUnreadCount.ts
import { db } from "@/firebase";
import { ref, get } from "firebase/database";

export const fetchUnreadCount = async (chatId: string, currentUserId: string) => {
  const messagesRef = ref(db, `chats/${chatId}/messages`);
  const snapshot = await get(messagesRef);

  if (!snapshot.exists()) return 0;

  const messages = Object.values(snapshot.val());

  return messages.filter(
    (msg: any) => msg.senderId !== currentUserId && msg.seen === false
  ).length;
};
