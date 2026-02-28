import { Dimensions, StyleSheet, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import Pdf from "react-native-pdf";
import { hscale } from "../helpers/metric";
import { normalizeRemoteFileUrl } from "../helpers/normalizeRemoteFileUrl";

function safeDecodeOnce(value: string) {
  // If the param looks like it's URL-encoded (contains %3A, %2F, etc), decode once.
  // If it's already decoded, this does nothing harmful.
  try {
    if (/%[0-9A-Fa-f]{2}/.test(value)) return decodeURIComponent(value);
    return value;
  } catch {
    return value;
  }
}

export default function PdfViewerPage() {
  const params = useLocalSearchParams<{ pdfUri?: string; url?: string }>();
  const [loading, setLoading] = useState(true);

  const pdfUri = useMemo(() => {
    const raw = (params.pdfUri || params.url || "").toString();
    const decodedOnce = safeDecodeOnce(raw);
    return normalizeRemoteFileUrl(decodedOnce);
  }, [params.pdfUri, params.url]);

  const pdfSource = { uri: pdfUri, cache: true };

  return (
    <View style={styles.container}>
      <Pdf
        source={pdfSource}
        onLoadComplete={(numberOfPages: number) => {
          console.log(`Number of pages: ${numberOfPages}`);
          setLoading(false);
        }}
        onError={(error: any) => {
          console.log("Error viewing pdf", error);
          setLoading(false);
        }}
        style={styles.pdf}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
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
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});