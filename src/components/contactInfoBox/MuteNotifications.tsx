import React, { useEffect, useState } from "react";
import { Switch } from "../ui/switch";

const MuteNotifications: React.FC<{ messageIsEnable: string }> = ({ messageIsEnable }) => {
  const [isChecked, setIsChecked] = useState(true);
  const [isThemeMode, setIsThemeMode] = useState(() => {
    // Avval localStoragedan tekshir
    return localStorage.getItem("prefers-color-scheme") === "dark";
  });

  // Tema o‘zgarganda <html>ga class qo‘shish
  useEffect(() => {
    const root = document.documentElement;

    if (isThemeMode) {
      root.classList.add("dark");
      localStorage.setItem("prefers-color-scheme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("prefers-color-scheme", "light");
    }
  }, [isThemeMode]);

  return (
    <div className="space-y-1 px-5">
      <div className="flex items-center cursor-pointer justify-between">
        <p className="font-semibold text-sm">Mute Notification</p>
        <Switch className="cursor-pointer" checked={isChecked} onCheckedChange={setIsChecked} />
      </div>
      <div className="flex items-center cursor-pointer justify-between">
        <p className="font-semibold text-sm">Theme {isThemeMode ? "Dark" : "Light"} Mode</p>
        <Switch className="cursor-pointer" checked={isThemeMode} onCheckedChange={setIsThemeMode} />
      </div>
      <div>
        <p className="font-semibold text-sm">Disable Message</p>
        <p className="text-slate-400">{messageIsEnable}</p>
      </div>
    </div>
  );
};

export default MuteNotifications;
