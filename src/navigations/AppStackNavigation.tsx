import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import {
  AskScreen,
  CourseMaterials,
  CoursesList,
  CoursesScreen,
  CreateAccountScreen,
  DownloadCourseMaterial,
  EarningScreen,
  ImageViewerPage,
  LoginScreen,
  OnboardScreen,
  PremiumScreen,
  ProjectsScreen,
  ServicesScreen,
  TermsAndConditions,
  UploadFilesScreen,
} from "../screens";
import { useUserSignedIn, useUserSignedOut } from "../hooks/userAuth";
import TabsNavigator from "./BottomTabNavigation";
import { colors } from "../constants/theme";

const AppStackNavigator = createNativeStackNavigator({
  groups: {
    SignedInUser: {
      if: useUserSignedIn,
      screens: {
        BottomTabs: { screen: TabsNavigator, options: { headerShown: false } },
        Courses: { screen: CoursesScreen },
        CoursesList: {
          screen: CoursesList,
          options: { headerTitle: "Courses" },
        },
        CourseMaterials: { screen: CourseMaterials },
        ImageViewer: {
          screen: ImageViewerPage,
          options: {
            headerShown: false,
            statusBarStyle: "light",
            statusBarBackgroundColor: colors.black,
          },
        },
        CourseDownloadMaterial: { screen: DownloadCourseMaterial },
        Projects: { screen: ProjectsScreen },
        Premium: { screen: PremiumScreen },
        Upload: {
          screen: UploadFilesScreen,
          options: {
            statusBarBackgroundColor: colors.primary,
            statusBarStyle: "light",
            headerShown: false,
          },
        },
        Earning: { screen: EarningScreen },
        Services: { screen: ServicesScreen },
        Ask: { screen: AskScreen },
      },
      screenOptions: {
        animation: "slide_from_right",
        headerShadowVisible: false,
      },
    },
    SignedOutUser: {
      if: useUserSignedOut,
      screens: {
        Onboard: { screen: OnboardScreen, options: { headerShown: false } },
        CreateAccount: {
          screen: CreateAccountScreen,
          options: { headerShown: false },
        },
        Login: { screen: LoginScreen, options: { headerShown: false } },
        Terms: {
          screen: TermsAndConditions,
          options: {
            headerTitle: "Terms and Conditions",
            headerShadowVisible: false,
          },
        },
      },
    },
  },
  screenOptions: {
    statusBarStyle: "dark",
    statusBarBackgroundColor: "#ffffff",
    headerTitleStyle: { fontFamily: "Inter-Bold", fontSize: 16 },
  },
});

export { AppStackNavigator };
