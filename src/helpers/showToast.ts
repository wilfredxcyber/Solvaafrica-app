import Toast, { ToastType } from 'react-native-toast-message';
import { StyleSheet } from 'react-native';


export const showToast = (toastType: ToastType, title: 'error' | 'success', message: string) => {
    Toast.show({ type: toastType, text1: title, text2: message, text1Style: { fontFamily: 'Inter-Bold', }, text2Style: { fontFamily: 'Inter-regular' } })
}


