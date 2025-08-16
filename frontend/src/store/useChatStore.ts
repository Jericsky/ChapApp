import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

type Message ={
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
};

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
    setSelectedUser: (selectedUser: User) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
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

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error: any) {
            console.log(error.response?.data.error);
            toast.error(error.response?.data.error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    // todo: optimize this one later
    setSelectedUser: (selectedUser: User) => set({ selectedUser }),
}))

