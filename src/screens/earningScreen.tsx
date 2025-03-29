import { Pressable, StyleSheet, Text, View } from "react-native";
import StarIcon from '@expo/vector-icons/AntDesign';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from "react";

import { hscale, mscale, wscale } from "../helpers/metric";
import { useAuthStore } from "../stores/authStore";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";


type Tab = 'Refer' | 'Earn'

export default function EarningScreen() {
    const [activeTab, setActiveTab] = useState<Tab>('Refer')


    return (
        <View style={globalStyles.screen}>
            {/* tabs view */}
            <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />
            {/* how you earn view */}
            <View style={styles.bannerView}>
                <StarIcon name="star" size={20} color={colors.primary} />
                <View style={{ flex: 1, marginLeft: wscale(12) }}>
                    <Text style={[styles.text, { fontFamily: 'Inter-Bold', fontSize: mscale(20), color: colors.black }]}>How You Earn</Text>
                    <View style={{ gap: 12, marginTop: hscale(20) }}>
                        <Text style={styles.text}>Subscribe to premium package</Text>
                        <Text style={styles.text}>People signup with your referral code</Text>
                        <Text style={styles.text}>Referred individual pay for a material</Text>
                    </View>
                </View>
            </View>


            <Text style={[styles.text, { fontFamily: 'Inter-Bold', color: colors.black, textAlign: 'center', marginTop: hscale(40) }]}> Get Free NGN 100.00</Text>
            <Text style={[styles.text, { textAlign: 'center' }]}>Share this hack with your friends</Text>
            <Text style={[styles.text, { textAlign: 'center', marginTop: hscale(20) }]}>You stand to earn NGN 100.00 when your friend input your referral code during sign up and registers to the
                premium package</Text>

            {/* Copy referral code view */}
            <CopyReferalCodeView />

        </View>
    )
}

const Tabs = ({ setActiveTab, activeTab }: { setActiveTab: React.Dispatch<React.SetStateAction<Tab>>, activeTab: Tab }) => {
    const tabEarn: Tab = 'Earn';
    const tabRefer: Tab = 'Refer';
    return (
        <View style={styles.tabButtonsView}>
            <Pressable style={[styles.tabView, { backgroundColor: activeTab === 'Refer' ? colors.primary : undefined }]} onPress={() => setActiveTab('Refer')}>
                <Text style={[{ fontFamily: "Inter-Bold", fontSize: mscale(16), textAlign: 'center' }, {
                    color: activeTab === 'Refer' ? '#ffffff' : undefined
                }]}>{tabRefer}</Text>
            </Pressable>

            <Pressable style={[styles.tabView, { backgroundColor: activeTab === 'Earn' ? colors.primary : undefined }]} onPress={() => setActiveTab('Earn')}>
                <Text style={[{ fontFamily: "Inter-Bold", fontSize: mscale(16), textAlign: 'center' }, {
                    color: activeTab === 'Earn' ? '#ffffff' : colors.black
                }]}>{tabEarn}</Text>
            </Pressable>
        </View>
    )
}

const CopyReferalCodeView = () => {
    const { profile } = useAuthStore(state => state.user);
    const [copiedCode, setCopiedCode] = useState(false);
    const userReferralCode = profile.referralCode

    const handleCopyCode = async () => {
        await Clipboard.setStringAsync(userReferralCode)
        setCopiedCode(true)
    }

    useEffect(() => {
        setTimeout(() => {
            setCopiedCode(false)
        }, 1000)
    }, [copiedCode])
    return (
        <View style={styles.copyReferralCodeView}>
            <View style={{ flex: 1 }}>
                <Text style={[styles.text, { fontFamily: "Inter-Bold", color: colors.black }]}>Referral code</Text>
                <Text>{userReferralCode}</Text>
            </View>
            <Text style={styles.textButton} onPress={handleCopyCode}>Copy</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    tabButtonsView: {
        backgroundColor: '#ECECEC',
        width: '85%',
        marginHorizontal: 'auto',
        flexDirection: 'row',
        borderRadius: mscale(30),

    },
    tabView: {
        height: hscale(48),
        flex: 1,
        justifyContent: 'center',
        borderRadius: mscale(30),
    },
    text: {
        fontFamily: 'Inter-regular',
        fontSize: mscale(16),
        color: '#5C5F62'
    },
    bannerView: {
        backgroundColor: '#ECECEC',
        marginTop: hscale(20),
        borderRadius: mscale(15),
        flexDirection: 'row',
        padding: mscale(20),
        height: hscale(180)
    },
    copyReferralCodeView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECECEC',
        paddingVertical: hscale(12),
        paddingHorizontal: wscale(24),
        borderRadius: mscale(12),
        marginTop: hscale(20),
        borderWidth: 1.5,
        borderColor: colors.black
    },
    textButton: {
        fontFamily: 'Inter-Bold',
        fontSize: mscale(12),
        height: hscale(32),
        backgroundColor: colors.primary,
        paddingHorizontal: wscale(20),
        textAlign: 'center',
        lineHeight: hscale(32),
        color: '#ffffff',
        borderRadius: mscale(16)
    }
})