import { fetchAllUsers } from "@/services/userService";
import { useContactInfo, type User } from "@/store/zustandStore";
import React, { useEffect, useState } from "react";

const ChatListItem: React.FC<{ search: string }> = ({ search }) => {
  const { setUserChatOpen, setUsers, users } = useContactInfo();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const userDataString = localStorage.getItem("userData");
  const currentUser = userDataString ? JSON.parse(userDataString) : null;
  const currentUserId = currentUser?.uid ?? null;

  // 👤 Barcha userlarni olish
  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchAllUsers();
      const withoutCurrentUser = fetchedUsers.filter(
        (u) => u.uid !== currentUserId
      );
      setAllUsers(withoutCurrentUser);
      setUsers(withoutCurrentUser); // default holat
    };

    if (currentUserId) {
      loadUsers();
    }
  }, [currentUserId, setUsers]);

  // 🔍 Search ishlovchi effekt
  useEffect(() => {
    setLoading(true);

    const delay = setTimeout(() => {
      if (search.trim() === "") {
        // 🔁 search bo‘sh bo‘lsa, faqat currentUserdan tashqari hammasi
        const filtered = allUsers.filter((u) => u.uid !== currentUserId);
        setUsers(filtered);
      } else {
        const filtered = allUsers.filter((u) =>
          u.username?.toLowerCase().includes(search.toLowerCase())
        );
        setUsers(filtered);
      }

      setLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [search, allUsers, currentUserId, setUsers]);

  return (
    <div className="w-full overflow-auto">
      <div className="pe-3">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : users.length > 0 ? (
          users.map((item: User, index: number) => (
            <div
              key={item.uid || index}
              onClick={() => setUserChatOpen(item.uid)}
              className="flex cursor-pointer my-1 rounded-sm py-2 gap-2 items-center hover:bg-slate-100"
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
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{item.username || "Username"}</p>
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
                    item.isSeeCount
                      ? "text-black font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  {item.message || "Say hi!"}
                </p>
              </div>
            </div>
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
