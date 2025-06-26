import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Github,
  AppleIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import {
  auth,
  storage,
  googleProvider,
  appleProvider,
} from "@/firebase";
import { writeUserToDB } from "@/services/writeUserToDB";
import { setUserOnlineStatus } from "@/services/onlineStatus";
import { toast } from "react-toastify";
import { AnimatedSection } from "@/components/AnimatedSection";

const DEFAULT_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-439DWYBIlMKtzkqbQqBpg9YNVgT13pkhCoPXmad5lg3Dk0mdmBLPlPGLUYQhF73sNH4&usqp=CAU";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string; username?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.includes("@gmail.com")) newErrors.email = "Email noto‘g‘ri!";
    if (password.length < 6) newErrors.password = "Parol 6 belgidan kam bo‘lmasligi kerak!";
    if (!isLogin && username.trim().length < 3) newErrors.username = "Username kamida 3ta belgi bo‘lishi kerak!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (uid: string): Promise<string> => {
    if (!file) return DEFAULT_IMAGE;
    const imgRef = storageRef(storage, `users/${uid}/avatar.jpg`);
    await uploadBytes(imgRef, file);
    return await getDownloadURL(imgRef);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || loading) return;
    setLoading(true);

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
      setTimeout(() => location.reload(), 700);
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        // Auto-login bo‘lishini to‘xtatamiz:
        auth.currentUser?.delete(); // notog‘ri yaratilgan userni olib tashlash
      }
      const msg = mapAuthError(err.code);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (provider: "google" | "apple") => {
    if (loading) return;
    setLoading(true);
    const prov = provider === "google" ? googleProvider : appleProvider;

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
      setTimeout(() => location.reload(), 700);
    } catch (err: any) {
      const msg = mapAuthError(err.code);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const mapAuthError = (code: string): string => {
    switch (code) {
      case "auth/user-not-found":
        return "Bu emailga tegishli foydalanuvchi topilmadi.";
      case "auth/wrong-password":
        return "Parol noto‘g‘ri kiritilgan.";
      case "auth/email-already-in-use":
        return "Bu email allaqachon ro‘yxatdan o‘tgan.";
      case "auth/too-many-requests":
        return "Juda ko‘p urinish. Keyinroq qayta urinib ko‘ring.";
      case "auth/invalid-email":
        return "Email manzili noto‘g‘ri.";
      default:
        return "Kirishda xatolik yuz berdi.";
    }
  };

  const preview = file ? URL.createObjectURL(file) : DEFAULT_IMAGE;

  return (
    <div className="Login flex items-center justify-center w-full py-12 px-4 min-h-[100vh]">
      <AnimatedSection directions={["bottom"]} extraClass="w-[400px] text-white gap-4 h-fit backdrop-blur-xs bg-white/10 p-4 rounded-xl">
        <form className="flex flex-col" onSubmit={handleEmailAuth}>
          <h1 className="text-center text-4xl mb-4 font-semibold">
            {isLogin ? "Log In" : "Register"}
          </h1>

          {!isLogin && (
            <>
              <input
                className="hidden"
                type="file"
                id="fileUpload"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              />
              <label className="mx-auto cursor-pointer" htmlFor="fileUpload">
                <img className="w-20 h-20 rounded-full object-cover" src={preview} alt="upload preview" />
              </label>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`mt-2 ${errors.username ? "border-red-500" : ""}`}
              />
              {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username}</span>}
            </>
          )}

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-2 ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}

          <div className="relative mt-2">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${errors.password ? "border-red-500" : ""} pr-10`}
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
            </div>
          </div>
          {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}

          <div className="flex gap-3 justify-center mt-4">
            <button
              type="button"
              onClick={() => {
                setErrors({});
                setIsLogin(!isLogin);
              }}
              className="text-blue-500 cursor-pointer underline"
            >
              {isLogin ? "Ro‘yxatdan o‘tish" : "Kirish"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button type="button" onClick={() => handleProviderLogin("google")} className="!bg-black cursor-pointer">
              <Github className="me-1" /> Google
            </Button>
            <Button type="button" onClick={() => handleProviderLogin("apple")} className="!bg-white !text-black cursor-pointer">
              <AppleIcon className="me-1" /> Apple
            </Button>
          </div>

          <Button disabled={loading} type="submit" className="!w-full cursor-pointer mt-4">
            {loading ? "Iltimos kuting..." : isLogin ? "Kirish" : "Ro‘yxatdan o‘tish"}
          </Button>
        </form>
      </AnimatedSection>
    </div>
  );
}
