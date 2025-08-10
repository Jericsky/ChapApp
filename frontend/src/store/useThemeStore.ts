import { create } from "zustand";

type ThemeStore = {
    theme: string,
    setTheme: (theme: string) => void,
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: localStorage.getItem('chat-theme') || 'light',
    setTheme: (theme) => {
        console.log('Theme changed to:', theme);
        localStorage.setItem('chat-theme', theme);
        set({ theme });
    }
}));