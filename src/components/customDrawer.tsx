import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Linking,
  Alert,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoutIcon from "@expo/vector-icons/MaterialIcons";
import SocialIcon from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { router } from "expo-router";

import { colors, screenHorizontalPadding } from "../constants/theme";
import { hscale, mscale, wscale } from "../helpers/metric";
import { useAuthStore } from "../stores/authStore";
import LoadingView from "./loadingView";
import AvatarView from "./avatarView";
import ErrorModal from "./errorModal";
import Profile from "../screens/Drawer/Profile";
import Complaints from "../screens/Drawer/Complaints";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { globalStyles } from "../styles/global";

type DrawerSection = "profile" | "complaints" | null;

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const { navigation } = props;
  const [openSection, setOpenSection] = useState<DrawerSection>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const authUser = useAuthStore((state) => state.user);
  const fullName = authUser?.profile?.fullName ?? "";

  const toggleSection = (section: DrawerSection) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleSocialIconPressed = async (icon: "tw" | "ig" | "fb" | "tt") => {
    try {
      if (icon === "tw") {
        await Linking.openURL(
          "https://x.com/solva_africa?t=GTrgJcb-uy8BOkJ94_3cfw&s=09",
        );
      }

      if (icon === "fb") {
        await Linking.openURL(
          "https://www.facebook.com/profile.php?id=61562756354347",
        );
      }

      if (icon === "ig") {
        await Linking.openURL(
          "https://www.instagram.com/solva_africa?igsh=eGF1eW1rYWx0bWxy",
        );
      }

      if (icon === "tt") {
        await Linking.openURL(
          "https://www.tiktok.com/@solva_africa?_t=ZS-8zTTXNGGpmy&_r=1",
        );
      }
    } catch (error) {
      console.log("Error opening social link");
      let message = "Error opening social link";
      setErrorMessage(message);
      setErrorVisible(true);
    }
  };

  const logoutUser = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem("User");

      // On web, use a browser redirect to avoid Expo Router mount timing issues
      // during logout state changes.
      if (Platform.OS === "web") {
        window.location.replace("/");
        return;
      }

      useAuthStore.setState((currState) => {
        return { ...currState, user: null };
      });
      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Error logging out user", error);
      let message = "Error, Sorry, could not log you out. Try again.";
      setErrorMessage(message);
      setErrorVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        void logoutUser();
      }
      return;
    }

    // confirm logout
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Yes", onPress: () => void logoutUser() },
      { text: "No", onPress: () => null },
    ]);
  };

  return (
    <DrawerContentScrollView style={styles.drawerView}>
      <View style={styles.drawerHeaderView}>
        <Image
          source={require("../../assets/images/Person.png")}
          style={styles.avatar}
          resizeMode="contain"
        />
        <Text
          style={{
            fontFamily: "Inter-Bold",
            marginTop: hscale(12),
            fontSize: mscale(18),
          }}
        >
          {fullName}
        </Text>
      </View>

      <Pressable
        onPress={() => toggleSection("profile")}
        style={styles.customDrawerItem}
      >
        <Text
          style={[
            styles.activeScreenTextLink,
            {
              color:
                openSection === "profile" ? colors.primary : colors.bodyText,
            },
          ]}
        >
          Profile
        </Text>
      </Pressable>

      {openSection === "profile" && (
        <View style={{ paddingVertical: hscale(16) }}>
          <Profile />
        </View>
      )}

      <Pressable
        onPress={() => toggleSection("complaints")}
        style={styles.customDrawerItem}
      >
        <Text
          style={[
            styles.activeScreenTextLink,
            {
              color:
                openSection === "complaints" ? colors.primary : colors.bodyText,
            },
          ]}
        >
          Complaints
        </Text>
      </Pressable>

      {openSection === "complaints" && (
        <View style={{ paddingVertical: hscale(16) }}>
          <Complaints />
        </View>
      )}

      {/* This footer stays at the bottom and is always visible */}
      <View style={styles.footer}>
        <View style={styles.socialIconsView}>
          <SocialIcon
            name="twitter"
            size={24}
            onPress={() => handleSocialIconPressed("tw")}
          />
          <SocialIcon
            name="facebook"
            size={24}
            onPress={() => handleSocialIconPressed("fb")}
          />
          <SocialIcon
            name="instagram"
            size={24}
            onPress={() => handleSocialIconPressed("ig")}
          />
        </View>
        <Pressable style={styles.logoutView} onPress={handleLogout}>
          <LogoutIcon name="logout" size={20} color={"#ffffff"} />
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: mscale(14),
              color: "#ffffff",
              marginLeft: 4,
            }}
          >
            Logout
          </Text>
        </Pressable>
      </View>
      <LoadingView isLoading={isLoading} />
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerHeaderView: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hscale(40),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#C9CFC9",
  },
  drawerView: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: screenHorizontalPadding,
  },
  socialIconsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignSelf: "center",
  },
  logoutView: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: hscale(15),
    paddingHorizontal: wscale(30),
    alignItems: "center",
    marginTop: hscale(20),
    borderRadius: mscale(15 / 2),
  },
  activeScreenTextLink: { fontFamily: "Inter-Regular", fontSize: mscale(16) },
  customDrawerItem: {
    paddingVertical: hscale(20),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#C9CFC9",
    justifyContent: "center",
  },
  avatar: {
    width: 90,
    height: 90,
  },

  footer: {
    marginTop: "auto", // This pushes footer to bottom
    paddingTop: hscale(180),
    paddingBottom: hscale(40),
  },
});
