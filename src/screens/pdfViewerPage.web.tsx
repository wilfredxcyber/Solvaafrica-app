import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Platform,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";

export default function PdfViewerPage() {
  const { id } = useLocalSearchParams();

  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const stored = await AsyncStorage.getItem("DownloadRefs");
        const list = stored ? JSON.parse(stored) : [];

        const file = list[id ? Number(id) : 0];

        if (file?.sourceUrl) {
          const cleanUrl = file.sourceUrl.trim();

          const url =
            "https://docs.google.com/gview?embedded=true&url=" +
            encodeURIComponent(cleanUrl);

          setViewerUrl(url);
        }
      } catch (err) {
        console.log("PDF load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [id]);

  // 🔄 Loading state
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading PDF...</Text>
      </View>
    );
  }

  // ❌ No file
  if (!viewerUrl) {
    return (
      <View style={styles.loader}>
        <Text>PDF not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <iframe src={viewerUrl} style={styles.iframe} />
      ) : (
        <WebView source={{ uri: viewerUrl }} style={styles.webview} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // optional (nice for PDFs)
  },

  webview: {
    flex: 1,
  },

  iframe: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderWidth: 0,
  } as any, // 👈 required for RN web

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
