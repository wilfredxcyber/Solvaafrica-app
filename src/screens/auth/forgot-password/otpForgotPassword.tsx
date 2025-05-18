import React from "react";
import OtpInput from "@/src/components/otpInputs";
import { View, Alert, Image, Text } from "react-native";
import { globalStyles } from "@/src/styles/global";
import Logo from "@/src/components/logo";
import { hscale, mscale, wscale } from "@/src/helpers/metric";
import ScreenHeadingText from "@/src/components/screenHeadingText";
import { colors } from "@/src/constants/theme";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ForgotPasswordOtp = () => {
  const navigation = useNavigation();

  const handleOtpSubmit = async (otp: string) => {
    // Alert.alert("OTP Entered", otp);
    await AsyncStorage.setItem("otp", otp);

    navigation.navigate("App", { screen: "forgotPasswordSuccess" });
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
          gap: mscale(20),
          justifyContent: "space-between",
          marginTop: 20,
          // height: hscale(400),
        }}
      >
        <Image
          source={require("../../../../assets/images/forgotP.png")}
          style={{
            height: hscale(213),
            width: wscale(208),
            marginHorizontal: "auto",
          }}
        />
        <ScreenHeadingText
          text="OTP sent"
          customStyle={{ textAlign: "center", marginVertical: "auto" }}
        />
        <Text
          style={{
            fontSize: mscale(16),
            color: colors.bodyText,
            textAlign: "center",
            fontFamily: "Inter-Regular",
          }}
        >
          Enter 4 digit code sent to your email
        </Text>
        <OtpInput onSubmit={handleOtpSubmit} />
      </View>
    </View>
  );
};

export default ForgotPasswordOtp;
