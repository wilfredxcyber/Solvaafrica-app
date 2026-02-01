import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ListRenderItemInfo,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { globalStyles } from "@/src/styles/global";
import { hscale, mscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import ErrorModal from "@/src/components/errorModal";
import { Job } from "@/src/types";

export default function JobOffers() {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getJobs = async () => {
        try {
          setLoading(true);
          const response = await AUTH_API_CLIENT.get("/jobs");
          if (response.status === 200 && isActive) {
            setJobs(response.data.data);
          }
        } catch (error) {
          console.error("Job fetch error:", error);
          if (isActive) {
            setErrorMessage("Something went wrong while fetching jobs!");
            setErrorVisible(true);
          }
        } finally {
          if (isActive) setLoading(false);
        }
      };

      getJobs();

      // Cleanup on blur/unmount
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View style={globalStyles.screen}>
      <Image
        source={require("../../../assets/images/jobBanner.png")}
        style={{
          marginTop: mscale(10),
          width: "100%",
        }}
        resizeMode="contain"
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={jobs}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("App", {
                  screen: "JobDetails",
                  params: { job: item },
                })
              }
            >
              <View
                style={{
                  padding: mscale(16),
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: mscale(10),
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#5C5F62",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "Inter-Bold",
                      color: colors.black,
                      fontSize: mscale(20),
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      color: colors.primary,
                      fontSize: mscale(15),
                      textTransform: "capitalize",
                    }}
                  >
                    {item.status[0] || "N/A"}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      color: "#5C5F62",
                      marginBottom: hscale(4),
                      fontSize: mscale(13),
                      textAlign: "right",
                    }}
                  >
                    Job posting date:
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      color: colors.black,
                      textAlign: "right",
                      fontSize: mscale(15),
                    }}
                  >
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
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
              No job offers available at the moment.
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
