import type React from "react"
import { Switch } from "../ui/switch"
import { useState } from "react";

const MuteNotifications:React.FC<{messageIsEnable:string}> = ({messageIsEnable}) => {
  const [isChecked, setIsChecked] = useState(true);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between"><p className="font-semibold text-sm">Mute Notification</p> <Switch checked={isChecked} onCheckedChange={setIsChecked} /></div>
      <div className="flex items-center justify-between"><p className="font-semibold text-sm">Theme Dark Mode</p> <Switch/></div>
      <div><p className="font-semibold text-sm">Dissable Message</p> <p className="text-slate-400">{messageIsEnable}</p></div>
    </div>
  )
}

export default MuteNotifications
