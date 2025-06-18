import { fetchAllUsers } from "@/services/userService";
import { useContactInfo, type User } from "@/store/zustandStore";
import { useEffect } from "react";

const ChatListItem = () => {
  const { setUserChatOpen, setUsers, users } = useContactInfo();

  const userDataString = localStorage.getItem("userData");
  const currentUser = userDataString ? JSON.parse(userDataString) : null;
  const currentUserId = currentUser?.uid ?? null;

  useEffect(() => {
  const loadUsers = async () => {
    const allUsers = await fetchAllUsers();

    const filtered = allUsers.filter((u) => u.uid !== currentUserId);

    setUsers(filtered);
  };

  loadUsers();
}, [currentUserId]);

  return (
    <div className="w-full h-full">
      <p className="font-semibold text-md">ALL CHATS</p>
      <div className="border !overflow-auto pe-3">
        {users?.map((item: User, index: number) => (
          <div
            key={item.uid || index}
            onClick={() => setUserChatOpen(item.uid)}
            className="flex cursor-pointer my-1 rounded-sm py-2 gap-2 items-center hover:bg-slate-100"
          >
            <div className="relative rounded-full w-10 h-10">
              <img
                className="rounded-full w-full h-full object-cover"
                src={item.userAvatar || "/default-avatar.png"}
                alt="user avatar"
              />
              {item.isActive && (
                <span className="border w-3 h-3 rounded-full bg-green-500 absolute right-0 bottom-0"></span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {item.username ||  "No Name"}
                </p>
                <div className="flex items-center">
                  {item.isSeeCount && (
                    <p className="w-fit text-[12px] text-white me-2 h-fit px-2 rounded-full bg-green-500">
                      {item.isSeeCount}
                    </p>
                  )}
                  <p className="text-slate-400 text-sm">{item.dateTyme || ""}</p>
                </div>
              </div>
              <p
                className={`line-clamp-1 text-sm ${
                  item.isSeeCount ? "text-black font-semibold" : "text-slate-400"
                }`}
              >
                {item.message || "Say hi!"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatListItem;
