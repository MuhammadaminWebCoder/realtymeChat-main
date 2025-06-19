import React, { useEffect, useRef, useState } from "react"
import {ContextMenu,ContextMenuContent,ContextMenuItem,ContextMenuTrigger,} from "@/components/ui/context-menu"
import { CheckCircle, Pen, Trash } from "lucide-react"
import type { Message } from "@/pages/dashboard/Home/Home"
import { deleteMessage } from "@/services/chatService"

type Props = {
  messages: Message[];
  currentUserId: string | null;
  userChatOpen: string | null;
  setUserChatOpen: (val: string | null) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

const MessageItem: React.FC<Props> = ({messages,currentUserId,userChatOpen,setMessages}) => {

  const formatTime = (timestamp: number | undefined) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 50

    if (isAtBottom) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
    }
  }, [messages.length])
  const handleDeleteMessage = async (messageKey: string) => {
  if (!userChatOpen || !currentUserId) return;
  const chatId = [currentUserId, userChatOpen].sort().join("_");
  deleteMessage(chatId, messageKey)
    try {
    await deleteMessage(chatId, messageKey);
    console.log("✅ Message deleted");

    // Lokal holatdan o‘chirish
    setMessages((prev) => prev.filter((msg) => msg.key !== messageKey));
  } catch (err) {
    console.error("❌ Message delete error:", err);
  }
};

      return (
        <div className="h-[calc(100%-60px)] min-h-0 pr-2 -mr-4 overflow-y-auto" onClick={() => setSelectedId(null)}>
          <div
            className="min-[450px]:p-4 !pt-0 space-y-3 h-full"
            ref={scrollRef}
          >
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === currentUserId 
              const isSelected = selectedId === index
    
              return (
                <ContextMenu
                  key={index}
                  onOpenChange={(open) => {
                    if (!open) {
                      setSelectedId(null)
                    }
                  }}
                >
                  <ContextMenuTrigger
                    onContextMenu={(e) => {
                      e.stopPropagation()
                      setSelectedId(index)
                    }}
                    className={`flex flex-col max-w-[80%] ${isOwnMessage ? "items-end ml-auto" : "items-start"}`}>
                    <div
                      className={`
                             p-2.5 text-sm rounded-lg w-fit transition-colors duration-150
                            ${isOwnMessage ? 'bg-slate-500 text-white' : 'bg-slate-200 text-black'}
                            ${isSelected ? '!bg-blue-500/100' : ''}
                      `}
                    >
                      {message.text}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.createdAt)} PM
                    </p>
                  </ContextMenuTrigger>
    
                  <ContextMenuContent className="w-40">
                    <ContextMenuItem>
                      <CheckCircle className="mr-2 h-4 w-4" /> Select
                    </ContextMenuItem>
                    <ContextMenuItem>
                      <Pen className="mr-2 h-4 w-4" /> Edit
                    </ContextMenuItem>
                    <ContextMenuItem variant="destructive" onClick={() => handleDeleteMessage(message.key)}>
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              )
            })}
          </div>
        </div>
      )}

export default MessageItem
