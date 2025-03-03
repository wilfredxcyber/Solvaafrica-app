import * as SplashScreen from 'expo-splash-screen';
import { useKeepAwake } from 'expo-keep-awake';
import { useEffect } from "react";

import { RootStackNavigation } from "./navigations/RootStackNavigation";
import { bootstrapApp } from "./helpers/bootstrapApp";
import { useAuthStore } from "./stores/authStore";


SplashScreen.setOptions({
  duration: 1000,
  fade: true
})


export default function App() {
  const isLoading = useAuthStore(state => state.isLoading);
  useKeepAwake();
  useEffect(() => {
    // bootstrap app
    (async () => {
      await bootstrapApp();

      if (!isLoading) {
        SplashScreen.hide()
      }
    })()

  }, [isLoading])
  return <RootStackNavigation />
}