import { View, Text, StyleSheet, Image, Dimensions, Pressable, Linking, Alert } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import MenuIcon from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Carousel from "pinar";

import { useUserSubscriptionStore } from "../stores/subscriptionStore";
import { colors, screenHorizontalPadding } from "../constants/theme";
import { AUTH_API_CLIENT, PUB_API_CLIENT } from "../api/apiClient";
import { hscale, mscale, wscale } from "../helpers/metric";
import { useAuthStore } from "../stores/authStore";
import AvatarView from "../components/avatarView";
import { getSliderImages } from "../api/queries";
import { globalStyles } from "../styles/global";

enum MenuItemScreensRoutes {
  "COURSES" = "Courses",
  "PROJECTS" = "Projects",
  "UPLOAD" = "Upload PQs/Projects",
  "PREMIUM" = "Premium",
  "EARNING" = "Earning",
  "SERVICES" = "Services",
  "ASK" = "Ask",
  "ESCROW_SITE" = "Transecure Escrow",
}

interface IMenuItems {
  item: MenuItemScreensRoutes;
  icon: () => React.ReactNode;
}

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation();
  const userProfile = user.profile;
  const { width } = Dimensions.get("window");
  const slidesPlaceholder = require("../../assets/images/placeholder.png");
  const [isSubscribed, setIsSubscribed] = useState(true);

  const MENU_ITEMS: IMenuItems[] = [
    {
      item: MenuItemScreensRoutes.COURSES,
      icon: () => <MenuIcon name="book-outline" size={20} color={"#ffffff"} />,
    },
    {
      item: MenuItemScreensRoutes.PROJECTS,
      icon: () => <MenuIcon name="folder-open-outline" size={20} color={"#ffffff"} />,
    },
    {
      item: MenuItemScreensRoutes.UPLOAD,
      icon: () => <MenuIcon name="cloud-upload-outline" size={20} color={"#ffffff"} />,
    },
    {
      item: MenuItemScreensRoutes.PREMIUM,
      icon: () => <MenuIcon name="pricetags-outline" size={20} color={"#ffffff"} />,
    },
    {
      item: MenuItemScreensRoutes.EARNING,
      icon: () => <MenuIcon name="cash-outline" size={20} color={"#ffffff"} />,
    },
    {
      item: MenuItemScreensRoutes.SERVICES,
      icon: () => <MenuIcon name="briefcase-outline" size={20} color={"#ffffff"} />,
    },
    {
      item: MenuItemScreensRoutes.ASK,
      icon: () => <MenuIcon name="chatbubble-ellipses-outline" size={20} color={"#ffffff"} />,
    },
    {
      item: MenuItemScreensRoutes.ESCROW_SITE,
      icon: () => <MenuIcon name="shield-checkmark-outline" size={20} color={"#ffffff"} />,
    },
  ];

  const handleMenuItemPressed = (pressedItem: MenuItemScreensRoutes) => {
    if (pressedItem === MenuItemScreensRoutes.COURSES) {
      navigation.navigate("App", { screen: "Courses" });
    } else if (pressedItem === MenuItemScreensRoutes.PROJECTS) {
      navigation.navigate("App", { screen: "Projects" });
    } else if (pressedItem === MenuItemScreensRoutes.UPLOAD) {
      navigation.navigate("App", { screen: "Upload" });
    } else if (pressedItem === MenuItemScreensRoutes.PREMIUM) {
      navigation.navigate("App", { screen: "Premium" });
    } else if (pressedItem === MenuItemScreensRoutes.EARNING) {
      navigation.navigate("App", { screen: "Earning" });
    } else if (pressedItem === MenuItemScreensRoutes.SERVICES) {
      navigation.navigate("App", { screen: "Services" });
    } else if (pressedItem === MenuItemScreensRoutes.ASK) {
      navigation.navigate("App", { screen: "Ask" });
    } else if (pressedItem === MenuItemScreensRoutes.ESCROW_SITE) {
      Linking.openURL("https://www.solvaafrica.com/").catch((error) => {
        Alert.alert("URL Error!", error?.message ?? "Could not open link");
      });
    }
    return;
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["homeScreenSliders"],
    queryFn: getSliderImages,
  });

  console.log("Query data", data);

  return (
    <View style={globalStyles.screen}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: hscale(20),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AvatarView />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.greetUserText}>
              Hello, {userProfile.fullName.trim().split(" ")[0]}
            </Text>
            <Text style={[globalStyles.bodyText, { fontSize: mscale(14) }]}>
              Here's what is happening today.
            </Text>
          </View>
        </View>

        {/* notification icon */}
        <Icon name="bell" color={colors.primary} size={24} />
      </View>

      <Carousel
        height={hscale(100)}
        showsControls={false}
        autoplay={true}
        loop={true}
        pagingEnabled={true}
        bounces={true}
        activeDotStyle={{ backgroundColor: colors.primary }}
        dotStyle={{ backgroundColor: colors.sliderDotsInactive }}
        dotsContainerStyle={{ bottom: hscale(-20) }}
        mergeStyles={true}
      >
        {data
          ? data.map((currentSlideImage, index) => (
              <View
                style={{ width: width - screenHorizontalPadding * 2, height: "100%" }}
                key={index + currentSlideImage}
              >
                <Image
                  source={{ uri: currentSlideImage }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))
          : new Array(3).map((_, index) => (
              <View
                style={{ width: width - screenHorizontalPadding * 2, height: "100%" }}
                key={index}
              >
                <Image source={slidesPlaceholder} style={{ width: "100%", height: "100%" }} />
              </View>
            ))}
      </Carousel>

      {/* menu view */}
      <View style={styles.menuView}>
        {MENU_ITEMS.map((currentItem, index) => (
          <Pressable
            key={currentItem.item + index}
            style={styles.menuItemView}
            onPress={() => handleMenuItemPressed(currentItem.item)}
          >
            <View style={styles.menuItemIconView}>{currentItem.icon()}</View>
            <Text
              style={{
                textAlign: "justify",
                marginTop: 8,
                fontFamily: "Inter-Medium",
                color: colors.bodyText,
                fontSize: mscale(12),
              }}
            >
              {currentItem.item}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  greetUserText: { fontFamily: "Inter-Bold", fontSize: mscale(16), color: colors.black },
  menuView: {
    backgroundColor: "#F9F1FE",
    marginTop: hscale(24),
    borderRadius: mscale(20),
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    justifyContent: "center",
    gap: 8,
    paddingVertical: hscale(20),
  },
  menuItemView: {
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    paddingVertical: hscale(20),
    height: "auto",
    maxWidth: wscale(80),
    minWidth: wscale(80),
  },
  menuItemIconView: {
    backgroundColor: colors.primary,
    height: hscale(40),
    width: wscale(40),
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
