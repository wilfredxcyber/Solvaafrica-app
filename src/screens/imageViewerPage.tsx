import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { StaticScreenProps } from "@react-navigation/native";
import { View } from "react-native";
import { Image } from "expo-image";

import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import { hscale } from "../helpers/metric";

const ImageViewerPage = ({ route }: StaticScreenProps<{ imageSource: string }>) => {
  return (
    <View style={[globalStyles.screen, { backgroundColor: colors.black }]}>
      <Zoomable style={{ justifyContent: "center" }}>
        <Image source={route.params.imageSource} style={{ height: hscale(500), width: "100%" }} />
      </Zoomable>
    </View>
  );
};

export default ImageViewerPage;
