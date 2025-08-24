import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "@/src/styles/global";
import Logo from "@/src/components/logo";
import ScreenHeadingText from "@/src/components/screenHeadingText";
import { colors } from "@/src/constants/theme";
import PrimaryButton from "@/src/components/primaryButton";
import { hscale, mscale, wscale } from "@/src/helpers/metric";
import Icon from "@expo/vector-icons/Feather";
import { PUB_API_CLIENT } from "@/src/api/apiClient";
import LoadingView from "@/src/components/loadingView";
import ErrorModal from "@/src/components/errorModal";
import TextLinkButton from "@/src/components/textLinkButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToastManager, { Toast } from "toastify-react-native";

const ForgotPasswordSuccess = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const [password, setPassword] = useState("");

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordChange = async () => {
    passwordRef.current?.blur();

    if (!password || password.length < 6) {
      ToastAndroid.show("Password must be at least 6 characters.", ToastAndroid.LONG);
      // Toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      //updatepassword

      const otp = await AsyncStorage.getItem("otp");
      const userId = await AsyncStorage.getItem("userId");

      const payload = {
        userId: userId,
        otpCode: otp,
        newPassword: password,
      };

      const res = await PUB_API_CLIENT.post(
        "users/forgotten/password/reset",
        payload
      );

      if (res.status === 200) {
        console.log(res, "password change");

        Toast.success("Password reset successful");
        setTimeout(() => {
          navigation.navigate("App", { screen: "Login" });
        }, 2000);
      }
    } catch (error: any) {
      setLoading(false);

      const message = "Something went wrong!";
      setErrorMessage(message);
      setErrorVisible(true);
    } finally {
      console.log("Operation complete");
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <View style={{ marginHorizontal: "auto" }}>
        <Logo />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 30,
          justifyContent: "space-between",
          marginTop: 20,
          // height: hscale(400),
        }}
      >
        <Image
          source={require("../../../../assets/images/forgotPSuccess.png")}
          style={{
            height: hscale(213),
            width: wscale(208),
            marginHorizontal: "auto",
          }}
        />

        <ScreenHeadingText
          text="Update your password"
          customStyle={{ textAlign: "center", marginVertical: "auto" }}
        />

        <View style={styles.inputView}>
          <Icon name="lock" size={20} color={colors.primary} />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!showPassword}
            ref={passwordRef}
            placeholderTextColor={colors.placeholderInput}
            placeholder="Input new password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.nativeEvent.text)}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <PrimaryButton text="Proceed" onPress={handlePasswordChange} />
        <LoadingView isLoading={loading} />
        <TextLinkButton
          text="Back to login"
          onPress={() => navigation.navigate("App", { screen: "Login" })}
        />
      </View>
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
      <ToastManager />
    </View>
  );
};

export default ForgotPasswordSuccess;

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
});
