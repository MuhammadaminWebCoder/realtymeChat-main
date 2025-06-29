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
  const { id: otherUserId } = useParams(); // 👈 URL dan /chat/:id
  const {
    userChatOpen,
    setUserChatOpen,
    users,
    contactInfo,
  } = useContactInfo();

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const currentUserId = userData?.uid || null;

  const [messages, setMessages] = useState<Message[]>([]);

  // ✅ Faqat bir marta userChatOpen ni path dan o‘rnatish
 useEffect(() => {
    if (!userChatOpen && otherUserId) {
      setUserChatOpen(otherUserId);
    }
  }, [otherUserId, userChatOpen, setUserChatOpen]);

  const receiverUser = users.find((u) => u.uid === userChatOpen);
  const chatId =
    currentUserId && userChatOpen
      ? [currentUserId, userChatOpen].sort().join("_")
      : null;

  // ✅ Xabarlarni olish
  useEffect(() => {
    if (!chatId || !currentUserId) return;

    setMessages([]); // clear old messages

    const unsubscribe = subscribeToMessages(
      chatId,
      (message: ChatMessage) => {
        // 🔘 Duplicate message filter
        setMessages((prev) => {
          const exists = prev.some((m) => m.key === message.key);
          if (exists) return prev;
          return [...prev, message];
        });

        // ✅ Agar boshqa user yuborgan bo‘lsa, uni ko‘rildi deb belgilaymiz
        if (
          message.senderId !== currentUserId &&
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
  }, [chatId, currentUserId]);

  // ✅ Xabar yuborish
  const handleSend = (text: string) => {
    if (!text.trim() || !chatId || !currentUserId) return;

    const msg: Message = {
      text,
      senderId: currentUserId,
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
          currentUserId={currentUserId}
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
