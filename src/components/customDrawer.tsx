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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoutIcon from "@expo/vector-icons/MaterialIcons";
import SocialIcon from "@expo/vector-icons/FontAwesome";
import { useState } from "react";

import { colors, screenHorizontalPadding } from "../constants/theme";
import { hscale, mscale, wscale } from "../helpers/metric";
import { useAuthStore } from "../stores/authStore";
import LoadingView from "./loadingView";
import AvatarView from "./avatarView";
import ErrorModal from "./errorModal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type TDrawerScreens = "Profile" | "Complaints";

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const { navigation } = props;
  const [activeScreen, setActiveScreen] = useState<TDrawerScreens>("Profile");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const authUser = useAuthStore((state) => state.user);

  const { fullName } = authUser.profile;

  const handleSetActiveProfile = (selectedScreen: TDrawerScreens) => {
    if (selectedScreen === "Profile") {
      setActiveScreen(selectedScreen);
      navigation.navigate(selectedScreen);
    } else if (selectedScreen === "Complaints") {
      // return
      setActiveScreen(selectedScreen);
      navigation.navigate(selectedScreen);
    }
  };

  const handleSocialIconPressed = async (icon: "tw" | "ig" | "fb" | "tt") => {
    try {
      if (icon === "tw") {
        await Linking.openURL(
          "https://x.com/solva_africa?t=GTrgJcb-uy8BOkJ94_3cfw&s=09"
        );
      }

      if (icon === "fb") {
        await Linking.openURL(
          "https://www.facebook.com/profile.php?id=61562756354347"
        );
      }

      if (icon === "ig") {
        await Linking.openURL(
          "https://www.instagram.com/solva_africa?igsh=eGF1eW1rYWx0bWxy"
        );
      }

      if (icon === "tt") {
        await Linking.openURL(
          "https://www.tiktok.com/@solva_africa?_t=ZS-8zTTXNGGpmy&_r=1"
        );
      }
    } catch (error) {
      console.log("Error opening social link");
      let message = "Error opening social link";
      setErrorMessage(message);
      setErrorVisible(true);
    }
  };

  const handleLogout = () => {
    const logoutUser = async () => {
      useAuthStore.setState((currState) => {
        return { ...currState, user: null };
      });

      try {
        setIsLoading(true);
        await AsyncStorage.removeItem("User");
      } catch (error) {
        console.log("Error logging out user", error);

        // Alert.alert("Error", "Sorry, could not log you out. Try again.");
        let message = "Error, Sorry, could not log you out. Try again.";
        setErrorMessage(message);
        setErrorVisible(true);
      } finally {
        setIsLoading(false);
      }
    };

    // confirm logout
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Yes", onPress: logoutUser },
      { text: "No", onPress: () => null },
    ]);
  };

  return (
    <DrawerContentScrollView style={styles.drawerView}>
      <View style={styles.drawerHeaderView}>
        <AvatarView />
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
        onPress={() => handleSetActiveProfile("Profile")}
        style={styles.customDrawerItem}
      >
        <Text
          style={[
            styles.activeScreenTextLink,
            {
              color:
                activeScreen === "Profile" ? colors.primary : colors.bodyText,
            },
          ]}
        >
          Profile
        </Text>
      </Pressable>
      <Pressable
        onPress={() => handleSetActiveProfile("Complaints")}
        style={styles.customDrawerItem}
      >
        <Text
          style={[
            styles.activeScreenTextLink,
            {
              color:
                activeScreen === "Complaints"
                  ? colors.primary
                  : colors.bodyText,
            },
          ]}
        >
          Complaints
        </Text>
      </Pressable>

      <View style={{ justifyContent: "flex-end", height: "80%" }}>
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
          <MaterialIcons
            name="tiktok"
            size={24}
            color="black"
            onPress={() => handleSocialIconPressed("tt")}
          />
          {/* <SocialIcon name="tiktok" size={24} /> */}
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
    backgroundColor: "#F5F6F5",
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
});
