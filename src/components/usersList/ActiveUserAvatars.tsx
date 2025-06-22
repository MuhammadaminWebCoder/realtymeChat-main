import { EllipsisVertical } from "lucide-react";
import { useContactInfo } from "@/store/zustandStore";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "react-toastify";
import { useState } from "react";

const ActiveUserAvatars = () => {
  const { users, setUserChatOpen } = useContactInfo();

  // 🔍 faqat online bo‘lgan userlarni olish (va o'zingizni olib tashlash)
  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const activeUsers = users.filter(
    (u) => u.isActive && u.uid !== currentUser.uid
  );
  const HandleModalEdite = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success(`Profile edite be confirm to user ${currentUser.displayName}`);
  }
  const [chooceImage, setChooseImage] = useState<string>("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-439DWYBIlMKtzkqbQqBpg9YNVgT13pkhCoPXmad5lg3Dk0mdmBLPlPGLUYQhF73sNH4&usqp=CAU")
  
  return (
    <div className="w-full px-5">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-lg">Active Users</p>
        <Dialog>
          <form onSubmit={HandleModalEdite}>
            <DialogTrigger asChild>
        <EllipsisVertical className="text-green-500 cursor-pointer" />
        </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] dark:bg-slate-600  ">
          <DialogHeader>
            <DialogTitle className="text-center">Edit profile & Log out</DialogTitle>
            <DialogDescription className="text-center">
              Profile Edite be confirm
            </DialogDescription>
          </DialogHeader>
              <div className="rounded-full mx-auto w-25 h-25 overflow-hidden">
                <input accept="image/*" type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);setChooseImage(imageUrl);
                    }}}></input>
                    <label className="cursor-pointer" htmlFor="file-upload">
                      <img src={chooceImage} className="w-full h-full object-cover rounded-full" alt="avatar" />
                    </label>
              </div>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input id="name-1" name="name" placeholder="username" defaultValue={"Pedro Duarte"} />
            </div>
            <div className="grid">
              <Textarea id="username-1" className="!h-[140px]" maxLength={160} name="username" placeholder="bio" defaultValue={'Frontend developer'} />
              <p className="text-slate-600 text-sm text-end">max bio lenght 160</p>
            </div>
          </div>
         <DialogFooter className="flex w-full !justify-between">
  {/* Chap tomonda: Log out */}
  <div>
    <Button type="button" className="bg-red-500" onClick={() => {
          localStorage.removeItem("userData");
          location.reload(); // yoki navigate("/login")
        }}>Log out Tokken</Button>
  </div>

  {/* O‘ng tomonda: Cancel va Save changes */}
  <div className="flex gap-2">
    <DialogClose asChild>
      <Button variant="outline">Cancel</Button>
    </DialogClose>
    <Button className="dark:bg-green-500" type="submit">Save changes</Button>
  </div>
</DialogFooter>
        </DialogContent>
      </form>
          

        </Dialog>
      </div>

      <div className="flex gap-4 overflow-x-auto max-w-full py-2">
        {activeUsers.length > 0 ? (
          activeUsers.map((user, index) => (
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
