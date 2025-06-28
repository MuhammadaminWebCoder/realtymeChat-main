import { subscribeToUsers } from "@/services/userService";
import { subscribeToLastMessageAndCount } from "@/services/chatService";
import { useContactInfo, type User } from "@/store/zustandStore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ChatListItem: React.FC<{ search: string }> = ({ search }) => {
  const { setUserChatOpen, setUsers } = useContactInfo();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const currentUserId = currentUser?.uid ?? null;

  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribeUsers = subscribeToUsers((rawUsers) => {
      const filtered = rawUsers.filter((u) => u.uid !== currentUserId);

      // 👇 Har bir user uchun real-time message listener
      const updatedUsers = [...filtered];

      updatedUsers.forEach((user, index) => {
        const chatId = [currentUserId, user.uid].sort().join("_");

        subscribeToLastMessageAndCount(chatId, currentUserId, (data) => {
          updatedUsers[index] = {
            ...user,
            ...data,
          };
          setUsers([...updatedUsers]);
          setAllUsers([...updatedUsers]);
        });
      });
    });

    return () => {
      unsubscribeUsers(); // 🔁 cleanup on unmount
    };
  }, [currentUserId]);

  // 🔍 Search
  useEffect(() => {
    setLoading(true);
    const delay = setTimeout(() => {
      const filtered =
        search.trim() === ""
          ? allUsers
          : allUsers.filter((u) =>
              u.username?.toLowerCase().includes(search.toLowerCase())
            );
      setUsers(filtered);
      setLoading(false);
    }, 300);
    return () => clearTimeout(delay);
  }, [search, allUsers, setUsers]);

  return (
    <div className="w-full overflow-auto">
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : allUsers.length > 0 ? (
          allUsers.map((item, index) => (
            <Link
              to={`/chat/${item.uid}`}
              key={item.uid || index}
              onClick={() => setUserChatOpen(item.uid)}
              className="flex cursor-pointer my-1 py-2 gap-2 px-5 items-center dark:hover:bg-slate-700 hover:bg-slate-100"
            >
              <div className="relative rounded-full w-10 h-10">
                <img
                  className="rounded-full w-full h-full object-cover"
                  src={
                    item.userAvatar ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-439DWYBIlMKtzkqbQqBpg9YNVgT13pkhCoPXmad5lg3Dk0mdmBLPlPGLUYQhF73sNH4&usqp=CAU"
                  }
                  alt="user avatar"
                />
                {item.isActive && (
                  <span className="border w-3 h-3 rounded-full bg-green-500 absolute right-0 bottom-0"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold truncate">
                    {item.username || "Username"}
                  </p>
                  <div className="flex items-center gap-1">
                    {item.isSeeCount && (
                      <p className="text-[12px] text-white px-2 rounded-full bg-green-500">
                        {item.isSeeCount}
                      </p>
                    )}
                    <p className="text-slate-400 text-sm">{item.dateTyme}</p>
                  </div>
                </div>
                <p
                  className={`truncate text-sm ${
                    item.isSeeCount
                      ? "text-black font-semibold dark:text-white"
                      : "text-slate-400"
                  }`}
                >
                  {item.message || "no last message"}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-400 text-sm italic px-2 py-3">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatListItem;
