import { X } from "lucide-react"
import type React from "react"

const ProfileHeader:React.FC<{ProfileInfoClose:()=> void}> = ({ProfileInfoClose}) => {
  return (
    <div className="flex items-center text-lg font-semibold">
      <X onClick={ProfileInfoClose} className="text-slate-400 cursor-pointer me-2" /> <p>Contact info</p>
    </div>
  )
}

export default ProfileHeader
