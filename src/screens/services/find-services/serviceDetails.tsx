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
  useFocusEffect,
  useNavigation,
  RouteProp,
  StaticScreenProps,
} from "@react-navigation/native";
// import { StaticScreenProps } from "@/src/types";
import { globalStyles } from "@/src/styles/global";
import { hscale, mscale, wscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import ErrorModal from "@/src/components/errorModal";

// Define a type for your freelancer items
type Freelancer = {
  id: number;
  fullName: string;
  bio: string;
  phoneNumber: string;
  portfolioLink: string;
  profilePic: string;
  startingAmount: string;
  whatsappLink: string;
};

// Props for this screen
type Props = StaticScreenProps<{ service: { id: number; title: string } }>;

const ServiceDeets = ({ route }: Props) => {
  const { service } = route.params;
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  const [loading, setLoading] = useState(true);
  const [serviceDetails, setServiceDetails] = useState<Freelancer[]>([]);
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
          if (response.status === 200) {
            setServiceDetails(response.data.data);
          }
        } catch (error) {
          console.error(error);
          setErrorMessage("Something went wrong while fetching services!");
          setErrorVisible(true);
        } finally {
          setLoading(false);
        }
      };

      getServices();
    }, [service.id])
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
          data={serviceDetails}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: mscale(10) }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("App", {
                    screen: "ReadServiceProfile",
                    params: { userData: item },
                  })
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
                  source={{ uri: item.profilePic }}
                  style={{
                    width: wscale(80),
                    height: hscale(80),
                    borderRadius: mscale(80) / 2,
                  }}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Inter-Bold",
                      fontSize: mscale(16),
                      color: colors.black,
                      flexShrink: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {item.fullName}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      fontSize: mscale(14),
                      color: colors.black,
                      flexShrink: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {item.bio}
                  </Text>
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: mscale(13),
                      textAlign: "right",
                      fontFamily: "Inter-Bold",
                      marginTop: mscale(10),
                    }}
                  >
                    From NGN {item.startingAmount}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
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
