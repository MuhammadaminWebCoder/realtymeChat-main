import { useState } from "react";
import { auth, storage, googleProvider, appleProvider } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, AppleIcon } from "lucide-react";
import { writeUserToDB } from "@/services/writeUserToDB";
import { setUserOnlineStatus } from "@/services/onlineStatus";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-439DWYBIlMKtzkqbQqBpg9YNVgT13pkhCoPXmad5lg3Dk0mdmBLPlPGLUYQhF73sNH4&usqp=CAU";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const validate = () => {
    if (!email.includes("@")) return "Email noto‘g‘ri!";
    if (password.length < 6) return "Parol 6 belgidan kam bo‘lmasligi kerak!";
    if (!isLogin && username.trim().length < 3) return "Username kamida 3ta belgi bo‘lishi kerak!";
    return null;
  };

  const uploadImage = async (uid: string): Promise<string> => {
    if (!file) return DEFAULT_IMAGE;

    const imgRef = storageRef(storage, `users/${uid}/avatar.jpg`);
    await uploadBytes(imgRef, file);
    return await getDownloadURL(imgRef);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    try {
      let user;
      let finalPhotoURL = DEFAULT_IMAGE;

      if (isLogin) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        user = res.user;
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        user = res.user;

        finalPhotoURL = await uploadImage(user.uid);
        await updateProfile(user, {
          displayName: username,
          photoURL: finalPhotoURL,
        });
      }

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName ?? username,
        photoURL: user.photoURL ?? finalPhotoURL,
        username: username || user.displayName || "NoName",
      };

      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("accessToken", await user.getIdToken());

      await writeUserToDB(userData);
      setUserOnlineStatus();
      toast.success(`Xush kelibsiz, ${userData.displayName}`);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.code === "auth/email-already-in-use"
          ? "Bu email allaqachon ro‘yxatdan o‘tgan"
          : err.message || "Xatolik yuz berdi"
      );
    }
  };

  const handleProviderLogin = async (provider: "google" | "apple") => {
    let prov;
    if (provider === "google") prov = googleProvider;
    if (provider === "apple") prov = appleProvider;

    try {
      const result = await signInWithPopup(auth, prov!);
      const user = result.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName ?? "Foydalanuvchi",
        photoURL: user.photoURL ?? DEFAULT_IMAGE,
        username: user.displayName ?? "Foydalanuvchi",
      };

      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("accessToken", await user.getIdToken());

      await writeUserToDB(userData);
      setUserOnlineStatus();
      toast.success(`Xush kelibsiz, ${userData.displayName}`);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Provider login error:", err);
      toast.error(err.message || "Kirishda xatolik");
    }
  };

  return (
    <div className="Login flex items-center justify-center w-full py-12 px-4 min-h-[100vh]">
      <div className="w-[400px] text-white gap-4 h-fit backdrop-blur-xs bg-white/10 p-4 rounded-xl">
        <form className="flex flex-col gap-3" onSubmit={handleEmailAuth}>
          <h1 className="text-center text-4xl mb-2 font-semibold">
            {isLogin ? "Log In" : "Register"}
          </h1>

          {!isLogin && (
            <>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </>
          )}

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 cursor-pointer underline"
            >
              {isLogin ? "Ro‘yxatdan o‘tish" : "Kirish"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              onClick={() => handleProviderLogin("google")}
              className="!bg-black"
            >
              <Github className="me-1" /> Google
            </Button>
            <Button
              type="button"
              onClick={() => handleProviderLogin("apple")}
              className="!bg-white !text-black"
            >
              <AppleIcon className="me-1" /> Apple
            </Button>
          </div>

          <Button type="submit" className="!w-full">
            {isLogin ? "Kirish" : "Ro‘yxatdan o‘tish"}
          </Button>
        </form>
      </div>
    </div>
  );
}
