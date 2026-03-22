import {
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import { hscale } from "../helpers/metric";

export default function PdfViewerPage() {
  const { id } = useLocalSearchParams();

  const [viewerUrl, setViewerUrl] = useState(null);
  const [webLoading, setWebLoading] = useState(true);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const stored = await AsyncStorage.getItem("DownloadRefs");
        const list = stored ? JSON.parse(stored) : [];

        const file = list[id ? Number(id) : 0];

        if (file?.sourceUrl) {
          const clean = file.sourceUrl.trim();

          const googleViewer =
            "https://docs.google.com/gview?embedded=true&url=" +
            encodeURIComponent(clean);

          setViewerUrl(googleViewer);
        }
      } catch (err) {
        console.log("PDF load error:", err);
      }
    };

    loadFile();
  }, [id]);

  if (!viewerUrl) {
    return (
      <View style={styles.loader}>
        <Text>PDF not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {webLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
          <Text>Opening PDF...</Text>
        </View>
      )}

      <WebView
        source={{ uri: viewerUrl }}
        style={styles.webview}
        originWhitelist={["*"]}
        onLoadStart={() => setWebLoading(true)}
        onLoadEnd={() => setWebLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hscale(25),
  },
  webview: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    zIndex: 10,
  },
});
