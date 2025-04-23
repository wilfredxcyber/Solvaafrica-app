import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { View, StyleSheet, Text, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import { useCallback, useState } from "react";
import { UserProfile } from "@/src/types";

import { hscale, mscale, wscale } from "../../helpers/metric";
import PrimaryButton from "../../components/primaryButton";
import { useAuthStore } from "../../stores/authStore";
import AvatarView from "../../components/avatarView";
import { globalStyles } from "../../styles/global";
import { colors } from "../../constants/theme";
import ErrorModal from "@/src/components/errorModal";

type UpdateUserProfile = {
  fullName: null | string;
  email: null | string;
  address: null | string;
  gender: null | string;
  phone: null | string;
};

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UpdateUserProfile>({
    fullName: null,
    email: null,
    address: null,
    gender: null,
    phone: null,
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("User").then((value) => {
        if (value) {
          const { fullName, gender, email, address, phone } =
            JSON.parse(value).profile;
          setUserProfile({ fullName, gender, email, address, phone });
        }
      });
      setShowDropdown(false);
    }, [])
  );

  const handleGenderDropdownItemPressed = (
    selectedGender: "Male" | "Female"
  ) => {
    setUserProfile((prev) => ({ ...prev, gender: selectedGender }));
    setShowDropdown(false);
  };

  const handleTextInputChange = (text: string) => {
    // no symbols, special characters or numbers allowed
    const filterdText = text.replace(/[^a-zA-Z ]/g, "");
    return filterdText;
  };

  const handleUpdateUserProfile = async () => {
    try {
      setIsLoading(true);
      // user must provide full name in first, last name format
      // user email must be valid
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const fieldsPass = () => {
        if (
          userProfile.fullName &&
          userProfile.fullName.trim().split(" ").length < 2
        ) {
          Alert.alert(
            "Invalid user name",
            "Kindly provide your first and last name, e.g John Doe"
          );
          return false;
        }
        if (userProfile.email && !emailRegex.test(userProfile.email.trim())) {
          Alert.alert(
            "Invalid email address",
            "Kindly provide a valid email address"
          );
          return false;
        }

        return true;
      };

      if (fieldsPass()) {
        // get current user profile
        const user = await AsyncStorage.getItem("User");
        const currentUserProfile = user && JSON.parse(user).profile;
        // basic sanitization
        userProfile.fullName =
          userProfile.fullName && userProfile.fullName.trim();
        userProfile.address = userProfile.address && userProfile.address.trim();
        if (
          JSON.stringify(currentUserProfile).toLowerCase() ===
          JSON.stringify(userProfile).toLowerCase()
        )
          return;

        console.log("Proceeding to update user");
        const profileUpdateRes = await AUTH_API_CLIENT.patch(
          "/users",
          userProfile
        );
        if (profileUpdateRes.status === 200) {
          const cachedUser = await AsyncStorage.getItem("User");
          const user = cachedUser && JSON.parse(cachedUser);
          user.profile = userProfile;
          // save to storage
          useAuthStore.setState((state) => ({
            ...state,
            user: { profile: userProfile },
          }));
          await AsyncStorage.setItem("User", JSON.stringify(user));
          console.log("user updated", user);
          Alert.alert("Profile Updated successfully!")
        }
      }
    } catch (error) {
      // Alert.alert("Update failed", "Something went wrong, kindly check your network");
      let message =
        "Update failed, Something went wrong, kindly check your network";
      setErrorMessage(message);
      setErrorVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <View style={{ marginHorizontal: "auto" }}>
        <AvatarView />
      </View>
      {/* inputs */}
      <View style={styles.inputFieldViewWrap}>
        <TextInput
          value={userProfile.fullName ?? undefined}
          style={styles.inputFieldView}
          placeholder="Full name"
          placeholderTextColor={colors.placeholderInput}
          autoCapitalize="words"
          onChangeText={(text) =>
            setUserProfile((prev) => ({
              ...prev,
              fullName: handleTextInputChange(text),
            }))
          }
        />
        <TextInput
          value={userProfile.email ?? undefined}
          style={styles.inputFieldView}
          placeholder="Email address"
          placeholderTextColor={colors.placeholderInput}
          onChangeText={(text) =>
            setUserProfile((prev) => ({ ...prev, email: text.trim() }))
          }
        />
        <TextInput
          value={userProfile.phone ?? undefined}
          style={styles.inputFieldView}
          placeholder="Phone number"
          keyboardType="phone-pad"
          placeholderTextColor={colors.placeholderInput}
          onChangeText={(text) =>
            setUserProfile((prev) => ({ ...prev, phone: text.trim() }))
          }
        />
        <TextInput
          value={userProfile.address ?? undefined}
          style={styles.inputFieldView}
          placeholder="Residential address"
          placeholderTextColor={colors.placeholderInput}
          onChangeText={(text) =>
            setUserProfile((prev) => ({
              ...prev,
              address: handleTextInputChange(text),
            }))
          }
        />

        {/* sex input */}
        <View>
          <Pressable onPress={() => setShowDropdown(true)}>
            <TextInput
              value={userProfile.gender?.toLowerCase() ?? undefined}
              style={[styles.inputFieldView, { position: "relative" }]}
              placeholder="Gender"
              placeholderTextColor={colors.placeholderInput}
              editable={false}
            />
          </Pressable>
          {/* dropdown component */}
          {showDropdown ? (
            <View style={styles.dropdownContainer}>
              <Text
                onPress={() => handleGenderDropdownItemPressed("Male")}
                style={[
                  styles.dropdownText,
                  {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.greyView,
                  },
                ]}
              >
                Male
              </Text>
              <Text
                onPress={() => handleGenderDropdownItemPressed("Female")}
                style={styles.dropdownText}
              >
                Female
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <PrimaryButton
        text="Update profile"
        onPress={handleUpdateUserProfile}
        isLoading={isLoading}
      />
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputFieldView: {
    backgroundColor: colors.inputField,
    height: hscale(60),
    paddingHorizontal: wscale(32),
    borderRadius: mscale(30),
    fontFamily: "Inter-Medium",
    color: colors.black,
  },
  inputFieldViewWrap: { gap: hscale(12), marginVertical: hscale(40) },
  dropdownContainer: {
    borderRadius: mscale(12),
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    backgroundColor: "#ffffff",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 90,
    top: hscale(0),
  },
  dropdownText: {
    fontFamily: "Inter-Regular",
    paddingVertical: hscale(20),
    paddingHorizontal: wscale(40),
    textTransform: "capitalize"
  },
});
