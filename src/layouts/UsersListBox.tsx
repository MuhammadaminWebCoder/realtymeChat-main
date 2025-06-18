import { Button } from "@/components/ui/button"
import ActiveUserAvatars from "@/components/usersList/ActiveUserAvatars"
import ChatListItem from "@/components/usersList/ChatListItem"
import SearchInput from "@/components/usersList/SearchInput"
import { Plus } from "lucide-react"

const UsersListBox = () => {
  return (
        <div className="rounded-md relative h-full p-5 w-[360px] border max-[800px]:w-full border-slate-100">
          <ActiveUserAvatars />
          <SearchInput/>
            <ChatListItem/>
      <div className="absolute right-10 bottom-10">
        <Button className="cursor-pointer !bg-blue-500 sticky right-10 bottom-10 "><Plus/></Button>
      </div>
    </div>
  )
}

export default UsersListBox
