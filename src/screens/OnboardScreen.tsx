import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, screenHorizontalPadding } from "../constants/theme";
import TextLinkButton from "../components/textLinkButton";
import PrimaryButton from "../components/primaryButton";
import { hscale, mscale } from "../helpers/metric";
import { globalStyles } from "../styles/global";

export default function OnboardScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.onboardImageView}>
          <Image
            source={require("../../assets/images/onboardGroup.png")}
            style={styles.onboardImage}
            resizeMode="contain"
          />
        </View>
        {/* modal */}
        <View style={styles.onboardModal}>
          <View style={styles.onboardWelcome}>
            <Text style={[globalStyles.headlineText, styles.welcomeTitle]}>
              Welcome to Solva
            </Text>
            <View style={{ height: 20 }} />
            <Text style={[globalStyles.bodyText, styles.welcomeSubtitle]}>
              It's good to have you here always a good time to learn and earn
            </Text>
          </View>

          {/* buttons */}
          <PrimaryButton
            text="Get Started"
            onPress={() => navigation.navigate("App", { screen: "CreateAccount" })}
          />
          <View style={styles.loginContainer}>
            <Text>Already have an account? </Text>
            <TextLinkButton
              text="Log in"
              customStyle={styles.loginLinkText}
              onPress={() => navigation.navigate("App", { screen: "Login" })}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: screenHorizontalPadding,
    paddingVertical: hscale(20),
    justifyContent: "space-between",
  },
  onboardImage: {
    width: "100%",
    height: "100%",
  },
  onboardImageView: {
    width: "100%",
    height: hscale(320),
    maxHeight: 380,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hscale(10),
  },
  onboardWelcome: {
    marginBottom: hscale(20), // Reduced margin
    alignItems: "center",
  },
  onboardModal: {
    justifyContent: "center",
  },
  welcomeTitle: {
    textAlign: "center",
  },
  welcomeSubtitle: {
    textAlign: "center",
    paddingHorizontal: mscale(20),
    lineHeight: mscale(24),
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginLinkText: {
    color: "#0882DE",
    fontFamily: "Inter-Regular",
    fontSize: mscale(16),
  },
});
