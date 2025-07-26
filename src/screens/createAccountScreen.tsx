import { Text, TextInput, View, StyleSheet, Alert } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import ToastManager, { Toast } from "toastify-react-native";
import Icon from "@expo/vector-icons/Feather";
import { Formik, FormikProps } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import ScreenHeadingText from "../components/screenHeadingText";
import { hscale, mscale, wscale } from "../helpers/metric";
import TextLinkButton from "../components/textLinkButton";
import PrimaryButton from "../components/primaryButton";
import { PUB_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import Logo from "../components/logo";
import { useRoute } from "@react-navigation/native";

interface IFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referral: string;
}

const requiredFieldMessage = "This field is required";

const CreateAccountSchema = Yup.object().shape({
  fullName: Yup.string()
    .test("fullName", "Kindly provide a last name", (value) => {
      if (!value) return false;
      const names = value.trim().split(" ");
      return names.length >= 2;
    })
    .min(2, "Name cannot be less than 2 characters")
    .required(requiredFieldMessage),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Kindly provide a valid email address"
    )
    .required(requiredFieldMessage),
  phone: Yup.string().max(14).required(requiredFieldMessage),
  password: Yup.string()
    .min(8, "Minimum password length allowed is 8")
    .required(requiredFieldMessage),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password must match")
    .required(requiredFieldMessage),
  referral: Yup.string(),
});

export default function CreateAccountScreen() {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const route = useRoute();
  const referralCode = (route.params as any)?.ref || "";

  const initialValues: IFormValues = {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referral: referralCode,
  };

  const handleFormSubmit = async (values: IFormValues) => {
    // extract required fields
    const { fullName, email, phone, password, referral } = values;
    if (!agreeTerms) {
      Toast.error("Accept user terms and agreement");
      return;
    }
    // post to api
    try {
      setIsLoading(true);
      const createUserRes = await PUB_API_CLIENT.post("/users/create", {
        fullName,
        email,
        phone,
        password,
        referral,
      });
      console.log({ createUserRes: createUserRes.data });

      if (createUserRes.status === 201) {
        navigation.dispatch(StackActions.replace("App", { screen: "Login" }));
        return;
      }
    } catch (error: any) {
      console.log("Error creating user", error.response.data);

      if (error.status === 401) {
        const { message } = error.response.data;
        Toast.error(message);
        return;
      }

      // temporary: for everything else
      // Alert.alert('Error', 'Something went wrong...')
      let message = "Error, Something went wrong!";
      Toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <View style={{ marginHorizontal: "auto" }}>
        <Logo />
      </View>

      <ScreenHeadingText
        text="create your account"
        customStyle={{ textAlign: "center", marginTop: hscale(20) }}
      />
      <Text
        style={{
          color: colors.bodyText,
          textAlign: "center",
          fontFamily: "Inter-Regular",
        }}
      >
        Fill in your details accurately
      </Text>

      {/* form */}
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleFormSubmit(values)}
        validationSchema={CreateAccountSchema}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          values,
          errors,
        }: FormikProps<IFormValues>) => (
          <View style={{ marginTop: hscale(40), gap: hscale(8) }}>
            {/* full name input field */}
            <View>
              <View style={styles.inputView}>
                <Icon name="user" size={20} color={colors.primary} />
                <TextInput
                  autoCapitalize="words"
                  placeholderTextColor={colors.placeholderInput}
                  placeholder="Full Name"
                  onChangeText={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  value={values.fullName}
                  style={styles.input}
                />
              </View>
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}
            </View>

            {/* email input field */}
            <View>
              <View style={styles.inputView}>
                <Icon name="mail" size={20} color={colors.primary} />
                <TextInput
                  placeholderTextColor={colors.placeholderInput}
                  placeholder="Email Address"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  style={styles.input}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* phone input field */}
            <View>
              <View style={styles.inputView}>
                <Icon name="phone" size={20} color={colors.primary} />
                <TextInput
                  placeholderTextColor={colors.placeholderInput}
                  placeholder="Phone"
                  keyboardType="phone-pad"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  style={styles.input}
                />
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            {/* password input field */}
            {/* password input field */}
            <View>
              <View style={styles.inputView}>
                <Icon name="lock" size={20} color={colors.primary} />
                <TextInput
                  secureTextEntry={!showPassword}
                  placeholderTextColor={colors.placeholderInput}
                  placeholder="Password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  style={styles.input}
                />
                <Icon
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={colors.primary}
                  onPress={() => setShowPassword((prev) => !prev)}
                />
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* confirm password input field */}
            {/* confirm password input field */}
            <View>
              <View style={styles.inputView}>
                <Icon name="lock" size={20} color={colors.primary} />
                <TextInput
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor={colors.placeholderInput}
                  placeholder="Confirm Password"
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  style={styles.input}
                />
                <Icon
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color={colors.primary}
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                />
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* referral code input field */}
            <View>
              <View style={styles.inputView}>
                <Icon name="share-2" size={20} color={colors.primary} />
                <TextInput
                  placeholderTextColor={colors.placeholderInput}
                  placeholder="Referral Code"
                  onChangeText={handleChange("referral")}
                  onBlur={handleBlur("referral")}
                  value={values.referral}
                  style={styles.input}
                />
              </View>
              {errors.referral && (
                <Text style={styles.errorText}>{errors.referral}</Text>
              )}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                name={agreeTerms ? "check-square" : "square"}
                size={20}
                color={colors.primary}
                style={{ marginRight: wscale(8) }}
                onPress={() => setAgreeTerms(!agreeTerms)}
              />
              <TextLinkButton
                text="By checking this box, you agree to our terms/conditions."
                onPress={() => navigation.navigate("App", { screen: "Terms" })}
                customStyle={{ textAlign: "left", color: colors.textLink, fontSize: mscale(12) }}
              />
            </View>

            {/* create account button */}
            <PrimaryButton
              text="create account"
              onPress={handleSubmit}
              isLoading={isLoading}
            />
          </View>
        )}
      </Formik>
      <Text style={styles.haveAccount}>
        Already have an account?{" "}
        <TextLinkButton
          customStyle={{ color: colors.textLink }}
          text="Login"
          onPress={() => navigation.navigate("App", { screen: "Login" })}
        />
      </Text>
      {/* Toast provider should be at the root level */}
      <ToastManager />
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
  errorText: {
    fontFamily: "Inter-Medium",
    color: "red",
    fontSize: mscale(12),
    marginLeft: wscale(20),
  },
  haveAccount: {
    fontFamily: "Inter-Regular",
    color: colors.bodyText,
    fontSize: mscale(14),
    textAlign: "center",
    marginTop: hscale(20),
  },
});
