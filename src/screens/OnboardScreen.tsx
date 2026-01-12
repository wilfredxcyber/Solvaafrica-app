import { Dimensions, Image, StyleSheet, Text, View, ScrollView, Platform } from "react-native";
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
                <Image 
                    source={require('../../assets/images/onboardGroup.png')} 
                    style={styles.onboardImage} 
                    resizeMode="contain"
                />
            </View>
            {/* modal */}
            <View style={styles.onboardModal}>
                <View style={styles.onboardWelcome}>
                    <Text style={[globalStyles.headlineText, styles.welcomeTitle]}>Welcome to solva</Text>
                    <View style={{ height: 20 }} />
                    <Text style={[globalStyles.bodyText, styles.welcomeSubtitle]}>
                        It's good to have you here always a good time to learn and earn
                    </Text>
                </View>

                {/* buttons */}
                <PrimaryButton text="Get Started" onPress={() => navigation.navigate('App', { screen: 'CreateAccount' })} />
                <View style={styles.loginContainer}>
                    <Text>Already have an account? </Text>
                    <TextLinkButton text="Login" customStyle={styles.loginLinkText} onPress={() => navigation.navigate('App', { screen: 'Login' })} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#ffffff', 
        paddingHorizontal: screenHorizontalPadding,
        paddingVertical: hscale(20),
        justifyContent: 'flex-start',
        ...Platform.select({
            web: {
                height: '100vh' as any,
                maxHeight: '100vh' as any,
            }
        })
    },
    onboardImage: { 
        width: '100%', 
        height: '100%',
    },
    onboardImageView: { 
        width: '100%', 
        flex: 1, // Let it grow to fill available space
        minHeight: 200, // Set minimum height
        maxHeight: 400, // Cap the maximum height
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hscale(30), // Reduced gap
    },
    onboardWelcome: { 
        marginBottom: hscale(20), // Reduced margin
        alignItems: 'center',
    },
    onboardModal: { 
        justifyContent: 'center', 
    },
    welcomeTitle: { 
        textAlign: 'center',
    },
    welcomeSubtitle: { 
        textAlign: 'center', 
        paddingHorizontal: mscale(20),
        lineHeight: mscale(24),
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginLinkText: {
        color: '#0882DE', 
        fontFamily: 'Inter-Regular', 
        fontSize: mscale(16),
    },
})