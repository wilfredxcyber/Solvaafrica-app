import { Text, View } from "react-native";

import ProtectPage from "../components/protectPage";
import { globalStyles } from "../styles/global";


export default function ProjectsScreen() {
    return (
        <ProtectPage>
            <View style={globalStyles.screen}>
                <Text>Projects screen</Text>
            </View>
        </ProtectPage>
    )
}