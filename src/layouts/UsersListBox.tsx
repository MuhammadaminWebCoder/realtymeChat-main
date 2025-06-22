import { Button } from "@/components/ui/button"
import ActiveUserAvatars from "@/components/usersList/ActiveUserAvatars"
import ChatListItem from "@/components/usersList/ChatListItem"
import SearchInput from "@/components/usersList/SearchInput"
import { Plus } from "lucide-react"
import { useState } from "react"

const UsersListBox = () => {
  const [search,setSearch] = useState('')
  return (
    <div className="rounded-md flex dark:!bg-slate-600 flex-col relative h-full py-5 w-[360px] border max-[800px]:w-full border-slate-100 dark:border-none">
      <ActiveUserAvatars />
      <SearchInput search={search} setSearch={setSearch}/>
      <p className="font-semibold px-5 text-md mb-2">ALL CHATS</p>
      <ChatListItem search={search}/>
      <div className="absolute right-10 bottom-10">
        <Button className="cursor-pointer !bg-blue-500 sticky right-10 bottom-10 "><Plus/></Button>
      </div>
    </div>
  )
}

export default UsersListBox
