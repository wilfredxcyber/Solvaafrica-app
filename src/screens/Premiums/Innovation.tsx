import { View, Text, ToastAndroid, Linking, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "@/src/styles/global";
import InProgress from "@/src/components/inprogress";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import LottieView from "lottie-react-native";
import { hscale, mscale, wscale } from "@/src/helpers/metric";
import EmptyStateView from "@/src/components/emptyStateView";

export default function Innovation() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await AUTH_API_CLIENT.get("/innovations");
        const innovation = res.data?.data || [];

        setData([...innovation]);
      } catch (error: any) {
        ToastAndroid.show("Something went wrong!", ToastAndroid.LONG);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
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
          data.map((item, index) => (
            <View style={styles.card} key={index}>
              {/* <Text style={styles.title}>{item.name}</Text> */}
              {/* <Text style={styles.description}>
                {capitalizeFirstLetter(item.description)}
              </Text> */}
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