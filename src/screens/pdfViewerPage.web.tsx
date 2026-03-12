import {
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pdf from "react-native-pdf";
import { hscale } from "../helpers/metric";

export default function PdfViewerPage() {
  const { id } = useLocalSearchParams();

  const [pdfUri, setPdfUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const stored = await AsyncStorage.getItem("DownloadRefs");
        const list = stored ? JSON.parse(stored) : [];

        const file = list[id ? Number(id) : 0];

        if (file?.sourceUrl) {
          setPdfUri(file.sourceUrl.trim());
        }
      } catch (err) {
        console.log("PDF load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [id]);

  const source = useMemo(
    () =>
      pdfUri
        ? {
            uri: pdfUri,
            cache: true,
            headers: { Accept: "application/pdf" },
          }
        : null,
    [pdfUri],
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading PDF...</Text>
      </View>
    );
  }

  if (!source) {
    return (
      <View style={styles.loader}>
        <Text>PDF not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        style={styles.pdf}
        trustAllCerts={false}
        onLoadComplete={(pages) => console.log("Pages:", pages)}
        onPageChanged={(page) => console.log("Page:", page)}
        onError={(err) => console.log("PDF error:", err)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hscale(25),
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
