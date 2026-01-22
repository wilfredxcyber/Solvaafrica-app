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
  ForgotPasswordOtp,
  ForgotPassword,
  ForgotPasswordSuccess,
} from "../screens";
import { useUserSignedIn, useUserSignedOut } from "../hooks/userAuth";
import TabsNavigator from "./BottomTabNavigation";
import { colors } from "../constants/theme";
import Task from "../screens/Premiums/Task";

const AppStackNavigator = createNativeStackNavigator(
  {
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
        Task: {
          screen: Task,
          options: {
            headerTitle: "Task",
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: "Inter-Bold", fontSize: 16 },
            headerTintColor: colors.black,
          }
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
        forgotPassword: {
          screen: ForgotPassword,
          options: { headerShown: false },
        },
        otpforgotPassword: {
          screen: ForgotPasswordOtp,
          options: { headerShown: false },
        },
        forgotPasswordSuccess: {
          screen: ForgotPasswordSuccess,
          options: { headerShown: false },
        },
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
}
);

const AppStack = () => {
  return (
    <AppStackNavigator.Navigator>
      <AppStackNavigator.Screen name="Onboarding" component={OnboardScreen} />
      <AppStackNavigator.Screen name="Login" component={LoginScreen} />
      <AppStackNavigator.Screen name="CreateAccount" component={CreateAccountScreen} />
      <AppStackNavigator.Screen name="Courses" component={CoursesScreen} />
      <AppStackNavigator.Screen name="Ask" component={AskScreen}/>
      
      {/* Add other necessary screens like Dashboard, Profile, etc. */}
    </AppStackNavigator.Navigator>
  );
};


export { AppStackNavigator };
 