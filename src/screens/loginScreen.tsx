import { View, Text, StyleSheet, TextInput, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "@expo/vector-icons/Feather";
import { useRef, useState } from "react";

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
import { useNavigation } from "@react-navigation/native";
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
    const { email, password } = form;
    if (!email || !password) return;

    setIsLoading(true);

    try {
      const res = await PUB_API_CLIENT.post("/users/login", form);

      if (res.status === 200) {
        const { data: UserData } = res.data;
        const tokens = UserData.tokens;
        const userFromLogin = UserData.user;

        const userProfile: UserProfile = {
          fullName: userFromLogin.fullName,
          gender: userFromLogin.gender,
          email: userFromLogin.email,
          address: userFromLogin.address,
          phone: userFromLogin.phone,
          referralCode: userFromLogin.referralCode,
          userID: userFromLogin.id,
          role: userFromLogin.role,
          freelancer: userFromLogin.freelancer || undefined,
        };

        const user: { profile: UserProfile; tokens: Tokens | null } = {
          profile: userProfile,
          tokens,
        };

        await AsyncStorage.setItem("User", JSON.stringify(user));
        useAuthStore.setState({ user });

        console.log("Auth User:", user);
        return;
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
      setIsLoading(false);
    }
  };

  const navigation = useNavigation();

  return (
    <View style={globalStyles.screen}>
      <View style={{ marginHorizontal: "auto" }}>
        <Logo />
      </View>

      {/* form view */}
      <View style={styles.formView}>
        <View>
          <Image
            source={require("../../assets/images/hello.png")}
            style={{
              width: wscale(200),
              height: hscale(200),
              marginHorizontal: "auto",
            }}
          />
        </View>
        <ScreenHeadingText
          text="Welcome Back"
          customStyle={{ textAlign: "center", marginVertical: "auto" }}
        />
        <Text
          style={{
            color: colors.bodyText,
            textAlign: "center",
            fontFamily: "Inter-Regular",
          }}
        >
          It’s good to have you back. Always a good time to learn and earn
        </Text>

        <View style={{ marginTop: hscale(40), gap: hscale(8) }}>
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
              // onEndEditing={(e) =>
              //   setForm((prev) => ({ ...prev, email: e.nativeEvent.text }))
              // }
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

        <View style={{ marginTop: hscale(40) }}>
          <PrimaryButton text="Login" onPress={handleFormSubmit} />
          <TextLinkButton
            text="Forgot password"
            onPress={() =>
              navigation.navigate("App", { screen: "forgotPassword" })
            }
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
  );
}

const styles = StyleSheet.create({
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
  formView: { marginVertical: "auto" },
});
