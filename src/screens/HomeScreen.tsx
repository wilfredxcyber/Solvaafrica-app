import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  Linking,
  Alert,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import Carousel from "pinar";

import { colors, screenHorizontalPadding } from "../constants/theme";
import { hscale, mscale, wscale } from "../helpers/metric";
import { useAuthStore } from "../stores/authStore";
import AvatarView from "../components/avatarView";
import { getSliderImages } from "../api/queries";
import { globalStyles } from "../styles/global";
import { fetchUnreadCount } from "../api/mutations";

enum MenuItemScreensRoutes {
  "COURSES" = "Courses",
  "PROJECTS" = "Projects",
  "UPLOAD" = "Upload PQs/Projects",
  "PREMIUM" = "Premium",
  "EARNING" = "Earning",
  "SERVICES" = "Services",
  "ASK" = "Ask Kemi",
  "ESCROW_SITE" = "Transecure Escrow",
}

interface IMenuItems {
  item: MenuItemScreensRoutes;
  icon: any;
}

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation();
  const userProfile = user.profile;
  const { width } = Dimensions.get("window");
  const [isSubscribed, setIsSubscribed] = useState(true);

  const MENU_ITEMS: IMenuItems[] = [
    {
      item: MenuItemScreensRoutes.COURSES,
      icon: require("../../assets/images/dashImgs/courses.png"),
    },
    {
      item: MenuItemScreensRoutes.PROJECTS,
      icon: require("../../assets/images/dashImgs/files.png"),
    },
    {
      item: MenuItemScreensRoutes.UPLOAD,
      icon: require("../../assets/images/dashImgs/upload.png"),
    },
    {
      item: MenuItemScreensRoutes.PREMIUM,
      icon: require("../../assets/images/dashImgs/premium.png"),
    },
    {
      item: MenuItemScreensRoutes.EARNING,
      icon: require("../../assets/images/dashImgs/naira.png"),
    },
    {
      item: MenuItemScreensRoutes.SERVICES,
      icon: require("../../assets/images/dashImgs/tag.png"),
    },
    {
      item: MenuItemScreensRoutes.ASK,
      icon: require("../../assets/images/dashImgs/ask.png"),
    },
    {
      item: MenuItemScreensRoutes.ESCROW_SITE,
      icon: require("../../assets/images/dashImgs/secure.png"),
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
      return;
    } else if (pressedItem === MenuItemScreensRoutes.EARNING) {
      navigation.navigate("App", { screen: "Earning" });
    } else if (pressedItem === MenuItemScreensRoutes.SERVICES) {
      navigation.navigate("App", { screen: "InitialServices" });
      return;
    } else if (pressedItem === MenuItemScreensRoutes.ASK) {
      navigation.navigate("App", { screen: "Ask" });
      return;
    } else if (pressedItem === MenuItemScreensRoutes.ESCROW_SITE) {
      ToastAndroid.show("Platform in progress", ToastAndroid.LONG);
      // Linking.openURL("https://www.solvaafrica.com/").catch((error) => {
      //   Alert.alert("URL Error!", error?.message ?? "Could not open link");
      // });
    }
    return;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["homeScreenSliders"],
    queryFn: getSliderImages,
  });

  // HomeScreen.tsx
  const { data: unreadCount = 0, refetch } = useQuery({
    queryKey: ["unreadNotificationCount"],
    queryFn: fetchUnreadCount,
    staleTime: 0,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("App", { screen: "Notifications" })
          }
          style={{ position: "relative" }}
        >
          <Icon name="bell" color={colors.primary} size={24} />

          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Carousel
        height={hscale(150)}
        showsControls={false}
        autoplay
        autoplayInterval={2000}
        loop
        pagingEnabled
        bounces
        activeDotStyle={{ backgroundColor: colors.primary }}
        dotStyle={{ backgroundColor: colors.sliderDotsInactive }}
        dotsContainerStyle={{ bottom: hscale(-20) }}
        mergeStyles
      >
        {isLoading || !data || data.length === 0
          ? new Array(3).fill(null).map((_, index) => (
              <View
                key={`placeholder-${index}`}
                style={{
                  width: width - screenHorizontalPadding * 2,
                  height: "100%",
                }}
              >
                <Image
                  source={require("../../assets/images/placeholder.png")}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
            ))
          : data.map((imageUri, index) => (
              <View
                key={`slide-${index}`}
                style={{
                  width: width - screenHorizontalPadding * 2,
                  height: "100%",
                }}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: mscale(10),
                  }}
                  resizeMode="cover"
                />
              </View>
            ))}
      </Carousel>

      <View style={styles.menuView}>
        {MENU_ITEMS.map((currentItem, index) => (
          <Pressable
            key={currentItem.item + index}
            style={styles.menuItemView}
            onPress={() => handleMenuItemPressed(currentItem.item)}
          >
            <View style={styles.menuItemIconView}>
              <Image
                style={{
                  width: wscale(26),
                  height: hscale(26),
                  resizeMode: "contain",
                }}
                source={currentItem.icon}
              />
            </View>
            <Text
              style={{
                textAlign: "center",
                marginTop: 3,
                fontFamily: "Inter-semibold",
                color: "black",
                fontSize: mscale(13),
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
  greetUserText: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(16),
    color: colors.black,
  },
  menuView: {
    backgroundColor: "#ECECEC",
    marginTop: hscale(24),
    borderRadius: mscale(16),
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    justifyContent: "center",
    gap: mscale(24),
    padding: hscale(10),
  },
  menuItemView: {
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    paddingVertical: hscale(10),
    height: "auto",
    maxWidth: wscale(80),
    minWidth: wscale(80),
  },
  menuItemIconView: {
    backgroundColor: "white",
    padding: mscale(8),
    width: wscale(50),
    height: hscale(50),
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontFamily: "Inter-Bold",
  },
});
