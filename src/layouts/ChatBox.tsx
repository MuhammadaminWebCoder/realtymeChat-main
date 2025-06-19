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
  },[userChatOpen])
  
  return (
    <div className={`${currentUser ? 'max-[800px]:absolute left-0 top-0 max-[800px]:w-full ' : 'max-[800px]:hidden '}
    ${backToUserList && 'max-[800px]:hidden '} overflow-hidde rounded-md !bg-slate-50 h-full flex flex-col flex-1 border-slate-100`}>
      {/* Chat header qismi */}
      <ChatHeader 
      setBackToUserList={setBackToUserList}
        avatar={currentUser?.photoURL || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-439DWYBIlMKtzkqbQqBpg9YNVgT13pkhCoPXmad5lg3Dk0mdmBLPlPGLUYQhF73sNH4&usqp=CAU'} 
        isActive={false} 
        username={currentUser?.username || currentUser?.name || 'Username not found'}
      />
      {/* Chat ichki qismi */}
      <div className="p-5 relative min-h-0 gap-4 flex-1">
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
