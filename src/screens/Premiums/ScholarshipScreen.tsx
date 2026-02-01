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
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import ErrorModal from "@/src/components/errorModal";
import { hscale, mscale, wscale } from "@/src/helpers/metric";
import EmptyStateView from "@/src/components/emptyStateView";
import LottieView from "lottie-react-native";
import ProtectPage from "@/src/components/protectPage";
import { colors } from "@/src/constants/theme";

export default function Scholarship() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getScholarships = async () => {
      setLoading(true);
      console.log("Fetching scholarships...");
      try {
        const response = await AUTH_API_CLIENT.get("/scholarships");
        if (response.status === 200) {
          setData(response.data?.data || []);
        }
        console.log(response.data.data);
      } catch (error: any) {
        let message = "Something went wrong!";
        console.log(error);
        setErrorMessage(message);
        setErrorVisible(true);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getScholarships();
  }, []);

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const capitalizeFirstLetter = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    // <ProtectPage>
    <View style={globalStyles.screen}
    >
     <ScrollView 
     showsVerticalScrollIndicator={false}
      contentContainerStyle={{ 
        flexGrow: 1, 
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: mscale(20),
      }}
    >
      {loading ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {/* Loading content */}
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
                  color: colors.primary,
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
    </ScrollView>

      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </View>
    // </ProtectPage>
  );
}

const styles = StyleSheet.create({
 card: {
  backgroundColor: colors.inputFieldNew,
  marginBottom: mscale(15),
  borderRadius: mscale(8),
  width: "90%",
  maxWidth: 416,
  minHeight: 80,
  paddingVertical: 12,
  paddingHorizontal: 12,
  alignItems: "center",
},

  title: {
    fontSize: mscale(16),
    fontFamily: "Inter-Bold",
   // marginBottom: mscale(12),

    
    
  },
  description: {
    fontSize: mscale(16),
    fontFamily: "Inter-Regular",
   marginBottom: mscale(12),
  },
  link: {
    fontSize: mscale(16),
    fontFamily: "Inter-Regular",
    color: "#5C5F62"
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
