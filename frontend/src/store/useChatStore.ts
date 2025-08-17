import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

type Message ={
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    image: string;
    createdAt: string;
};

type NewMessage ={
    text: string;
    image: string| null
}

export type User = {
    _id: string;
    email: string;
    fullName: string;
    profilePic: string;
};

type ChatStore = {
    messages: Message[];
    users: User[];
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    getMessages: (userId: string) => void;
    sendMessage: (messageData: NewMessage) => Promise<void>;
    setSelectedUser: (selectedUser: User | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/message/users');
            set({ users: res.data});
        } catch (error: any) {
            console.log('Error in getUsers: ', error);
            toast.error(error.response?.data.error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });
        } catch (error: any) {
            console.log(error.response?.data.error);
            toast.error(error.response?.data.error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser?._id}`, messageData);
            set({messages: [...messages, res.data]});
        } catch (error: any) {
            console.log('Error in sendMessage: ', error);
            toast.error(error.response?.data.error)
        }
    },

    // todo: optimize this one later
    setSelectedUser: (selectedUser) => set({ selectedUser }),
    
}))

