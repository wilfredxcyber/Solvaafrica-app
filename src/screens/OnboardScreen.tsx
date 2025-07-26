import { Dimensions, Image, StyleSheet, Text, View, } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors, screenHorizontalPadding } from "../constants/theme";
import TextLinkButton from "../components/textLinkButton";
import PrimaryButton from "../components/primaryButton";
import { hscale, mscale } from "../helpers/metric";
import { globalStyles } from "../styles/global";


export default function OnboardScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.onboardImageView}>
                <Image source={require('../../assets/images/onboardGroup.png')} style={styles.onboardImage} />
            </View>
            {/* modal */}
            <View style={styles.onboardModal}>
                <View style={styles.onboardWelcome}>
                    <Text style={[globalStyles.headlineText, { textAlign: 'center' }]}>Welcome to solva</Text>
                    <Text style={[globalStyles.bodyText, { textAlign: 'center', width: '90%', marginHorizontal: 'auto' }]}>It's good to have you here always a good time to learn and earn</Text>
                </View>

                {/* buttons */}
                <PrimaryButton text="Get Started" onPress={() => navigation.navigate('App', { screen: 'CreateAccount' })} />
                <Text style={{ color: colors.bodyText, fontFamily: 'Inter-Regular', fontSize: mscale(16), textAlign: 'center', marginTop: hscale(16) }}>Already have an account? <TextLinkButton text="Login" onPress={() => navigation.navigate('App', { screen: 'Login' })} /></Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: screenHorizontalPadding },
    onboardImage: { width: '100%', height: '100%', objectFit: 'cover' },
    onboardImageView: { width: Dimensions.get('window').width - 40, height: '40%', marginHorizontal: 'auto', marginTop: hscale(60) },
    onboardWelcome: { marginTop: hscale(40), marginBottom: hscale(20) },
    onboardModal: { marginTop: hscale(40) }
})