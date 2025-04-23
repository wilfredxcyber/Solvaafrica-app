import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
  UploadFilePreviewScreen,
  PdfViewerPage,
  Cashout,
  Grants,
  ScholarshipScreen,
  CertificateOnCourses,
  Innovation,
  Theraphy,
  Notifications,
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
        PdfViewer: {
          screen: PdfViewerPage,
          options: { headerShown: false },
        },
        CourseDownloadMaterial: { screen: DownloadCourseMaterial },
        Projects: { screen: ProjectsScreen },
        Premium: {
          screen: PremiumScreen,
          options: {
            headerTitle: "Premium",
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: "Inter-Bold", fontSize: 16 },
            headerTintColor: colors.black,
          },
        },
        Grants: {
          screen: Grants,
          options: {
            headerTitle: "Grant Information",
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: "Inter-Bold", fontSize: 16 },
            headerTintColor: colors.black,
          },
        },
        Scholarship: {
          screen: ScholarshipScreen,
          options: {
            headerTitle: "Scholarship Information",
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: "Inter-Bold", fontSize: 16 },
            headerTintColor: colors.black,
          },
        },
        CourseCertificate: {
          screen: CertificateOnCourses,
          options: {
            headerTitle: "Cetificate on short courses",
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: "Inter-Bold", fontSize: 16 },
            headerTintColor: colors.black,
          },
        },
        Innovation: {
          screen: Innovation,
          options: {
            headerTitle: "Innovation/Angel investors news",
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: "Inter-Bold", fontSize: 16 },
            headerTintColor: colors.black,
          },
        },
        Theraphy: {
          screen: Theraphy,
          options: {
            headerTitle: "Theraphy",
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: "Inter-Bold", fontSize: 16 },
            headerTintColor: colors.black,
          },
        },
        Upload: {
          screen: UploadFilesScreen,
          options: {
            statusBarBackgroundColor: colors.primary,
            statusBarStyle: "light",
            headerShown: false,
          },
        },
        Notifications: {
          screen: Notifications,
          options: { headerTitle: "Notifications" },
        },
        UploadPreview: {
          screen: UploadFilePreviewScreen,
          options: { headerTitle: "" },
        },
        Earning: {
          screen: EarningScreen,
          options: { headerTitle: "Earnings" },
        },
        Cashout: { screen: Cashout },
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
