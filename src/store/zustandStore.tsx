// store/useContactInfo.ts
import { create } from 'zustand';

export interface User {
  uid: string;
  username: string;
  email?: string;
  userAvatar?: string;
  message?: string;
  dateTyme?: string;
  isActive?: boolean;
  isSeeCount?: number;
}

type ContactInfoStore = {
  contactInfo: boolean;
  messageList:boolean;
  userChatOpen:string | null;
  setUserChatOpen:(value:string|null) => void;
  setMessageList:(value:boolean) => void;
  setContactInfo: (value: boolean) => void;
  users: User[];
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
  setReceiverInfo: (value) => set({receiverInfo:value}),
  setUsers:(value) => set({users:value}),
  setUserChatOpen:(value) => set({userChatOpen:value}),
  setMessageList: (value) => set({messageList:value}),
  setContactInfo: (value) => set({ contactInfo: value }),
}));
