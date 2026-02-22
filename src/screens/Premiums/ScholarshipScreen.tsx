import {
  View,
  Text,
  StyleSheet,
  Linking,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "@/src/styles/global";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import ErrorModal from "@/src/components/errorModal";
import { mscale } from "@/src/helpers/metric";
import EmptyStateView from "@/src/components/emptyStateView";
import { colors } from "@/src/constants/theme";

export default function Scholarship() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getScholarships = async () => {
      setLoading(true);
      try {
        const response = await AUTH_API_CLIENT.get("/scholarships");
        if (response.status === 200) {
          setData(response.data?.data || []);
        }
      } catch (error: any) {
        setErrorMessage("Something went wrong!");
        setErrorVisible(true);
      } finally {
        setLoading(false);
      }
    };

    getScholarships();
  }, []);

  const handleOpenLink = (url: string) => {
    if (url) Linking.openURL(url);
  };

  return (
    <View style={globalStyles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : data.length === 0 ? (
          <EmptyStateView />
        ) : (
          data.map((item) => (
            <View style={styles.card} key={item.id}>
              <Text style={styles.rowText}>
                <Text style={styles.label}>click link to open: </Text>
                <Text
                  style={styles.linkText}
                  onPress={() => handleOpenLink(item.link)}
                  suppressHighlighting
                >
                  {item.link}
                </Text>
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: mscale(16),
    paddingTop: mscale(12),
    paddingBottom: mscale(24),
  },
  loadingWrap: {
    paddingTop: mscale(24),
    alignItems: "center",
  },
  card: {
    backgroundColor: "#F2EEFF", // soft lavender like your screenshot
    borderRadius: mscale(10),
    paddingVertical: mscale(14),
    paddingHorizontal: mscale(14),
    marginBottom: mscale(14),
  },
  rowText: {
    fontSize: mscale(14),
    lineHeight: mscale(20),
    fontFamily: "Inter-Regular",
  },
  label: {
    color: "#6B7280", // muted grey
  },
  linkText: {
    color: colors.primary,
    textDecorationLine: "underline",
    fontFamily: "Inter-SemiBold", // if you don't have this font, change to "Inter-Bold"
  },
});