import ChatBox from "@/layouts/ChatBox";
import ContactInfoBox from "@/layouts/ContactInfoBox";
import UsersListBox from "@/layouts/UsersListBox";
import {  markMessageAsSeen, sendMessage, subscribeToMessages, type ChatMessage } from "@/services/chatService";
import { useContactInfo } from "@/store/zustandStore";
import { useEffect, useState } from "react";

export interface Message {
  text: string;
  createdAt?:number,
  senderId: string | null; // string bo'lishi kerak, Firebase UID
  senderName?: string;
  uid?: string;
  key?:any,
  seen?:boolean
}

const Home = () => {

  const { userChatOpen,users,setUserChatOpen  } = useContactInfo(); // bu suhbatdoshning UID
  const receiverUser = users.find(user => user.uid === userChatOpen);

  // O'zingizning foydalanuvchi ma'lumotlaringizni localStorage dan oling
  const userDataString = localStorage.getItem("userData");
  const currentUser = userDataString ? JSON.parse(userDataString) : null;
  const currentUserId = currentUser?.uid ?? null;
  
  const chatId = currentUserId && userChatOpen 
  ? [currentUserId, userChatOpen].sort().join("_") 
  : null;
    
  const [messages, setMessages] = useState<Message[]>([]);
if (currentUserId === userChatOpen) return null;

useEffect(() => {
  if (!chatId) return;

  setMessages([]);

  const unsubscribe = subscribeToMessages(
    chatId,
    (message: ChatMessage) => {
      // 🔵 ADD yangi message
      if (
  message.senderId !== currentUserId &&
  userChatOpen === message.senderId &&
  message.seen === false &&
  message.key
) {
  markMessageAsSeen(chatId, message.key);
}

      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) => m.createdAt === message.createdAt && m.text === message.text
        );
        if (isDuplicate) return prev;
        return [...prev, message];
      });
    },
    // 🔴 REMOVE
    (removedKey: string) => {
      setMessages((prev) => prev.filter((msg) => msg.key !== removedKey));
    },
    // 🟢 CHANGE — real-time seen update
    (updatedMsg: ChatMessage) => {
      setMessages((prev) =>
        prev.map((m) => (m.key === updatedMsg.key ? updatedMsg : m))
      );
    }
  );

  return () => unsubscribe();
}, [currentUserId, userChatOpen]);


 const handleSend = (text: string) => {
  if (!text.trim() || !currentUserId || !chatId) return;

  const message: Message = {
    text,
    senderId: currentUserId,
    createdAt: Date.now(),
  };

  sendMessage(chatId, message);
};


  return (
    <div className="chatHome flex w-full dark:bg-slate-800 bg-slate-50 h-full gap-5 min-[600px]:p-5">
      <UsersListBox />
      <ChatBox
        currentUser={receiverUser}
        currentUserId={currentUserId}
        messages={messages}
        onSend={handleSend}
        userChatOpen={userChatOpen}
        setUserChatOpen={setUserChatOpen}
        setMessages={setMessages}
      />
      <ContactInfoBox currentUser={receiverUser} />
    </div>
  );
};

export default Home;
