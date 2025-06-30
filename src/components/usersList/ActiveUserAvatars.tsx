import { EllipsisVertical } from "lucide-react";
import { useContactInfo, type User } from "@/store/zustandStore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { auth, storage } from "@/firebase"; // Firebase storage
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { signOut } from "firebase/auth";

const ActiveUserAvatars = () => {
  const { users, currentUser, setCurrentUser, setUserChatOpen } = useContactInfo();
  const [chooceImage, setChooseImage] = useState<string>(""); // preview uchun
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // upload uchun

  // Faqat bir marta userni olish
  useEffect(() => {
    setChooseImage(
      currentUser?.photoURL ||
        currentUser?.userAvatar ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-439DWYBIlMKtzkqbQqBpg9YNVgT13pkhCoPXmad5lg3Dk0mdmBLPlPGLUYQhF73sNH4&usqp=CAU"
    );
  }, [currentUser]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setChooseImage(imageUrl);
      setSelectedFile(file);
    }
  };

 const HandleModalEdite = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("Form submitted");

  try {
    if (selectedFile && currentUser) {
      console.log("Uploading avatar...");
      const avatarRef = ref(storage, `avatars/${currentUser.uid}`);
      await uploadBytes(avatarRef, selectedFile);
      const photoURL = await getDownloadURL(avatarRef);

      console.log("Uploaded photoURL:", photoURL);

      // 🔄 Istasangiz bu yerda Realtime DB update yoziladi

      toast.success("Avatar uploaded successfully!");
    } else {
      console.log("File not selected or no current user");
      toast.info("Avatar o'zgartirilmagan.");
    }
  } catch (err) {
    console.error(err);
    toast.error("Avatarni yuklashda xatolik yuz berdi.");
  }
};


const handleLogout = async () => {
  try {
    await signOut(auth); // ❗️ Firebase sessiyasini tozalaydi

    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");

    const { setCurrentUser, setIsUserLoaded } = useContactInfo.getState();
    setCurrentUser(null);
    setIsUserLoaded(false);

    toast.success("Chiqildi. Redirecting...");
    setTimeout(() => {
      location.reload();
    }, 700);
  } catch (err) {
    console.error("Logout failed:", err);
    toast.error("Chiqishda xatolik yuz berdi.");
  }
};

  const activeUsers = users.filter((u) => u.isActive && u.uid !== currentUser?.uid);

  return (
    <div className="w-full px-5">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-lg">Active Users</p>
        <Dialog>
            <DialogTrigger asChild>
              <EllipsisVertical className="text-green-500 cursor-pointer" />
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] dark:bg-slate-600">
              <form onSubmit={HandleModalEdite}>
              <DialogHeader>
                <DialogTitle className="text-center">Edit profile & Log out</DialogTitle>
                <DialogDescription className="text-center">
                  Profile Edite be confirm
                </DialogDescription>
              </DialogHeader>

              {/* Avatar */}
              <div className="rounded-full mx-auto w-24 h-24 overflow-hidden">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <img
                    src={chooceImage}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </label>
              </div>

              {/* Form fields */}
              <div className="grid gap-4 mt-4">
                <div className="grid gap-3">
                  <Input
                    id="name-1"
                    name="name"
                    placeholder="username"
                    defaultValue={currentUser?.displayName || currentUser?.username}
                  />
                </div>
                <div className="grid">
                  <Textarea
                    id="bio"
                    className="!h-[140px]"
                    maxLength={160}
                    name="bio"
                    placeholder="bio"
                    defaultValue={currentUser?.aboutBio || ""}
                  />
                  <p className="text-slate-600 text-sm text-end">max bio length 160</p>
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="flex flex-row-reverse max-[455px]:flex-col-reverse w-full !justify-between">
                <div className="max-sm:order-2">
                  <Button
                    type="button"
                    className="!bg-red-500 cursor-pointer w-full dark:text-white"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </div>
                <div className="flex max-[455px]:flex-col max-sm:order-1 gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button className="dark:bg-green-500 dark:text-white" type="submit">
                    Save changes
                  </Button>
                </div>
              </DialogFooter>
            </form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 overflow-x-auto max-w-full py-2">
        {activeUsers.length > 0 ? (
          activeUsers.map((user: User, index: number) => (
            <div
              key={user.uid || index}
              className="relative rounded-full w-10 h-10 cursor-pointer shrink-0"
              onClick={() => setUserChatOpen(user.uid)}
              title={user.username || user.displayName || "User"}
            >
              <img
                className="rounded-full w-full h-full object-cover"
                src={
                  user.photoURL ||
                  user.userAvatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-439DWYBIlMKtzkqbQqBpg9YNVgT13pkhCoPXmad5lg3Dk0mdmBLPlPGLUYQhF73sNH4&usqp=CAU"
                }
                alt="user avatar"
              />
              <span className="border w-3 h-3 rounded-full bg-green-500 absolute right-0 bottom-0"></span>
            </div>
          ))
        ) : (
          <p className="font-semibold text-md text-slate-400">No Active Users</p>
        )}
      </div>
    </div>
  );
};

export default ActiveUserAvatars;
