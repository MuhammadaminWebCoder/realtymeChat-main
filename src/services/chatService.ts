// services/chatService.ts
import type { Message } from "@/pages/dashboard/Home/Home";
import { db } from "@/firebase";
import {
  ref,
  push,
  onChildRemoved,
  onChildChanged,
  get,
  off,
  remove,
  update,
  set,
  onValue,
} from "firebase/database";

export interface ChatMessage extends Message {
  key: string;
}

export const sendMessage = (chatId: string, message: Message) => {
  const messagesRef = ref(db, `chats/${chatId}/messages`);
  const newMessageRef = push(messagesRef);
  const payload = {
    ...message,
    timestamp: message.createdAt ?? Date.now(),
    seen: false,
  };
  set(newMessageRef, payload);
};

export const subscribeToLastMessageAndCount = (
  chatId: string,
  currentUserId: string,
  callback: (data: { message: string; dateTyme: string; isSeeCount: number | null }) => void
) => {
  const messagesRef = ref(db, `chats/${chatId}/messages`);

  const unsubscribe = onValue(messagesRef, (snapshot) => {
    let lastMessage: any = null;
    let unseenCount = 0;

    snapshot.forEach((child) => {
      const msg = child.val();

      if (msg?.senderId !== currentUserId && msg?.seen === false) {
        unseenCount += 1;
      }

      // Fix: Check msg.timestamp and msg.text exist
      if (msg?.timestamp && msg?.text) {
        if (!lastMessage || msg.timestamp > lastMessage.timestamp) {
          lastMessage = msg;
        }
      }
    });

    callback({
      message: lastMessage?.text || "no last message",
      dateTyme: lastMessage?.timestamp
        ? new Date(lastMessage.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      isSeeCount: unseenCount > 0 ? unseenCount : null,
    });
  });

  return () => off(messagesRef, "value", unsubscribe);
};


export function subscribeToMessages(
  chatId: string,
  onAdd: (msg: ChatMessage) => void,
  onRemove?: (key: string) => void,
  onChange?: (msg: ChatMessage) => void
) {
  const dbRef = ref(db, `chats/${chatId}/messages`);

  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.entries(data).forEach(([key, val]) => {
        onAdd({ ...(val as Message), key });
      });
    }
  });


  if (onRemove) onChildRemoved(dbRef, (snap) => onRemove(snap.key!));
  if (onChange)
    onChildChanged(dbRef, (snap) => {
      const val = snap.val() as Message;
      onChange({ ...val, key: snap.key! });
    });

  return () => {
    off(dbRef);
  };
}

export const markMessageAsSeen = async (chatId: string, messageKey: string) => {
  const messageRef = ref(db, `chats/${chatId}/messages/${messageKey}`);
  await update(messageRef, { seen: true });
};

export const deleteMessage = async (chatId: string, messageKey: string) => {
  const messageRef = ref(db, `chats/${chatId}/messages/${messageKey}`);
  await remove(messageRef);
};

export const deleteChat = async (chatId: string) => {
  await remove(ref(db, `chats/${chatId}`));
};
