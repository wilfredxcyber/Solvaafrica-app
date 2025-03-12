import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
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

export default function LoginScreen() {
  const [form, setForm] = useState<ILoginForm>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const handleFormSubmit = async () => {
    inputRef.current?.blur();
    console.log("The form", form);

    const { email, password } = form;

    if (!email || !password) return;

    try {
      setIsLoading(true);
      // post to /login
      const res = await PUB_API_CLIENT.post("/users/login", form);
      console.log("Login res", res.data);

      if (res.status === 200) {
        const resData = res.data;

        const { data } = resData;
        // extract keys
        const { tokens } = data;

        // get user
        const getUserRes = await PUB_API_CLIENT.get("/users", {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });

        if (getUserRes.status === 200) {
          const { data } = getUserRes.data;

          console.log("User", data);
          // save user
          const { fullName, gender, email, address, phone } = data;
          const userProfile: UserProfile = { fullName, gender, email, address, phone };
          const user: { profile: UserProfile; tokens: Tokens | null } = {
            profile: userProfile,
            tokens,
          };

          await AsyncStorage.setItem("User", JSON.stringify(user));
          console.log(user);

          // store user in global store
          useAuthStore.setState((state) => ({ ...state, user }));
          return;
        }
      }
    } catch (error: any) {
      console.log("Error logging in useruser", error);
      if (error.status === 400 || 401) {
        Alert.alert("Error", "Email or Password is incorrect. Try again!");
        return;
      }

      Alert.alert("Error", "Something went wrong!");
    } finally {
      console.log("Operation complete");
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <View style={{ marginHorizontal: "auto" }}>
        <Logo />
      </View>

      {/* form view */}
      <View style={styles.formView}>
        <ScreenHeadingText
          text="Welcome Back"
          customStyle={{ textAlign: "center", marginVertical: "auto" }}
        />
        <Text style={{ color: colors.bodyText, textAlign: "center", fontFamily: "Inter-Regular" }}>
          It’s good to have you back. Always a good time to learn and earn
        </Text>

        <View style={{ marginTop: hscale(40), gap: hscale(8) }}>
          <View style={styles.inputView}>
            <Icon name="mail" size={20} color={colors.primary} />
            <TextInput
              ref={inputRef}
              placeholderTextColor={colors.placeholderInput}
              placeholder="Email"
              style={styles.input}
              onChangeText={(email) => setForm({ ...form, email })}
            />
          </View>

          <View style={styles.inputView}>
            <Icon name="lock" size={20} color={colors.primary} />
            <TextInput
              ref={inputRef}
              secureTextEntry
              placeholderTextColor={colors.placeholderInput}
              placeholder="Password"
              style={styles.input}
              onChangeText={(password) => setForm({ ...form, password })}
            />
          </View>
        </View>

        <View style={{ marginTop: hscale(40) }}>
          <PrimaryButton text="Login" onPress={handleFormSubmit} />
          <TextLinkButton text="Forgot password" onPress={() => console.log("Forgot password")} />
        </View>
      </View>
      <LoadingView isLoading={isLoading} />
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
