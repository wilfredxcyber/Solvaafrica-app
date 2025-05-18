import { Text, View } from "react-native";
import { globalStyles } from "../styles/global";
import InProgress from "../components/inprogress";

export default function ServicesScreen() {
  return (
    <View style={globalStyles.screen}>
      {/* <Text>Services screen</Text> */}
      <InProgress/>
    </View>
  );
}
