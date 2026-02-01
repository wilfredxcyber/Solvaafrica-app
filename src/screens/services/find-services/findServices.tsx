import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { globalStyles } from "@/src/styles/global";
import { data } from "@/src/stores/jobData";
import { hscale, mscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import { ServiceType } from "@/src/types";
import ErrorModal from "@/src/components/errorModal";

const getIconName = (title: string): keyof typeof MaterialIcons.glyphMap => {
  switch (title) {
    case "Graphics & Design":
      return "brush";
    case "Digital Marketing":
      return "campaign";
    case "Programming & Tech":
      return "code";
    case "Video & Animation":
      return "video-call";
    default:
      return "work";
  }
};

export default function FindServices() {
  const navigation = useNavigation();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
    useEffect(() => {
      const getServices = async () => {
        try {
          setLoading(true);
          const response = await AUTH_API_CLIENT.get("/freelancers/catigories");
          console.log(response);
          if (response.status === 200) {
            setServices(response.data.data);
            console.log(response.data, "services");
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
    }, [])
  
  return (
    <View style={globalStyles.screen}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={services}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("App", {
                  screen: "ServiceDeets",
                  params: { service: item },
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: mscale(10),
                marginBottom: hscale(20),
                //   borderBottomWidth: 1,
                //   borderBottomColor: "black",
                paddingBottom: mscale(5),
              }}
            >
              <MaterialIcons
                name={getIconName(item.title)}
                size={26}
                color={colors.primary}
              />
              <View>
                <Text
                  style={{
                    fontSize: mscale(22),
                    fontFamily: "Inter-Bold",
                    color: colors.primary,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: mscale(16),
                    color: "black",
                  }}
                >
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: hscale(20) }}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                marginTop: hscale(20),
                fontFamily: "Inter-Regular",
                color: colors.black,
              }}
            >
              No services available at the moment.
            </Text>
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: hscale(10) }}
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
