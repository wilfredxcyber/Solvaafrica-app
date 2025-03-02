import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { View, StyleSheet } from "react-native";

import { hscale, mscale, wscale } from "../../helpers/metric";
import PrimaryButton from "../../components/primaryButton";
import { useAuthStore } from "../../stores/authStore";
import AvatarView from "../../components/avatarView";
import { globalStyles } from "../../styles/global";
import { colors } from "../../constants/theme";


interface IUserProfile {
    fullName: string | null,
    email: string | null,
    phone: string | null,
    gender: string | null,
    address: string | null,
}

export default function Profile() {

    const userState = useAuthStore(state => state.user)
    const { address, gender, phone, email, fullName } = userState.data;

    const [stateChange, setStateChange] = useState<boolean>(false)


    type TFormLabel = 'Fullname' | 'Email' | 'Phone' | 'Gender' | 'Address'

    useFocusEffect(useCallback(() => {
        console.log('Hello')
    }, []))

    // const handleOnChangeText = (text: string, label: TFormLabel) => {

    //     if (label === 'Fullname') {
    //         setUserProfile(prev => {
    //             return { ...prev, fullName: text ? text : null }
    //         })
    //     }

    //     if (label === 'Email') {
    //         setUserProfile(prev => {
    //             return { ...prev, email: text ? text : null }
    //         })
    //     }

    //     if (label === 'Phone') {
    //         setUserProfile(prev => {
    //             return { ...prev, phone: text ? text : null }
    //         })
    //     }

    //     if (label === 'Address') {

    //         setUserProfile(prev => {
    //             return { ...prev, address: text ? text : null }
    //         })
    //     }

    // }

    return (
        <View style={globalStyles.screen}>
            <View style={{ marginHorizontal: 'auto' }}>
                <AvatarView />
            </View>
            {/* inputs */}
            <View style={styles.inputFieldViewWrap}>
                <TextInput
                    value={fullName ?? undefined}
                    style={styles.inputFieldView}
                    placeholder="Full name"
                    placeholderTextColor={colors.placeholderInput}
                />
                <TextInput
                    value={email ?? undefined}
                    style={styles.inputFieldView}
                    placeholder="Email address"
                    placeholderTextColor={colors.placeholderInput}
                />
                <TextInput
                    value={phone ?? undefined}
                    style={styles.inputFieldView}
                    placeholder="Phone number"
                    placeholderTextColor={colors.placeholderInput}
                />
                <TextInput
                    value={address ?? undefined}
                    style={styles.inputFieldView}
                    placeholder="Residential address"
                    placeholderTextColor={colors.placeholderInput}
                />
            </View>
            {stateChange ? <PrimaryButton text="Update profile" onPress={() => console.log('Update profile')} /> : null}
        </View>
    )
}


const styles = StyleSheet.create({
    inputFieldView: { backgroundColor: colors.inputField, height: hscale(60), paddingHorizontal: wscale(32), borderRadius: mscale(30), fontFamily: 'Inter-Medium', color: colors.black },
    inputFieldViewWrap: { gap: hscale(20), marginTop: hscale(40) }
})