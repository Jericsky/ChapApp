import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast';

type SignupData = {
    fullName: string;
    email: string;
    password: string;
};

type ProfileData = {
    profilePic: string | ArrayBuffer | null;
}

type AuthStore = {
    authUser: any; 
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    checkAuth: () => Promise<void>;
    signup: (data: SignupData) => Promise<void>; 
    login: (data: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: ProfileData) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get('/auth/check');
            console.log(res)

            set({ authUser: res.data })
        } catch (error) {
            console.log('Error in checkAuth: ', error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async(data: SignupData) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            console.log(res);
            set({ authUser: res.data });
            toast.success('Account successfully created.');

        } catch (error: any) {
            toast.error(error.response.data.error);
            console.log(error);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async(data: SignupData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

        } catch (error: any) {
            toast.error(error.response.data.error);
            console.log(error);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success('Logged out successfully');
        } catch (error: any) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    },

    updateProfile: async(data: ProfileData) => {
        try {
            const res = await axiosInstance.patch('/auth/update-profile', data);
            console.log(res);
            set({ authUser: res.data });
            toast.success('Profile pic updated successfully');
        } catch (error: any) {
            console.log('error in update profile: ', error);
            toast.error(error.message);
        } finally {
            set({ isUpdatingProfile: false })
        }
    }
}))