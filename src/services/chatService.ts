import type { Message } from "@/pages/dashboard/Home/Home";
import { db } from "@/firebase";
import {
  ref,
  push,
  onChildAdded,
  onChildRemoved,
  off,
  get,
  remove,
  update,
  set,
  onChildChanged,
} from "firebase/database";

// ✅ Yangi xabar yuborish
export const sendMessage = (chatId: string, message: Message) => {
  const messagesRef = ref(db, `chats/${chatId}/messages`);
  const newMessageRef = push(messagesRef);

  set(newMessageRef, {
  ...message,
  timestamp: message.timestamp, // 👈 createdAt ni timestamp deb saqlayapti
  seen: false,
});
};


// ✅ ChatMessage turi (Message + Firebase key)
export interface ChatMessage extends Message {
  key: string;
}

// ✅ Xabarlarni real vaqtli tinglash
export function subscribeToMessages(
  chatId: string,
  onAdd: (msg: ChatMessage) => void,
  onRemove?: (key: string) => void,
  onChange?: (msg: ChatMessage) => void
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

  // 2) New messages
  const addListener = onChildAdded(dbRef, (snap) => {
    const val = snap.val() as Message;
    onAdd({ ...val, key: snap.key! });
  });

  // 3) Removed messages
  let removeListener: (() => void) | null = null;
  if (onRemove) {
    removeListener = onChildRemoved(dbRef, (snap) => {
      onRemove(snap.key!);
    });
  }

  // ✅ 4) Changed messages (e.g., seen update)
  let changeListener: (() => void) | null = null;
  if (onChange) {
    changeListener = onChildChanged(dbRef, (snap) => {
      const val = snap.val() as Message;
      onChange({ ...val, key: snap.key! });
    });
  }

  return () => {
    off(dbRef, "child_added", addListener);
    if (removeListener) off(dbRef, "child_removed", removeListener);
    if (changeListener) off(dbRef, "child_changed", changeListener);
  };
}


// ✅ Xabarni o‘chirish
export const deleteMessage = async (chatId: string, messageKey: string) => {
  const messageRef = ref(db, `chats/${chatId}/messages/${messageKey}`);
  await remove(messageRef);
};

// ✅ To‘liq chatni o‘chirish
export const deleteChat = async (chatId: string) => {
  await remove(ref(db, `chats/${chatId}`));
};

// ✅ Xabarni `ko‘rildi` deb belgilash
export const markMessageAsSeen = async (
  chatId: string,
  messageKey: string
) => {
  const messageRef = ref(db, `chats/${chatId}/messages/${messageKey}`);
  await update(messageRef, { seen: true });
};
