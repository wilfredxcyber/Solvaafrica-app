import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import RNScreenshotPrevent from "rn-screenshot-prevent";
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { useKeepAwake } from "expo-keep-awake";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { RootStackNavigation } from "./navigations/RootStackNavigation";
import { bootstrapApp } from "./helpers/bootstrapApp";
import { useAuthStore } from "./stores/authStore";
import ToastManager from "toastify-react-native";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function App() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const queryClient = new QueryClient();
  useReactQueryDevTools(queryClient);

  RNScreenshotPrevent.enabled(true);

  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
  });

  process.env.NODE_ENV === "development" && useKeepAwake();
  useEffect(() => {
    (async () => {
      await bootstrapApp();

      if (!isLoading) {
        SplashScreen.hide();
      }
    })();
  }, [isLoading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <ToastManager />
            <RootStackNavigation />
          </QueryClientProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
