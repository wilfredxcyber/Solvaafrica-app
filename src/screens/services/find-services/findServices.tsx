import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { globalStyles } from "@/src/styles/global";
import { hscale, mscale, wscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import { ServiceType } from "@/src/types";
import ErrorModal from "@/src/components/errorModal";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";

const getIconName = (
  title: string
): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (title) {
    case "Graphics & Design":
      return "briefcase-outline";
    case "Digital Marketing":
      return "bullhorn-outline";
    case "Programming & Tech":
      return "code-tags";
    case "Video & Animation":
      return "video-plus-outline";
    case "Photography":
      return "camera-outline";
    case "Business":
      return "briefcase-variant-outline";
    case "Others":
      return "dots-horizontal";
    default:
      return "briefcase-outline";
  }
};

export default function FindServices() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getServices = async () => {
      try {
        setLoading(true);
        const response = await AUTH_API_CLIENT.get("/freelancers/catigories");
        if (response.status === 200) {
          setServices(response.data.data);
        }
      } catch (error) {
        console.error("Job fetch error:", error);
        setErrorMessage("Something went wrong while fetching services!");
        setErrorVisible(true);
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  const handleServicePress = useCallback(
    (service: ServiceType) => {
      router.push({
        pathname: "/(services)/find-service/service-details",
        params: {
          service: JSON.stringify(service),
        },
      });
    },
    [router]
  );

  return (
    <View style={globalStyles.screen}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.backBtn}
              >
                <Feather name="arrow-left" size={mscale(22)} color="black" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Categories</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleServicePress(item)}
              activeOpacity={0.85}
              style={styles.row}
            >
              <View style={styles.iconCol}>
                <MaterialCommunityIcons
                  name={getIconName(item.title)}
                  size={mscale(28)}
                  color={colors.primary}
                />
              </View>

              <View style={styles.textCol}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No services available at the moment.</Text>
          }
        />
      )}

      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: hscale(30),
    paddingTop: hscale(10),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: mscale(10),
    marginBottom: hscale(18),
    paddingTop: hscale(6),
  },

  backBtn: {
    width: wscale(34),
    height: wscale(34),
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(32),
    color: "black",
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hscale(26),
  },

  iconCol: {
    width: wscale(42),
    alignItems: "center",
    marginTop: hscale(6),
  },

  textCol: {
    flex: 1,
    paddingRight: wscale(10),
  },

  title: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(18),
    color: colors.primary,
    marginBottom: hscale(6),
  },

  desc: {
    fontFamily: "Inter-Regular",
    fontSize: mscale(14.5),
    color: "black",
    lineHeight: mscale(18),
  },

  emptyText: {
    textAlign: "center",
    marginTop: hscale(20),
    fontFamily: "Inter-Regular",
    color: colors.black,
  },
});
