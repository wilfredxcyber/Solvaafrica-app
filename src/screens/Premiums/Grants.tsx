import {
  View,
  Text,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "@/src/styles/global";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import ErrorModal from "@/src/components/errorModal";
import { hscale, mscale, wscale } from "@/src/helpers/metric";
import EmptyStateView from "@/src/components/emptyStateView";
import LottieView from "lottie-react-native";

export default function Grants() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getGrants = async () => {
      setLoading(true);
      try {
        const response = await AUTH_API_CLIENT.get("/grants");
        if (response.status === 200) {
          console.log("Grants data", response.data.data);
          setData(response.data?.data || []);
        }
      } catch (error: any) {
        let message = "Something went wrong!";

        setErrorMessage(message);
        setErrorVisible(true);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getGrants();
  }, []);

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  //capitalise first letter
  const capitalizeFirstLetter = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <View style={globalStyles.screen}>
      <View>
        {loading ? (
          <View
            style={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LottieView
              autoPlay
              style={{
                width: wscale(50),
                height: hscale(50),
                alignSelf: "center",
              }}
              source={require("../../../assets/animations/spin.json")}
            />
            <Text>Loading, Please wait!</Text>
          </View>
        ) : data.length === 0 ? (
          <EmptyStateView />
        ) : (
          data.map((item) => (
            <View style={styles.card} key={item.id}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.description}>
                {capitalizeFirstLetter(item.description)}
              </Text>
              <Text
                style={styles.link}
                onPress={() => handleOpenLink(item.link)}
              >
                Click link to open:{" "}
                <Text
                  style={{
                    color: "blue",
                    textDecorationLine: "underline",
                  }}
                >
                  {" "}
                  {item.link}
                </Text>
              </Text>
            </View>
          ))
        )}
      </View>

      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f5f5",
    padding: mscale(16),
    marginBottom: mscale(12),
    borderRadius: mscale(8),
  },
  title: {
    fontSize: mscale(18),
    fontFamily: "Inter-Bold",
    marginBottom: mscale(4),
  },
  description: {
    fontSize: mscale(14),
    fontFamily: "Inter-Regular",
    marginBottom: mscale(6),
  },
  link: {
    fontSize: mscale(13),
    fontFamily: "Inter-Regular",
  },
  emptyText: {
    textAlign: "center",
    marginTop: mscale(50),
    fontSize: mscale(16),
    fontFamily: "Inter-Regular",
    color: "#999",
  },
  loadingText: {
    textAlign: "center",
    marginTop: mscale(50),
    fontSize: mscale(16),
    fontFamily: "Inter-Regular",
  },
});
