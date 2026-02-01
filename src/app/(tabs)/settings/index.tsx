//mport Profile from "../../../screens/Drawer/Profile";

//export default Profile;

import { View, Text } from "react-native";
import { globalStyles } from "@/src/styles/global";

export default function SettingsIndex() {
  return (
    <View style={globalStyles.screen}>
      {/* This screen will be shown to the right of the drawer */}
      {/* But since drawer is permanent and takes full width, this might not be visible */}
      {/* You might want to adjust the drawer width or show a welcome message here */}
    </View>
  );
}