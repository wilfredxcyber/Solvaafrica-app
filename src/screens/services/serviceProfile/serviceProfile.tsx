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
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import {
  getFreelancerId,
  getFreelancerProfileState,
  mergeAuthUserProfile,
} from "@/src/helpers/freelancerProfile";

const createNoCacheRequestConfig = () => ({
  params: { _ts: Date.now() },
});

const normalizePhone = (value?: string | null) =>
  String(value ?? "").replace(/\D/g, "");

const normalizeText = (value?: string | null) =>
  String(value ?? "").trim().toLowerCase();

export default function ServiceProfile() {
  const navigation = useNavigation();
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const { freelancerId, hasFreelancerProfile } =
    getFreelancerProfileState(authUser);

  const userId = String(authUser?.profile?.userID ?? "");
  const userPhone = normalizePhone(authUser?.profile?.phone);
  const userEmail = normalizeText(authUser?.profile?.email);
  const userName = normalizeText(authUser?.profile?.fullName);
  const userRole = authUser?.profile?.role;

  const persistResolvedFreelancer = useCallback(async (freelancerProfile: any) => {
    const currentUser = useAuthStore.getState().user;
    const resolvedFreelancerId = getFreelancerId(freelancerProfile?.id);
    const currentFreelancerId = getFreelancerId(
      currentUser?.profile?.freelancerId ??
        currentUser?.profile?.freelancer ??
        currentUser?.profile?.freelancerProfile ??
        currentUser?.profile?.freelancerProfileId
    );

    if (!currentUser || !resolvedFreelancerId) {
      return freelancerProfile ?? null;
    }

    if (
      currentFreelancerId &&
      String(currentFreelancerId) === String(resolvedFreelancerId) &&
      currentUser?.profile?.hasServiceProfile
    ) {
      return freelancerProfile;
    }

    const updatedUser = mergeAuthUserProfile(currentUser, {
      role: "freelancer",
      freelancer: resolvedFreelancerId,
      freelancerId: resolvedFreelancerId,
      freelancerProfile: resolvedFreelancerId,
      freelancerProfileId: resolvedFreelancerId,
      hasServiceProfile: true,
    });

    useAuthStore.setState({ user: updatedUser });
    await AsyncStorage.setItem("User", JSON.stringify(updatedUser));

    return freelancerProfile;
  }, []);

  const findOwnFreelancerProfile = useCallback(async () => {
    if (!userId) {
      return null;
    }

    const response = await AUTH_API_CLIENT.get(
      "/freelancers",
      createNoCacheRequestConfig()
    );

    if (response.status !== 200) {
      return null;
    }

    const freelancers = Array.isArray(response.data?.data)
      ? response.data.data
      : [];

    const ownerMatch = freelancers.find(
      (current: any) => String(current?.owner ?? "") === userId
    );

    const matchedFreelancer =
      ownerMatch ||
      freelancers.find(
        (current: any) =>
          Boolean(
            userPhone &&
              normalizePhone(current?.phoneNumber ?? current?.phone) === userPhone
          )
      ) ||
      freelancers.find(
        (current: any) =>
          Boolean(
            userEmail &&
              normalizeText(current?.email ?? current?.user?.email) === userEmail
          )
      ) ||
      freelancers.find(
        (current: any) =>
          Boolean(userName && normalizeText(current?.fullName) === userName)
      );

    if (!matchedFreelancer) {
      return null;
    }

    return persistResolvedFreelancer(matchedFreelancer);
  }, [persistResolvedFreelancer, userEmail, userId, userName, userPhone]);

  const getReviews = useCallback(async (id: string | number) => {
    try {
      setReviewLoading(true);
      const response = await AUTH_API_CLIENT.get(`/freelancers/comment/${id}`);
      if (response.status === 200) {
        setReviews(response.data.data.comments || []);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  }, []);

  const loadByFreelancerId = useCallback(async (id: string | number) => {
    const response = await AUTH_API_CLIENT.get(
      `/freelancers/${id}`,
      createNoCacheRequestConfig()
    );

    if (response.status !== 200) {
      return null;
    }

    return response.data?.data?.freelancer ?? response.data?.data ?? null;
  }, []);

  const getFreelancerInfo = useCallback(async () => {
    if (!authUser) {
      setLoading(false);
      setReviewLoading(false);
      setUser(null);
      setReviews([]);
      setErrorMessage("Please sign in to view your service profile.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      let freelancerProfile: any | null = null;

      if (freelancerId) {
        freelancerProfile = await loadByFreelancerId(freelancerId);
      }

      if (!freelancerProfile && (hasFreelancerProfile || userRole === "freelancer")) {
        freelancerProfile = await findOwnFreelancerProfile();
      }

      if (!freelancerProfile) {
        setUser(null);
        setReviews([]);
        setReviewLoading(false);

        if (userRole !== "freelancer" && !hasFreelancerProfile) {
          router.replace("/(services)/services-profile/setup-profile");
          return;
        }

        setErrorMessage("We could not load your service profile. Please try again.");
        return;
      }

      setUser(freelancerProfile);
      await getReviews(freelancerProfile.id);
    } catch (error) {
      console.error("Failed to fetch freelancer:", error);
      setUser(null);
      setReviews([]);
      setReviewLoading(false);
      setErrorMessage("Failed to load freelancer profile.");
    } finally {
      setLoading(false);
    }
  }, [
    authUser,
    findOwnFreelancerProfile,
    freelancerId,
    getReviews,
    hasFreelancerProfile,
    loadByFreelancerId,
    router,
    userRole,
  ]);

  useEffect(() => {
    if (!authUser) {
      setLoading(false);
      return;
    }

    void getFreelancerInfo();
  }, [authUser?.profile?.userID]);

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
            router.navigate({
              pathname: "/(services)/services-profile/edit-profile",
              params: { userData: user },
            })
          }
        />
      ),
    });
  }, [navigation, router, user]);

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

      <View>
        <Text
          style={{
            fontSize: mscale(16),
            fontFamily: "Inter-Medium",
            color: colors.black,
            marginTop: mscale(5),
          }}
        >
          Location
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
          {user?.location || "No location available"}
        </Text>
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
      </View>
    </ScrollView>
  );
}
