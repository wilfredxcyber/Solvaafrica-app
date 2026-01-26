import { Drawer } from 'expo-router/drawer';
import Icon from "@expo/vector-icons/AntDesign";
import { StyleSheet } from "react-native";
import CustomDrawer from '@/src/components/customDrawer';
import { colors } from '@/src/constants/theme';
import { hscale, mscale } from '@/src/helpers/metric';

export default function SettingsLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveTintColor: colors.primary,
        drawerItemStyle: {
          marginBottom: hscale(12),
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: "#C9CFC9",
        },
        drawerActiveBackgroundColor: "transparent",
        drawerStyle: { 
          borderTopRightRadius: 0, 
          overflow: "hidden", 
          borderBottomRightRadius: 0 
        },
        drawerLabelStyle: { 
          fontFamily: "Inter-Regular", 
          fontSize: mscale(16) 
        },
        drawerContentStyle: { paddingHorizontal: 0 },
        drawerContentContainerStyle: { paddingHorizontal: 0 },
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: "Inter-Bold", fontSize: 16 },
      }}
    >
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profile',
          title: 'Profile',
          drawerIcon: ({ color }) => (
            <Icon name="user" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="complaints"
        options={{
          drawerLabel: 'Complaints',
          title: 'Complaints',
          drawerIcon: ({ color }) => (
            <Icon name="exclamationcircleo" size={24} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}