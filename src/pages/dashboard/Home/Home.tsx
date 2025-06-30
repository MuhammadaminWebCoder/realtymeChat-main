// Home.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatBox from "@/layouts/ChatBox";
import ContactInfoBox from "@/layouts/ContactInfoBox";
import UsersListBox from "@/layouts/UsersListBox";
import {
  subscribeToMessages,
  markMessageAsSeen,
  sendMessage,
  type ChatMessage,
} from "@/services/chatService";
import { useContactInfo } from "@/store/zustandStore";

export interface Message {
  text: string;
  createdAt?: number;
  senderId: string | null;
  senderName?: string;
  uid?: string;
  key?: any;
  seen?: boolean;
  timestamp?: number;
}

const Home = () => {
  const { id: otherUserId } = useParams();
  const {
    userChatOpen,
    setUserChatOpen,
    users,
    contactInfo,
    currentUser,
  } = useContactInfo();

  const [messages, setMessages] = useState<Message[]>([]);

  // ✅ Faqat bir marta URL dan userChatOpen ni o‘rnatish
  useEffect(() => {
    if (otherUserId && otherUserId !== userChatOpen) {
      setUserChatOpen(otherUserId);
    }
  }, [otherUserId, userChatOpen, setUserChatOpen]);

  const chatId =
    currentUser?.uid && userChatOpen
      ? [currentUser.uid, userChatOpen].sort().join("_")
      : null;

  const receiverUser = users.find((u) => u.uid === userChatOpen);

  // ✅ Xabarlarni olish
  useEffect(() => {
    if (!chatId || !currentUser?.uid) return;

    setMessages([]);

    const unsubscribe = subscribeToMessages(
      chatId,
      (message: ChatMessage) => {
        setMessages((prev) => {
          const exists = prev.some((m) => m.key === message.key);
          return exists ? prev : [...prev, message];
        });

        if (
          message.senderId !== currentUser.uid &&
          message.seen === false &&
          message.key
        ) {
          markMessageAsSeen(chatId, message.key);
        }
      },
      (removedKey: string) => {
        setMessages((prev) => prev.filter((msg) => msg.key !== removedKey));
      },
      (updatedMsg: ChatMessage) => {
        setMessages((prev) =>
          prev.map((m) => (m.key === updatedMsg.key ? updatedMsg : m))
        );
      }
    );

    return () => unsubscribe();
  }, [chatId, currentUser?.uid]);

  const handleSend = (text: string) => {
    if (!text.trim() || !chatId || !currentUser?.uid) return;

    const msg: Message = {
      text,
      senderId: currentUser.uid,
      createdAt: Date.now(),
    };

    sendMessage(chatId, msg);
  };

  return (
    <div className="chatHome flex w-full dark:bg-slate-800 bg-slate-50 h-full gap-5 min-[600px]:p-5">
      <UsersListBox />
      {contactInfo ? (
        <ContactInfoBox currentUser={receiverUser} />
      ) : (
        <ChatBox
          currentUser={receiverUser}
          currentUserId={currentUser?.uid}
          messages={messages}
          onSend={handleSend}
          userChatOpen={userChatOpen}
          setUserChatOpen={setUserChatOpen}
          setMessages={setMessages}
        />
      )}
    </div>
  );
};

export default Home;
