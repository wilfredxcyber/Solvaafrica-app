import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuthStore } from "../stores/authStore";


const bootstrapApp = async () => {
    // check user in storage
    try {
        const serializedUser = await AsyncStorage.getItem('User');

        if (serializedUser) {
            const storedUser = JSON.parse(serializedUser);
            useAuthStore.setState(state => ({ ...state, user: storedUser }))
            return
        }

    } catch (error) {
        console.log('error getting user from storage', error)
    } finally {
        // set loading false
        useAuthStore.setState(state => ({ ...state, isLoading: false }))
    }
}

export { bootstrapApp }