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
import { useFocusEffect, useRouter, useLocalSearchParams } from "expo-router";
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

// Define service type
type Service = {
  id: number;
  title: string;
};

const ServiceDeets = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse service from params
  const service: Service = params.service 
    ? JSON.parse(params.service as string)
    : null;

  const screenWidth = Dimensions.get("window").width;

  const [loading, setLoading] = useState(true);
  const [serviceDetails, setServiceDetails] = useState<Freelancer[]>([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (!service?.id) return;

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
    }, [service?.id])
  );

  // In Expo Router, you typically set the title in the layout file
  // or use a custom header. You can also use the `useLayoutEffect` 
  // with router.setOptions if you're using a Stack layout
  useLayoutEffect(() => {
    if (service?.title) {
      // If you're using Expo Router with Stack layout, you can set options like this:
      // router.setOptions({ title: service.title });
      // Alternatively, set the title in your _layout.tsx file
    }
  }, [service?.title]);

  const handleFreelancerPress = (freelancer: Freelancer) => {
    router.push({
      pathname: "/(services)/find-service/read-service",
      params: { userData: JSON.stringify(freelancer) }
    });
  };

  // Show loading if service is not available yet
  if (!service) {
    return (
      <View style={[globalStyles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: mscale(10), fontFamily: "Inter-Regular" }}>
          Loading service data...
        </Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      {/* Service Title Header */}
      <View style={{
        paddingHorizontal: mscale(16),
        paddingVertical: mscale(12),
        marginBottom: mscale(10),
      }}>
        <Text style={{
          fontSize: mscale(20),
          fontFamily: "Inter-Bold",
          color: colors.black,
          textAlign: "center",
        }}>
          {service.title}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={serviceDetails}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: mscale(10) }}>
              <TouchableOpacity
                onPress={() => handleFreelancerPress(item)}
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
          contentContainerStyle={{ paddingBottom: hscale(20), paddingHorizontal: mscale(16) }}
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