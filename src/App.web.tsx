import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { useEffect } from "react";
import ToastManager from "toastify-react-native";
import * as SplashScreen from "expo-splash-screen";

import { RootStackNavigation } from "./navigations/RootStackNavigation";
import WebAppContainer from "./components/webAppContainer";

export default function App() {
  const queryClient = new QueryClient();
  useReactQueryDevTools(queryClient);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WebAppContainer>
        <ToastManager />
        <RootStackNavigation />
      </WebAppContainer>
    </QueryClientProvider>
  );
}


