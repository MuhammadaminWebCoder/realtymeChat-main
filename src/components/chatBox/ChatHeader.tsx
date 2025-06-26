import type React from "react"
import { Button } from "../ui/button"
import { IoVideocam } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { ArrowLeft } from "lucide-react";
import { useContactInfo } from "@/store/zustandStore";

const ChatHeader: React.FC<{
  avatar: string;
  isActive: boolean;
  username: string;
  setBackToUserList: (value: boolean) => void;
}> = ({ avatar, isActive, username, setBackToUserList }) => {
  const { setContactInfo } = useContactInfo();
  const BackToUserList = () => {
    setBackToUserList(true);
  };
  return (
    <div className="bg-white h-15 dark:bg-slate-600 flex justify-between items-center px-5 py-1">
      <div className="flex gap-3 items-center">
          <ArrowLeft className="min-[800px]:hidden" onClick={BackToUserList}/>
          <img onClick={() => setContactInfo(true)} className=" cursor-pointer w-10 h-10 rounded-full" src={avatar} alt="user avatar" />
          <div>
            <p onClick={() => setContactInfo(true)} className="cursor-pointer font-semibold max-[400px]:w-30 line-clamp-1">{username}</p>
            <p className="text-slate-400 text-sm">{isActive ? 'online': 'offline'}</p>
          </div>
      </div>
      <div className="flex items-center">
        <Button className="!p-3 cursor-pointer !bg-transparent text-black shadow-none"><IoVideocam className="text-slate-400" /></Button>
        <Button className="!p-2 cursor-pointer !bg-transparent text-black shadow-none"><FaPhoneAlt className="text-slate-400" /></Button>
        <Button onClick={() => setContactInfo(true)} className="!p-2 cursor-pointer !bg-transparent text-black shadow-none"><BsThreeDots className="text-slate-400" style={{ width: "22px", height: "22px" }}  /></Button>
      </div>
    </div>
  )
}

export default ChatHeader
