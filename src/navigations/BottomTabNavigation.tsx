import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabIcon from '@expo/vector-icons/Ionicons';
import { Pressable, Text } from "react-native";

import { DownloadScreen, FilterScreen, HomeScreen } from "../screens";
import { hscale, mscale } from "../helpers/metric";
import SettingsDrawer from "./DrawerNavigation";
import { colors } from "../constants/theme";


const TabsNavigator = createBottomTabNavigator({
    screens: { HomeTab: HomeScreen, FilterTab: FilterScreen, DownloadTab: DownloadScreen, SettingsTab: SettingsDrawer },
    screenOptions: ({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactiveTintColor,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
            elevation: 0, // Remove shadow for Android
            shadowOpacity: 0, // Remove shadow for iOS
            borderTopWidth: 0, // Remove border for iOS
            height: hscale(60)
        },
        tabBarButton: (props) => (<Pressable {...props} />),
        tabBarLabel: ({ focused }) => {
            let tabBarTitle;

            if (route.name === 'HomeTab') {
                tabBarTitle = 'Home'
            } else if (route.name === 'FilterTab') {
                tabBarTitle = 'Filter'
            } else if (route.name === 'DownloadTab') {
                tabBarTitle = 'Downloads'
            } else if (route.name === 'SettingsTab') {
                tabBarTitle = 'Settings'
            }

            return <Text style={{ fontFamily: 'Inter-Medium', fontSize: mscale(12), color: focused ? colors.primary : colors.tabBarInactiveTintColor }}>{tabBarTitle}</Text>;
        },
        tabBarIcon: ({ focused, color, size }) => {
            let iconName: 'home' | 'home-outline' | 'filter' | 'filter-outline' | 'cloud-download' | 'cloud-download-outline' | 'settings' | 'settings-outline' | undefined;

            if (route.name === 'HomeTab') {
                iconName = focused ? 'home' : 'home-outline'
            } else if (route.name === 'FilterTab') {
                iconName = focused ? 'filter' : 'filter-outline'
            } else if (route.name === 'DownloadTab') {
                iconName = focused ? 'cloud-download' : 'cloud-download-outline'
            } else if (route.name === 'SettingsTab') {
                iconName = focused ? 'settings' : 'settings-outline'
            }

            return <TabIcon name={iconName} color={color} size={20} />
        }
    }),
});

export default TabsNavigator