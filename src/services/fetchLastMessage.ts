import { db } from "@/firebase";
import { ref, query, orderByChild, limitToLast, get } from "firebase/database";

export const fetchLastMessage = async (chatId: string): Promise<{ senderId: string; seen: boolean; createdAt?: number; text?: string } | null> => {
  const messagesRef = ref(db, `chats/${chatId}/messages`);
  const lastMsgQuery = query(messagesRef, orderByChild("timestamp"), limitToLast(1));
  const snapshot = await get(lastMsgQuery);

  if (!snapshot.exists()) return null;

  const messages = snapshot.val();
  const lastMessage = Object.values(messages)[0];
  if (lastMessage && typeof lastMessage === 'object' && 'senderId' in lastMessage && 'seen' in lastMessage) {
 return (lastMessage ?? {}) as { senderId: string; seen: boolean; createdAt?: number; text?: string };
} else {
  return null;
}
};
