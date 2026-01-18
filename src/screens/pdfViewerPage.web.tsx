import { StaticScreenProps } from "@react-navigation/native";
import { Dimensions, StyleSheet, View } from "react-native";
import { hscale } from "../helpers/metric";

export default function PdfViewerPageWeb({
  route,
}: StaticScreenProps<{ pdfUri: string }>) {
  const { pdfUri } = route.params;

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  return (
    <View style={styles.container}>
      <iframe
        src={pdfUri}
        style={{
          width,
          height,
          border: "none",
        }}
        title="PDF Viewer"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: hscale(25),
  },
});


