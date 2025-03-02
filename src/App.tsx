import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useKeepAwake } from 'expo-keep-awake';
import * as Linking from 'expo-linking';
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
  const navigation = useNavigation();

  const url = Linking.useURL();

  if (url) {
    const { queryParams } = Linking.parse(url);
    const includesTransactionRef = JSON.stringify(queryParams).includes('trxref')
    if (includesTransactionRef) {
      navigation.navigate('App', { screen: 'Courses' })
    }
  }

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