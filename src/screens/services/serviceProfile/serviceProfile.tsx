import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Linking,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { globalStyles } from "@/src/styles/global";
import { hscale, mscale, wscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import Carousel from "pinar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import { createIconSetFromFontello, Ionicons } from "@expo/vector-icons";
import { FreelancerProfile } from "@/src/types";

export default function ServiceProfile() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState<any | null>(null);

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);

  const getFreelancerInfo = async () => {
    try {
      setLoading(true);
      const response = await AUTH_API_CLIENT.get(`/freelancers/`);
      if (response.status === 200) {
        const fetchedUser = response.data.data[0];
        setUser(fetchedUser);
        getReviews(fetchedUser.id);
      }
    } catch (error) {
      console.error("Job fetch error:", error);
      setErrorMessage("Something went wrong while fetching services!");
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const getReviews = async (freelancerId: number) => {
    try {
      setReviewLoading(true);
      const response = await AUTH_API_CLIENT.get(
        `/freelancers/comment/${freelancerId}`
      );
      console.log(response.data.data.comments, "reviews");
      if (response.status === 200) {
        setReviews(response.data.data.comments || []);
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setReviewLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getFreelancerInfo();
    }, [])
  );

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
        <ActivityIndicator size="large" color={colors.primary} />;
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.screen}>
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
        <View>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              color: colors.black,
              fontSize: mscale(14),
              marginVertical: mscale(5),
              lineHeight: mscale(20),
            }}
          >
            {user?.bio}
          </Text>
        </View>
      </View>
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
          <Pressable onPress={() => Linking.openURL(user?.portfolioLink!)}>
            <Text
              style={{
                textAlign: "center",
                color: colors.primary,
                fontFamily: "Inter-Medium",
                fontStyle: "italic",
                // textDecorationLine: "underline",
              }}
            >
              Click link to view portfolio
            </Text>
          </Pressable>
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
        From: NGN {user?.startingAmount}
      </Text>
      <View
        style={{
          marginVertical: mscale(10),
        }}
      >
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
          <TouchableOpacity
            onPress={() => Linking.openURL(user?.whatsappLink!)}
            style={{
              alignItems: "center",
              gap: mscale(10),
            }}
          >
            <FontAwesome6 name="whatsapp" size={20} color="green" />
            <Text style={{ color: "green", fontSize: mscale(16) }}>
              WhatsApp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${user?.phoneNumber}`)}
            style={{
              alignItems: "center",
              gap: mscale(10),
            }}
          >
            <Entypo name="phone" size={20} color="black" />
            <Text style={{ color: "black", fontSize: mscale(16) }}>Phone</Text>
          </TouchableOpacity>
        </View>
      </View>
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
            dotStyle={{ backgroundColor: colors.sliderDotsInactive }}
            dotsContainerStyle={{
              bottom: hscale(5),
            }}
            mergeStyles
          >
            {reviews.map((review: any) => (
              <View
                key={review.id}
                style={{
                  backgroundColor: "#EBEDEB80",
                  padding: mscale(10),
                  borderRadius: mscale(16),
                  marginTop: mscale(10),
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

        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
