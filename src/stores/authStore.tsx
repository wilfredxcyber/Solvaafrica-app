import { create } from 'zustand';


interface IAuthStore {
    user: null | any,
    isLoading: boolean,
}

const useAuthStore = create<IAuthStore>((set) => ({
    user: null,
    isLoading: true,
}))


export { useAuthStore }