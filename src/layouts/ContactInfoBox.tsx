import ActionButtons from "@/components/contactInfoBox/ActionButtons"
import MediaLinks from "@/components/contactInfoBox/MediaLinks"
import MuteNotifications from "@/components/contactInfoBox/MuteNotifications"
import ProfileHeader from "@/components/contactInfoBox/ProfileHeader"
import { useContactInfo } from "@/store/zustandStore"
import type React from "react"


const ContactInfoBox:React.FC<{currentUser:any}> = ({currentUser}) => {
  const {contactInfo,setContactInfo} = useContactInfo()
  const profileInfoClose = () => {
    setContactInfo(false)
  }
  const blockUser = () => {
    // blocked user id kelsa shu id ga block fn berib qoyiladi blockuser(id)
  }
  const reportUser = () => {
    // blocked user id kelsa shu id ga block fn berib qoyiladi blockuser(id)
  }
  const deleteChat = () => {
    // blocked user id kelsa shu id ga block fn berib qoyiladi blockuser(id)
  }
  const mediaData = {
    avatarImg:'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg',
    username:currentUser?.username,
    isactive:false,
    aboutBio:'Hi evreone Body builders Hi evreone',
    mediaPhoto:[
      'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg',
      'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg',
      'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg',
      'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg',
      'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg',
      'https://themost.com.tr/wp-content/uploads/2023/04/tm-men1_0000_Evansite95-2.jpg',
    ]
  }

  return (
    <div className={`rounded-md ${contactInfo ? '!block' : 'hidden'} max-[500px]:w-full max-[500px]:h-full max-[1200px]:absolute  max-[1200px]:-translate-1/2 left-[50%] top-[50%] max-[1200px]:hidden p-5 border w-[320px] border-slate-100`}>
      <ProfileHeader ProfileInfoClose={profileInfoClose} />
        <div className="w-full h-[500px] pe-2 overflow-auto">
        <MediaLinks mediaData={mediaData} />
        <MuteNotifications messageIsEnable={'off'} />
          <ActionButtons username={mediaData.username} BlockUser={blockUser} reportUser={reportUser} deleteChat={deleteChat}  />
      </div>
    </div>
  )
}

export default ContactInfoBox
