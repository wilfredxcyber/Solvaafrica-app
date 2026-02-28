import { Dimensions, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { hscale } from "../helpers/metric";
import { normalizeRemoteFileUrl } from "../helpers/normalizeRemoteFileUrl";

function safeDecodeOnce(value: string) {
  try {
    if (/%[0-9A-Fa-f]{2}/.test(value)) return decodeURIComponent(value);
    return value;
  } catch {
    return value;
  }
}

export default function PdfViewerPageWeb() {
  const params = useLocalSearchParams<{ pdfUri?: string; url?: string }>();

  const pdfUri = useMemo(() => {
    const raw = (params.pdfUri || params.url || "").toString();
    const decodedOnce = safeDecodeOnce(raw);
    return normalizeRemoteFileUrl(decodedOnce);
  }, [params.pdfUri, params.url]);

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  return (
    <View style={styles.container}>
      <iframe
        src={pdfUri}
        style={{ width, height, border: "none" }}
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