import { create } from "zustand";

interface InputStore {
  text: string;
  setText: (value: string) => void;
  handleSend: () => void;
}

export const useInputStore = create<InputStore>((set) => ({
  text: "",
  setText: (value) => set({ text: value }),
  handleSend: () => {
    console.log("Xabar jo‘natildi:", "bu yerda `text` yoki serverga yuborish ishlari bo‘ladi");
    set({ text: "" });
  },
}));
