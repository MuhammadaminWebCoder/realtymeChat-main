import React, { useEffect, useRef, useState } from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { PiChecksBold } from "react-icons/pi";
import { HiCheck } from "react-icons/hi";
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

const MessageItem: React.FC<Props> = ({
  messages,
  currentUserId,
  userChatOpen,
  setMessages,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [prevMessagesCount, setPrevMessagesCount] = useState(0)

  // Pastga scroll bo‘lishi uchun — BIR MARTALIK
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight, behavior: "auto" })
  }, [])

  // Yangi xabar kelganda scroll to bottom
 useEffect(() => {
  const container = scrollRef.current
  if (!container) return

  if (messages.length > prevMessagesCount) {
    // faqat yangi xabar qo‘shilganda scroll
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
  }

  setPrevMessagesCount(messages.length)
}, [messages.length])

  const formatTime = (timestamp: number | undefined) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  const handleDeleteMessage = async (messageKey: string) => {
    if (!userChatOpen || !currentUserId) return
    const chatId = [currentUserId, userChatOpen].sort().join("_")

    try {
      await deleteMessage(chatId, messageKey)
      console.log("✅ Message deleted")

      setMessages((prev) => prev.filter((msg) => msg.key !== messageKey))
    } catch (err) {
      console.error("❌ Message delete error:", err)
    }
  }

  return (
    <div
      ref={scrollRef}
      className="h-[calc(100%-60px)] pt-5 px-0 min-h-0 overflow-y-auto"
      onClick={() => setSelectedId(null)}
    >
      <div className="p-4 !py-0 space-y-3 flex flex-col">
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId === currentUserId
          const isSelected = selectedId === index

          return (
            <ContextMenu
              key={index}
              onOpenChange={(open) => {
                if (!open) setSelectedId(index)
              }}
            >
              <ContextMenuTrigger
                onContextMenu={(e) => {
                  e.stopPropagation()
                  setSelectedId(index)
                }}
                className={`flex flex-col max-w-[80%]  ${
                  isOwnMessage ? "items-end ml-auto" : "items-start"
                }`} style={{ wordBreak: "break-word", whiteSpace: "pre-wrap", overflowWrap: "break-word",}}>
                <div
                  className={`p-2.5 text-sm rounded-lg w-fit transition-colors duration-150
                  ${isOwnMessage ? "bg-slate-500 text-white" : "bg-slate-200 text-black"}
                  ${isSelected ? "!bg-blue-500/100" : ""}`}
                >
                  {message.text}
                </div>
                <div className="flex items-center">
                <p className="text-xs me-2 text-muted-foreground mt-1">
                  {formatTime(message.createdAt)} PM
                </p>
                  {isOwnMessage && (
    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
      {message.seen ? <PiChecksBold size={23}/> : <HiCheck size={23}/>}
    </div>
  )}
                </div>
                
              </ContextMenuTrigger>

              <ContextMenuContent className="w-40">
                <ContextMenuItem>
                  <CheckCircle className="mr-2 h-4 w-4" /> Select
                </ContextMenuItem>
                <ContextMenuItem>
                  <Pen className="mr-2 h-4 w-4" /> Edit
                </ContextMenuItem>
                <ContextMenuItem
                  variant="destructive"
                  onClick={() => handleDeleteMessage(message.key)}
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          )
        })}
      </div>
    </div>
  )
}

export default MessageItem
