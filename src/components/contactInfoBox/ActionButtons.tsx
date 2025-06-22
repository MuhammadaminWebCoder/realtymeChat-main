import type React from "react";
import { AiOutlineStop } from "react-icons/ai";
import { BiDislike } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";

const ActionButtons:React.FC<{username:string,BlockUser:() => void,reportUser:() => void,deleteChat:() => void}> = ({username,BlockUser,reportUser,deleteChat}) => {
  return (
    <div className="my-4 px-5 rounded-md pb-5 text-red-500">
       <button className="flex items-center text-sm gap-2 py-1" onClick={BlockUser}><AiOutlineStop /> Block {username}</button>
       <button className="flex items-center text-sm gap-2 py-1" onClick={reportUser}><BiDislike /> Report {username}</button>
       <button className="flex items-center text-sm gap-2 py-1" onClick={deleteChat}><FaRegTrashAlt /> Delete Chat</button>
    </div>
  )
}

export default ActionButtons
