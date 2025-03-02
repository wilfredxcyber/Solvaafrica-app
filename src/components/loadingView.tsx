import { View, StyleSheet, ActivityIndicator } from "react-native";

import { colors } from "../constants/theme";


export default function LoadingView({ isLoading }: { isLoading: boolean }) {
    return isLoading ? <View style={styles.loadingView}><ActivityIndicator color={colors.primary} size={'large'} /></View> : null
}

const styles = StyleSheet.create({
    loadingView: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        marginHorizontal: 'auto',
        left: 0,
        right: 0,
        height: '100%',
        justifyContent: 'center',
        zIndex: 9900
    }
})