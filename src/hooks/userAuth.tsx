import { useAuthStore } from "../stores/authStore";


const useUserSignedIn = () => {
    const signedInUser = useAuthStore(state => state.user)
    if (!signedInUser) return false;

    return true;
}

const useUserSignedOut = () => {
    const signedInUser = useAuthStore(state => state.user);
    if (!signedInUser) return true;

    return false
}

export { useUserSignedIn, useUserSignedOut }