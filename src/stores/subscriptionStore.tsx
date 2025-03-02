import { create } from 'zustand';


interface IUserSubscriptionStore { isSubscribed: boolean }

export const useUserSubscriptionStore = create<IUserSubscriptionStore>(() => ({
    isSubscribed: false
}))