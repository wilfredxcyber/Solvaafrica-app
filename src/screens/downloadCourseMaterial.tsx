import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { Dimensions, View } from "react-native";
import { Image } from "expo-image";
import { useEffect } from "react";

import { screenHorizontalPadding } from "../constants/theme";
import PrimaryButton from "../components/primaryButton";
import { globalStyles } from "../styles/global";
import { hscale } from "../helpers/metric";

export default function DownloadCourseMaterial({
  route,
}: StaticScreenProps<{ url: string; screenTitle: string }>) {
  const params = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: params.screenTitle });
  }, []);

  const handleDownload = () => {
    console.log("Downloading..");
  };

  return (
    <View style={globalStyles.screen}>
      <Image
        contentFit="contain"
        source={params.url}
        style={{
          width: Dimensions.get("window").width - screenHorizontalPadding * 2,
          height: hscale(500),
          marginBottom: hscale(20),
        }}
      />

      <PrimaryButton text="Download" onPress={handleDownload} />
    </View>
  );
}
