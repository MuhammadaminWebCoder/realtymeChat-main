import { X } from "lucide-react"
import type React from "react"

const ProfileHeader:React.FC<{ProfileInfoClose:()=> void}> = ({ProfileInfoClose}) => {
  return (
    <div className="flex sticky bg-white dark:bg-slate-600 rounded-md -top-0 items-center text-lg font-semibold me-1 p-4">
      <X onClick={ProfileInfoClose} className="text-slate-400 cursor-pointer me-2" /> <p>Contact info</p>
    </div>
  )
}

export default ProfileHeader
