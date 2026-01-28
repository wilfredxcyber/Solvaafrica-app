import { Dimensions, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { hscale } from "../helpers/metric";

export default function PdfViewerPageWeb() {
  const params = useLocalSearchParams<{ pdfUri?: string; url?: string }>();
  const pdfUri = params.pdfUri || params.url || '';

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