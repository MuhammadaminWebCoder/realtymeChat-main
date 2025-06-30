import { Smile } from "lucide-react";
import { GoPaperclip } from "react-icons/go";
import { IoMicOutline } from "react-icons/io5";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import type React from "react";
import { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";

const MessageInput: React.FC<{ onSend: (text: string) => void }> = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const HandleSubmitInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() !== "") {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={HandleSubmitInput}
      className="flex  w-full p-5 gap-3 items-end dark:bg-slate-800 z-10"
    >
      <div className="inputGroup-container !bg-slate-100 overflow-hidden rounded-[20px] flex-1 relative">
        <Smile className="absolute left-2 bottom-2 text-gray-500" />
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-[20px] border-none px-10 py-2 dark:text-black min-h-[40px] max-h-[100px] w-full resize-none overflow-y-auto break-all"
          placeholder="Type a message"
        />
        <div className="absolute py-3 bottom-0 right-4">
          <input type="file" id="file-upload" className="hidden" />
          <label htmlFor="file-upload">
            <GoPaperclip className="cursor-pointer text-gray-500" />
          </label>
        </div>
      </div>
      <Button
        type={message.length > 0 ? "submit" : "button"}
        className="rounded-full cursor-pointer w-10 h-10 bg-slate-400 dark:text-white"
      >
        {message.length > 0 ? (
          <FaTelegramPlane className="w-5 h-5" />
        ) : (
          <IoMicOutline className="w-5 h-5" />
        )}
      </Button>
    </form>
  );
};

export default MessageInput;
