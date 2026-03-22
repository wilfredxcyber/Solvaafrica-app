// app/(tabs)/settings/_layout.tsx
import { Drawer } from "expo-router/drawer";
import Icon from "@expo/vector-icons/AntDesign";
import { StyleSheet } from "react-native";
import CustomDrawer from "@/src/components/customDrawer";
import { colors } from "@/src/constants/theme";
import { hscale, mscale } from "@/src/helpers/metric";

export default function SettingsLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerPosition: "left",
        drawerType: "permanent", // This makes the drawer always visible
        drawerStyle: {
          width: "100%", // Fixed width for drawer
          backgroundColor: "#F5F3FF",
          borderTopRightRadius: 0,
          overflow: "hidden",
          borderBottomRightRadius: 0,
        },
        overlayColor: "transparent", // No overlay to prevent closing
        swipeEnabled: false, // Disable swipe to close
        drawerActiveTintColor: colors.primary,
        drawerItemStyle: {
          marginBottom: hscale(12),
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: "#C9CFC9",
        },
        drawerActiveBackgroundColor: "transparent",
        drawerLabelStyle: {
          fontFamily: "Inter-Regular",
          fontSize: mscale(16),
        },
        headerShown: false, // Hide header since we have custom drawer
      }}
    >
      {/* Only ONE screen that shows the drawer content */}
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Settings",
          title: "Settings",
        }}
      />
    </Drawer>
  );
}
