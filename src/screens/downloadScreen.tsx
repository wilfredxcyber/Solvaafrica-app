import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { useEffect } from "react";

export default function DownloadScreen() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Download Screen</Text>
    </View>
  );
}
