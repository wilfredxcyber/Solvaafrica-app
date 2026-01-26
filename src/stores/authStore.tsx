import { create } from 'zustand';

interface IAuthStore {
    user: null | any;
    isLoading: boolean;
    setUser: (user: any) => void;
    logout: () => void;
    setIsLoading: (isLoading: boolean) => void;
}

const useAuthStore = create<IAuthStore>((set) => ({
    user: null,
    isLoading: false, // Changed from true to false for now
    setUser: (user) => set({ user, isLoading: false }),
    logout: () => set({ user: null }),
    setIsLoading: (isLoading) => set({ isLoading }),
}));

export { useAuthStore };