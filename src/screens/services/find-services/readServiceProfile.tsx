import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  StaticScreenProps,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { globalStyles } from "@/src/styles/global";
import { hscale, mscale, wscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import Carousel from "pinar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/src/stores/authStore";

type Props = StaticScreenProps<{ userData: any }>;

export default function ReadServiceProfile({ route }: Props) {
  const { userData } = route.params;

  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const freelancerId = userData?.id;

  const getFreelancerInfo = async () => {
    if (!freelancerId) return;

    try {
      setLoading(true);
      const response = await AUTH_API_CLIENT.get(
        `/freelancers/${freelancerId}`
      );
      if (response.status === 200) {
        setUser(response.data.data.freelancer);
        console.log(response.data.data.freelancer, "freelancer data");
        getReviews(freelancerId);
      }
    } catch (error) {
      console.error("Failed to fetch freelancer:", error);
      setErrorMessage("Failed to load freelancer profile.");
    } finally {
      setLoading(false);
    }
  };

  const getReviews = async (id: number) => {
    try {
      setReviewLoading(true);
      const response = await AUTH_API_CLIENT.get(`/freelancers/comment/${id}`);
      if (response.status === 200) {
        setReviews(response.data.data.comments || []);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setReviewLoading(false);
    }
  };

  // refetch when screen focuses
  useFocusEffect(
    useCallback(() => {
      getFreelancerInfo();
    }, [freelancerId])
  );

  // set header title and edit button
  useLayoutEffect(() => {
    if (!user) return;
    navigation.setOptions({
      title: user.fullName,
      headerRight: () => (
        <Ionicons
          name="create-outline"
          size={24}
          color="black"
          onPress={() =>
            navigation.navigate("App", {
              screen: "ServiceEditProfile",
              params: { userData: user },
            })
          }
        />
      ),
    });
  }, [navigation, user]);

  if (loading) {
    return (
      <View
        style={[
          globalStyles.screen,
          {
            flexDirection: "column",
            justifyContent: "center",
            gap: mscale(10),
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={[
          globalStyles.screen,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: colors.primary, fontSize: mscale(16) }}>
          {errorMessage || "No profile found"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.screen}>
      {/* Profile Picture */}
      <View
        style={{
          height: hscale(123),
          width: wscale(123),
          backgroundColor: "#EBEDEB80",
          borderRadius: mscale(16),
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: "auto",
        }}
      >
        <Image
          source={{ uri: user?.profilePic }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            borderColor: colors.primary,
            borderWidth: 2,
          }}
          resizeMode="cover"
        />
      </View>

      {/* About */}
      <View>
        <Text
          style={{
            fontSize: mscale(16),
            fontFamily: "Inter-Medium",
            color: colors.black,
            marginTop: mscale(5),
          }}
        >
          About
        </Text>
        <Text
          style={{
            fontFamily: "Inter-Regular",
            color: colors.black,
            fontSize: mscale(14),
            marginVertical: mscale(5),
            lineHeight: mscale(20),
          }}
        >
          {user?.bio || "No bio available"}
        </Text>
      </View>

      {/* Portfolio */}
      <View>
        <Text
          style={{
            fontSize: mscale(16),
            fontFamily: "Inter-Medium",
            color: colors.black,
            marginTop: mscale(5),
          }}
        >
          My Portfolio
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: mscale(10),
            paddingHorizontal: mscale(10),
            paddingVertical: mscale(15),
            marginVertical: mscale(10),
          }}
        >
          {user?.portfolioLink && (
            <Pressable onPress={() => Linking.openURL(user.portfolioLink)}>
              <Text
                style={{
                  textAlign: "center",
                  color: colors.primary,
                  fontFamily: "Inter-Medium",
                  fontStyle: "italic",
                }}
              >
                Click link to view portfolio
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <Text
        style={{
          color: colors.primary,
          fontFamily: "Inter-Medium",
          fontSize: mscale(16),
          marginVertical: mscale(10),
        }}
      >
        From: NGN {user?.startingAmount || "N/A"}
      </Text>

      {/* Contact Info */}
      <View>
        <Text
          style={{
            fontSize: mscale(16),
            fontFamily: "Inter-Medium",
            color: colors.black,
            marginTop: mscale(5),
          }}
        >
          Contact Information
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: mscale(20),
            marginVertical: mscale(10),
          }}
        >
          {user?.whatsappLink && (
            <TouchableOpacity
              onPress={() => Linking.openURL(user.whatsappLink)}
              style={{ alignItems: "center", gap: mscale(10) }}
            >
              <FontAwesome6 name="whatsapp" size={20} color="green" />
              <Text style={{ color: "green", fontSize: mscale(16) }}>
                WhatsApp
              </Text>
            </TouchableOpacity>
          )}
          {user?.phoneNumber && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${user.phoneNumber}`)}
              style={{ alignItems: "center", gap: mscale(10) }}
            >
              <Entypo name="phone" size={20} color="black" />
              <Text style={{ color: "black", fontSize: mscale(16) }}>
                Phone
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Reviews */}
      <View>
        <Text
          style={{
            fontSize: mscale(16),
            fontFamily: "Inter-Medium",
            color: colors.black,
            marginTop: mscale(5),
          }}
        >
          Reviews
        </Text>
        {reviewLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : reviews.length > 0 ? (
          <Carousel
            height={hscale(180)}
            showsControls={false}
            loop
            activeDotStyle={{ backgroundColor: colors.primary }}
          >
            {reviews.map((review) => (
              <View
                key={review.id}
                style={{
                  backgroundColor: "#EBEDEB80",
                  padding: mscale(10),
                  borderRadius: mscale(16),
                  marginVertical: mscale(10),
                  height: hscale(140),
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: mscale(10),
                  }}
                >
                  <FontAwesome name="user" size={20} color="black" />
                  <Text
                    style={{
                      fontFamily: "Inter-Bold",
                      color: "#1E1E1E",
                      fontSize: mscale(18),
                    }}
                  >
                    {review?.name}
                  </Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1, marginTop: mscale(10) }}
                  contentContainerStyle={{ paddingRight: 10 }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      fontSize: mscale(16),
                      color: colors.black,
                    }}
                  >
                    {review?.message}
                  </Text>
                </ScrollView>
              </View>
            ))}
          </Carousel>
        ) : (
          <Text
            style={{
              fontSize: mscale(14),
              fontFamily: "Inter-Regular",
              marginVertical: mscale(10),
            }}
          >
            No reviews yet.
          </Text>
        )}

        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate("App", {
              screen: "Review",
              params: { userData: user },
            })
          }
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: mscale(10),
            marginBottom: mscale(20),
          }}
        >
          <Entypo name="plus" size={20} color={colors.primary} />
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: mscale(16),
              color: colors.primary,
            }}
          >
            Add review
          </Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
}
