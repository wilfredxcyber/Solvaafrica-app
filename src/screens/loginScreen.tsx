import { View, Text, StyleSheet, TextInput, Alert, Image, Platform, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "@expo/vector-icons/Feather";
import { useRef, useState } from "react";
import { router } from "expo-router";

import ScreenHeadingText from "../components/screenHeadingText";
import { UserProfile, ILoginForm, Tokens } from "../types";
import { hscale, mscale, wscale } from "../helpers/metric";
import TextLinkButton from "../components/textLinkButton";
import PrimaryButton from "../components/primaryButton";
import LoadingView from "../components/loadingView";
import { useAuthStore } from "../stores/authStore";
import { PUB_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import Logo from "../components/logo";
import ErrorModal from "../components/errorModal";

export default function LoginScreen() {
  const [form, setForm] = useState<ILoginForm>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  const handleFormSubmit = async () => {
    emailRef.current?.blur();
    console.log("The form", form);

    const { email, password } = form;

    if (!email || !password) return;
    setIsLoading(true);
    try {
      //login
      const res = await PUB_API_CLIENT.post("/users/login", form);

      if (res.status === 200) {
        const { data: UserData } = res.data;
        const userId = UserData.user.id;
        const tokens = UserData.tokens;

        // get user
        const getUserRes = await PUB_API_CLIENT.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });

        if (getUserRes.status === 200) {
          const { data } = getUserRes.data;

          console.log("User", data);

          // save user
          const { fullName, gender, email, address, phone, referralCode } = data;
          const userProfile: UserProfile = {
            fullName,
            gender,
            email,
            address,
            phone,
            referralCode,
            userID: userId,
          };
          const user: { profile: UserProfile; tokens: Tokens | null } = {
            profile: userProfile,
            tokens,
          };

          await AsyncStorage.setItem("User", JSON.stringify(user));
          console.log("Auth User: \n", user);

          // store user in global store
          useAuthStore.setState((state) => ({ ...state, user }));
          
          // ✅ NAVIGATE TO MAIN APP
          router.replace('/(tabs)');
          return;
        }
      }
    } catch (error: any) {
      console.log("Error logging in user", error);

      let message = "Something went wrong!";
      if (error.status === 400 || error.status === 401) {
        message = "Email or Password is incorrect. Try again!";
      }

      setErrorMessage(message);
      setErrorVisible(true);
    } finally {
      console.log("Operation complete");
      setIsLoading(false);
    }
  };

  return(
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={[globalStyles.screen, styles.container]}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>

        {/* form view */}
        <View style={styles.formView}>
          <View>
            <Image
              source={require("../../assets/images/hello.png")}
              style={styles.helloImage}
            />
          </View>
          <ScreenHeadingText
            text="Welcome Back"
            customStyle={{ textAlign: "center" }}
          />
          <Text style={styles.subtitle}>
            It's good to have you back. Always a good time to learn and earn
          </Text>

          <View style={{ marginTop: hscale(20), gap: hscale(8) }}>
            <View style={styles.inputView}>
              <Icon name="mail" size={20} color={colors.primary} />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                ref={emailRef}
                placeholderTextColor={colors.placeholderInput}
                placeholder="Email"
                style={styles.input}
                value={form.email}
                onChangeText={(email) => setForm((prev) => ({ ...prev, email }))}
              />
            </View>

            <View style={styles.inputView}>
              <Icon name="lock" size={20} color={colors.primary} />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showPassword}
                ref={passwordRef}
                placeholderTextColor={colors.placeholderInput}
                placeholder="Password"
                style={styles.input}
                value={form.password}
                onChangeText={(password) =>
                  setForm((prev) => ({ ...prev, password }))
                }
              />

              <Icon
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color={colors.primary}
                onPress={() => setShowPassword(!showPassword)}
                style={{ paddingLeft: 10 }}
              />
            </View>
          </View>

          <View style={{ marginTop: hscale(20) }}>
            <PrimaryButton text="Login" onPress={handleFormSubmit} />
            <TextLinkButton
              text="Forgot password"
              onPress={() => router.push('/(auth)/forgot-password')}
            />
          </View>
        </View>
        <LoadingView isLoading={isLoading} />
        <ErrorModal
          visible={errorVisible}
          message={errorMessage}
          onClose={() => setErrorVisible(false)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  container: {
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        height: '100vh' as any,
        maxHeight: '100vh' as any,
      }
    })
  },
  logoContainer: {
    marginHorizontal: "auto",
    marginTop: hscale(10),
    flexShrink: 0,
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
    height: hscale(50),
    backgroundColor: colors.inputField,
    paddingHorizontal: wscale(20),
    borderRadius: mscale(50),
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: "Inter-Bold",
    color: colors.black,
    fontSize: mscale(14),
    paddingLeft: wscale(8),
  },
  formView: { 
    flex: 1,
    justifyContent: 'center',
    minHeight: 0,
  },
  helloImage: {
    width: wscale(150),
    height: hscale(150),
    marginHorizontal: "auto",
    marginBottom: hscale(10),
  },
  subtitle: {
    color: colors.bodyText,
    textAlign: "center",
    fontFamily: "Inter-Regular",
    marginTop: hscale(5),
    marginBottom: hscale(10),
  },
});