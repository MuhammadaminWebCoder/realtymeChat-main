import { useState } from "react";
import { auth, googleProvider, appleProvider } from "@/firebase";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { AppleIcon, Github } from "lucide-react";
import { Link } from "react-router-dom";
import type { UserDataType } from "@/types/userLoginData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { writeUserToDB } from "@/services/writeUserToDB";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")
 

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        const accessToken = await user.getIdToken();
        const userData:UserDataType = {
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          displayName: user.displayName,
          username:username
        }
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("accessToken", accessToken);
        await writeUserToDB(userData);
        
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        const accessToken = await user.getIdToken();
        const userData:UserDataType = {
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          displayName: user.displayName,
          username:username
        }
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userData", JSON.stringify(userData));
        await writeUserToDB(userData);

      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  const handleProviderLogin = async (provider: "google" | "apple") => {
    let prov;
    if (provider === "google") prov = googleProvider;
    if (provider === "apple") prov = appleProvider;
    try {
      const result = await signInWithPopup(auth, prov!);
      const user = result.user;
        const accessToken = await user.getIdToken();
        const userData:UserDataType = {
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          displayName: user.displayName,
          username:username
        }
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userData", JSON.stringify(userData));
    } catch (err) {
      console.error("Provider login error:", err);
    }
  };

  return (
    <div className="Login flex items-center justify-center w-full py-12 px-4 min-h-[100vh]">
      <div className="w-[400px] text-white gap-4 h-fit backdrop-blur-xs bg-white/10 p-4 rounded-xl">
        <form className="flex flex-col gap-3" onSubmit={handleEmailAuth}>
          <h1 className="text-center text-4xl mb-2 font-semibold">{isLogin ? "Log In" : "Register"}</h1>
          {!isLogin  && <Input
            aria-label="Username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />}
          <Input
            aria-label="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            aria-label="Password"
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
              {isLogin ? "Register" : "Login"}
            </button>
            <span>OR</span>
            <Link className="text-blue-500 underline" to={"/"}>
              Forgot Password ishlamaydi
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleProviderLogin("google")}
              className="!bg-black"
            >
              <Github className="me-1" /> Google
            </Button>
            <Button
              onClick={() => handleProviderLogin("apple")}
              className="!bg-white !text-black"
            >
              <AppleIcon className="me-1" /> Apple
            </Button>
          </div>

          <Button type="submit" className="!w-full">
            {isLogin ? "Sign in" : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
