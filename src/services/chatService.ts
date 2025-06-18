// src/services/chatService.ts
import type { Message } from "@/pages/dashboard/Home/Home";
import { db } from "../firebase";
import { ref, push, onChildAdded, onChildRemoved, off, get, remove } from "firebase/database";

export const sendMessage = (chatId: string, message: Message) => {
  const messagesRef = ref(db, `chats/${chatId}/messages`);
  push(messagesRef, message);
};

// key inkluziv Message turi:
export interface ChatMessage extends Message {
  key: string;
}

export function subscribeToMessages(
  chatId: string,
  onAdd: (msg: ChatMessage) => void,
  onRemove?: (key: string) => void
) {
  const dbRef = ref(db, `chats/${chatId}/messages`);

  // 1) Initial load
  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.entries(data).forEach(([key, val]) => {
        onAdd({ ...(val as Message), key });
      });
    }
  });

  // 2) Listen for new messages
  const addListener = onChildAdded(dbRef, (snap) => {
    const val = snap.val() as Message;
    onAdd({ ...val, key: snap.key! });
  });

  // 3) (Optional) Listen for removed messages
  let removeListener: (() => void) | null = null;
  if (onRemove) {
    removeListener = onChildRemoved(dbRef, (snap) => {
      onRemove(snap.key!);
    });
  }

  // 4) Return cleanup
  return () => {
    off(dbRef, "child_added", addListener);
    if (removeListener) off(dbRef, "child_removed", removeListener);
  };
}

export const deleteMessage = async (chatId: string, messageKey: string) => {
  const messageRef = ref(db, `chats/${chatId}/messages/${messageKey}`);
  await remove(messageRef);
};

export const deleteChat = async (chatId: string) => {
  await remove(ref(db, `chats/${chatId}`));
};
