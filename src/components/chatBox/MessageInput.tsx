import { Smile } from "lucide-react";
import { GoPaperclip } from "react-icons/go";
import { IoMicOutline } from "react-icons/io5";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import type React from "react";
import { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";


const MessageInput: React.FC<{onSend: (text: string) => void}> = ({ onSend }) => {
  const [message,setMessage] = useState('')
  const HandleSubmitInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message.trim() !== '') {
      onSend(message)
      setMessage('')
    }
  }
  return (
    <form onSubmit={HandleSubmitInput} className="flex absolute w-full p-5 -bottom-10 left-[50%] transform -translate-1/2 gap-3 items-center">
      <div style={{boxShadow:'0px 0px 7px 3px rgb(235, 235, 235)'}} className="inputGroup bg-white overflow-hidden rounded-[20px] flex-1 relative">
        <Smile className="absolute left-2 bottom-2" />
        <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="rounded-[20px] !border-none px-10 min-h-[40px] max-h-[100px w-full resize-none break-all" placeholder="Type a message"/>
        <div className="absolute py-3 cursor-pointer bottom-0 right-4">
          <input type="file" id="file-upload" className="hidden" />
          <label htmlFor="file-upload">
            <GoPaperclip className="cursor-pointer" />
          </label>
        </div>
      </div>
      <Button type={message.length > 0 ? 'submit' : 'button'} className="rounded-full cursor-pointer !w-10 !bg-slate-400 !h-10">
       {message.length > 0 ? <FaTelegramPlane className="!w-7 !h-7" /> : <IoMicOutline className="!w-7 !h-7" />  }
      </Button>
    </form>
  );
};

export default MessageInput;
