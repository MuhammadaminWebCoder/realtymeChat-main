import type React from "react";
import { Button } from "../ui/button"
import { IoVideocam } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import type { MediaLinksType } from "@/types/ContactInfoType";

const MediaLinks:React.FC<{mediaData:MediaLinksType}> = ({mediaData}) => {

  return (
    <div className="mb-4 px-5">
      <div className="w-25 overflow-hidden mt-7 mb-2 rounded-full mx-auto h-25"><img className="object-cover w-full h-full" src={mediaData?.avatarImg} alt="user more avatar" /></div>
      <p className="text-xl text-center my-1 font-semibold">{mediaData?.username || 'Username not found'}</p>
      <p className="text-sm text-center text-slate-400">{mediaData?.isactive ? 'Online' : 'Offline'}</p>
      <div className="flex gap-2 my-4 items-center justify-center">
        <Button className="!w-10 rounded-full text-slate-400 bg-slate-200 !h-10"><IoVideocam /></Button>
        <Button className="!w-10 rounded-full text-slate-400 bg-slate-200 !h-10"><IoCall /></Button>
      </div>
      <div className="About">
          <p className="font-semibold text-sm">About</p>
          <p className="text-slate-400 mb-1 w-[80%] text-sm line-clamp-1">{mediaData?.aboutBio || 'About not found'}</p>

          <p className="font-semibold text-sm">Media, Links and doc</p>
          <div className="gap-2 flex  mt-2">
            {mediaData?.mediaPhoto ? mediaData?.mediaPhoto?.splice(0,4).map((item:string,ind:number) => (
              <img className="rounded-md max-[500px]:w-20  max-[500px]:h-20 w-30 h-30" key={ind} src={item} alt="media more" />
            )) : 'media not found'}
          </div>
      </div>
    </div>
  )
}

export default MediaLinks
