import React from "react";
import { View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "@/src/styles/global";
import Logo from "@/src/components/logo";
import ScreenHeadingText from "@/src/components/screenHeadingText";
import { colors } from "@/src/constants/theme";
import PrimaryButton from "@/src/components/primaryButton";
import { hscale, mscale, wscale } from "@/src/helpers/metric";

const ForgotPasswordSuccess = () => {
  const navigation = useNavigation();

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
          text="Email sent!"
          customStyle={{ textAlign: "center", marginVertical: "auto" }}
        />
        <Text
          style={{
            fontSize: mscale(17),
            color: colors.bodyText,
            textAlign: "center",
            fontFamily: "Inter-Regular",
          }}
        >
          Kindly follow the steps provided in the email sent to your email
          address to update your password. You can also choose to Login if you
          don’t want to change password at this time.
        </Text>

        <PrimaryButton
          text="Return to Login"
          onPress={() => navigation.navigate("App", { screen: "Login" })}
        />
      </View>
    </View>
  );
};

export default ForgotPasswordSuccess;
