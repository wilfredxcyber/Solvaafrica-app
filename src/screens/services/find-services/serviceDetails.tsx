import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  StaticScreenProps,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { ServiceType } from "@/src/types";
import { globalStyles } from "@/src/styles/global";
import { hscale, mscale, wscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import ErrorModal from "@/src/components/errorModal";

type Props = StaticScreenProps<{ service: ServiceType }>;

const ServiceDeets = ({ route }: Props) => {
  const { service } = route.params;
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  const [loading, setLoading] = useState(true);

  const [ServiceDeets, setServiceDetails] = useState<any[]>([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useFocusEffect(
    useCallback(() => {
      const getServices = async () => {
        try {
          setLoading(true);
          const response = await AUTH_API_CLIENT.get(
            `/freelancers?category=${service.id}`
          );
          console.log(response);
          if (response.status === 200) {
            setServiceDetails(response.data.data);
          }
        } catch (error) {
          setErrorMessage("Something went wrong while fetching services!");
          setErrorVisible(true);
        } finally {
          setLoading(false);
        }
      };

      getServices();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: service.title,
    });
  }, [navigation, service.title]);

  return (
    <View style={globalStyles.screen}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={ServiceDeets}
          renderItem={({ item }) => (
            <View style={{ marginBottom: mscale(10) }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("App", { screen: "ServiceProfile" })
                }
                style={{
                  backgroundColor: "#EBEDEB80",
                  borderRadius: mscale(18),
                  paddingHorizontal: mscale(10),
                  paddingVertical: mscale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: mscale(10),
                }}
              >
                <Image
                  source={require("@/assets/images/services/Image.png")}
                  style={{
                    width: wscale(35),
                    height: hscale(35),
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: mscale(18),
                      color: colors.black,
                      flexShrink: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {item.personDesc}
                  </Text>
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: mscale(16),
                      textAlign: "right",
                      fontFamily: "Inter-Bold",
                      marginTop: mscale(10),
                    }}
                  >
                    From NGN {item.minPrice}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => item.personDesc + index}
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
};

export default ServiceDeets;
