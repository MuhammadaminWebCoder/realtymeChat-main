import { AnimatedSection } from "@/components/AnimatedSection"
import ActionButtons from "@/components/contactInfoBox/ActionButtons"
import MediaLinks from "@/components/contactInfoBox/MediaLinks"
import MuteNotifications from "@/components/contactInfoBox/MuteNotifications"
import ProfileHeader from "@/components/contactInfoBox/ProfileHeader"
import { useContactInfo } from "@/store/zustandStore"
import { getDatabase, onValue, ref } from "firebase/database"
import type React from "react"
import { useEffect, useState } from "react"


const ContactInfoBox:React.FC<{currentUser:any}> = ({currentUser}) => {
  const {contactInfo,setContactInfo} = useContactInfo()
    const [isUserOnline, setIsUserOnline] = useState(false);
    const {userChatOpen} = useContactInfo()
  useEffect(() => {
    if (!userChatOpen) return;
  
    const db = getDatabase();
    const statusRef = ref(db, `users/${userChatOpen}/online`);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      setIsUserOnline(!!snapshot.val());
    });
  
    return () => unsubscribe();
  }, [userChatOpen]);
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
    avatarImg:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-439DWYBIlMKtzkqbQqBpg9YNVgT13pkhCoPXmad5lg3Dk0mdmBLPlPGLUYQhF73sNH4&usqp=CAU',
    username:currentUser?.username,
    isactive:isUserOnline,
    aboutBio:'',
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
    <AnimatedSection directions={['bottom']} extraStyle={{borderWidth:'0px'}} extraClass={`rounded-md ${contactInfo ? '!block' : 'hidden'} max-[800px]:absolute  left-0 top-0 max-[800px]:w-full dark:!bg-slate-600 flex-1 h-full flex flex-col  border max-[1200px]:w-[400px] border-slate-100`}>
      <div className="w-full overflow-auto h-full">
        <ProfileHeader ProfileInfoClose={profileInfoClose} />
        <MediaLinks mediaData={mediaData} />
        <MuteNotifications messageIsEnable={'off'} />
        <ActionButtons username={mediaData.username} BlockUser={blockUser} reportUser={reportUser} deleteChat={deleteChat}  />
      </div>
    </AnimatedSection>
  )
}

export default ContactInfoBox
