import { StyleSheet, Text, View } from "react-native";

import { hscale, mscale, wscale } from "../helpers/metric";
import { useAuthStore } from "../stores/authStore";
import { colors } from "../constants/theme";


export default function AvatarView() {

    const auth = useAuthStore(state => state.user)
    const { prefix } = auth.data;

    return (
        <View style={styles.avatarView}>
            <Text style={styles.avatarViewText}>{prefix.toUpperCase()}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    avatarView: { width: wscale(60), height: hscale(60), backgroundColor: colors.primary, borderRadius: mscale(30), justifyContent: 'center' },
    avatarViewText: { fontFamily: 'Inter-Bold', fontSize: mscale(14), color: '#ffffff', textAlign: 'center', textTransform: 'uppercase', }
})