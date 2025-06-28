// store/useContactInfo.ts
import { create } from 'zustand';

export interface User {
  uid: string;
  username: string;
  email?: string;
  userAvatar?: string;
  displayName?: string;
  photoURL?: string;
  message?: string;
  dateTyme?: string;
  isActive: boolean;
  isSeeCount?: number| null | undefined;
  aboutBio?: string;
}

type ContactInfoStore = {
  contactInfo: boolean;
  messageList:boolean;
  userChatOpen:string | null;
  setUserChatOpen:(value:string|null) => void;
  setMessageList:(value:boolean) => void;
  lastMessages: Record<string, any>; // chatId bo‘yicha
  setLastMessage: (chatId: string, message: any) => void;
  clearLastMessages: () => void;
  setContactInfo: (value: boolean) => void;
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  receiverInfo: { uid: string; name: string } | null;
  setReceiverInfo: (info: { uid: string; name: string } | null) => void;
};

export const useContactInfo = create<ContactInfoStore>((set) => ({
  contactInfo: false,
  messageList:false,
  userChatOpen:null,
  users:[],
  receiverInfo:null,
  currentUser: null,
  lastMessages: {},
  setCurrentUser: (value) => set({ currentUser: value }),
  setReceiverInfo: (value) => set({receiverInfo:value}),
  setUsers:(value) => set({users:value}),
  setUserChatOpen:(value) => set({userChatOpen:value}),
  setMessageList: (value) => set({messageList:value}),
  setContactInfo: (value) => set({ contactInfo: value }),
  setLastMessage: (chatId, message) =>
    set((state) => ({
      lastMessages: {
        ...state.lastMessages,
        [chatId]: message,
      },
    })),

  clearLastMessages: () => set({ lastMessages: {} }),
}));
