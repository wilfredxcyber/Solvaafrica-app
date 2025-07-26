import { createStaticNavigation, StaticParamList } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppStackNavigator } from "./AppStackNavigation";


const RootStackNavigator = createNativeStackNavigator({
    screens: { App: AppStackNavigator },
    screenOptions: { headerShown: false },
});

const RootStackNavigation = createStaticNavigation(RootStackNavigator);

type RootStackParamList = StaticParamList<typeof RootStackNavigator>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}



export { RootStackNavigation }