import ChatHeader from "@/components/chatBox/ChatHeader"
import MessageInput from "@/components/chatBox/MessageInput"
import MessageItem from "@/components/chatBox/MessageItem"
import type { Message } from "@/pages/dashboard/Home/Home"
import { useEffect, useState, type Dispatch, type SetStateAction } from "react"

// ChatBox komponent uchun interface
interface ChatBoxProps {
  messages: Message[]
  onSend: (text: string) => void
  currentUserId: string | null
  currentUser: {
    photoURL?: string
    username?: string
    name?: string
  }
  userChatOpen: string | null
  setUserChatOpen: (val: string | null) => void
  setMessages: Dispatch<SetStateAction<Message[]>>
}

// ChatBox komponent
const ChatBox: React.FC<ChatBoxProps> = ({
  currentUser,
  userChatOpen,
  setUserChatOpen,
  setMessages,
  messages,
  onSend,
  currentUserId
}) => {
  // Komponent qaytarish 
  const [backToUserList,setBackToUserList] = useState(true)
  useEffect(()=>{
    if (userChatOpen && backToUserList==true) {
      setBackToUserList(false)
    }
    console.log(backToUserList);
    
  },[userChatOpen])
  return (
    <div className={`${currentUser ? 'max-[800px]:absolute max-[800px]:w-full' : 'max-[800px]:hidden'} ${backToUserList && 'max-[800px]:hidden'} left-0 top-0 rounded-md h-full overflow-hidden !bg-slate-50 flex flex-col flex-1 border-slate-100`}>
      {/* Chat header qismi */}
      <ChatHeader 
      setBackToUserList={setBackToUserList}
        avatar={currentUser?.photoURL || 'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg'} 
        isActive={true} 
        username={currentUser?.username || currentUser?.name || 'Evansite95'}
      />
      
      {/* Chat ichki qismi */}
      <div className="p-5 relative gap-4 flex-1 flex flex-col">
        <MessageItem
          messages={messages}
          currentUserId={currentUserId}
          userChatOpen={userChatOpen}
          setUserChatOpen={setUserChatOpen}
          setMessages={setMessages}
        />
        <MessageInput onSend={onSend} />
      </div>
    </div>
  )
}

export default ChatBox
