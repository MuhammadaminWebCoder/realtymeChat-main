import ChatBox from "@/layouts/ChatBox";
import ContactInfoBox from "@/layouts/ContactInfoBox";
import UsersListBox from "@/layouts/UsersListBox";
import { sendMessage, subscribeToMessages } from "@/services/chatService";
import { useContactInfo } from "@/store/zustandStore";
import { useEffect, useState } from "react";

export interface Message {
  text: string;
  createdAt?:number,
  senderId: string | null; // string bo'lishi kerak, Firebase UID
  senderName?: string;
  uid?: string;
  key?:any
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
if (currentUserId === userChatOpen) return;

  // Xabarlarni tinglash (realtime)
 useEffect(() => {
  if (!chatId) return;

  // Clear old messages when chat changes
  setMessages([]);

  const unsubscribe = subscribeToMessages(chatId, (message: Message) => {
    setMessages((prev) => {
      // Optional: prevent duplicate messages by checking timestamp or ID
      const isDuplicate = prev.some(m => m.createdAt === message.createdAt && m.text === message.text);
      if (isDuplicate) return prev;
      return [...prev, message];
    });
  });

  // CLEANUP listener when component unmounts or chatId changes
  return () => {
    unsubscribe(); // This calls `off()` internally
  };
  
}, [chatId]); // ✅ chatId o‘zgarganda qayta ishga tushadi


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
    <div className="chatHome flex w-full bg-slate-50 h-screen gap-5 min-[600px]:p-5">
      <UsersListBox />
      <ChatBox
        currentUser={receiverUser ?? {}}
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
