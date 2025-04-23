import { Pressable, StyleSheet, Text, View, Linking } from "react-native";
import { useNavigation, Link } from "@react-navigation/native";
import ArrowLeftIcon from "@expo/vector-icons/Octicons";
import CheckIcon from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";

import { AUTH_API_CLIENT, PUB_API_CLIENT } from "../api/apiClient";
import { hscale, mscale, wscale } from "../helpers/metric";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import LoadingView from "./loadingView";

type subscriptionPlans = "Popular" | "Best Value";

export default function SubscribeView() {
  const navigation = useNavigation();

  const [activePlan, setActivePlan] = useState<subscriptionPlans>("Best Value");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const planOffers: PlanOfferProps = {
    basic: ["Past questions", "Project Materials"],
    premium: [
      "Past questions",
      "Project Materials",
      "Grant Informations",
      "Scholarship Informations",
    ],
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      statusBarBackgroundColor: colors.primary,
      statusBarStyle: "light",
      statusBarAnimation: "slide",
    });
  }, []);

  const handleSubButtonPress = (subPlan: subscriptionPlans) => {
    setActivePlan(subPlan);
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const res = await AUTH_API_CLIENT.get(
        `/sub/${activePlan}/link?callback=https://www.solvaafrica.com`
      );
      if (res.status === 200) {
        const subLink = res.data.data.authorization_url;
        console.log("Subscription response", res.data);
        Linking.openURL(subLink);
      }
    } catch (error: any) {
      console.log("Error in subscribe", error?.response);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingView isLoading={isLoading} />;

  return (
    <View style={[globalStyles.screen, { backgroundColor: colors.primary }]}>
      <ArrowLeftIcon
        name="arrow-left"
        size={24}
        color={"#ffffff"}
        style={{ marginTop: hscale(20) }}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.subscribe}>Subscribe to unlock all features</Text>

      <View style={{ gap: 20, marginTop: hscale(40) }}>
        <SubButton
          handleOnPress={() => handleSubButtonPress("Popular")}
          subPlan="Popular"
          subPrice="999"
          isActive={activePlan === "Popular" ? true : false}
        />
        {activePlan === "Popular" && (
          <View style={{ marginLeft: wscale(20), gap: hscale(8) }}>
            {planOffers.basic.map((offer) => (
              <View
                key={offer}
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <CheckIcon name="check" size={20} color={"#ffffff"} />
                <Text key={offer} style={styles.planOffer}>
                  {offer}
                </Text>
              </View>
            ))}
          </View>
        )}{" "}
        <SubButton
          handleOnPress={() => handleSubButtonPress("Best Value")}
          subPlan="Best Value"
          subPrice="1,999"
          isActive={activePlan === "Best Value" ? true : false}
        />
        {activePlan === "Best Value" && (
          <View style={{ marginLeft: wscale(20), gap: hscale(8) }}>
            {planOffers.premium.map((offer) => (
              <View
                key={offer}
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <CheckIcon name="check" size={20} color={"#ffffff"} />
                <Text key={offer} style={styles.planOffer}>
                  {offer}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <Text onPress={handleSubscribe} style={styles.subscribeButton}>
        Subscribe
      </Text>
    </View>
  );
}

interface SubButtonProps {
  subPlan: "Best Value" | "Popular";
  subPrice: "999" | "1,999";
  isActive: boolean;
  handleOnPress: () => void;
}

interface PlanOfferProps {
  basic: string[];
  premium: string[];
}

const SubButton = ({
  subPlan,
  subPrice,
  isActive,
  handleOnPress,
}: SubButtonProps) => {
  return (
    <Pressable
      onPress={handleOnPress}
      style={[
        styles.subButton,
        { backgroundColor: isActive ? "#ffffff" : colors.greyView },
      ]}
    >
      <Text
        style={{
          fontFamily: "Inter-Medium",
          fontSize: mscale(16),
          color: isActive ? colors.primary : colors.bodyText,
        }}
      >
        {subPlan}
      </Text>
      <Text
        style={{
          fontFamily: "Inter-Medium",
          fontSize: mscale(20),
          color: isActive ? colors.primary : colors.bodyText,
        }}
      >
        {`₦${subPrice}${subPlan === "Best Value" ? "/3month" : "month"}`}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  subscribe: {
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    textAlign: "center",
    fontSize: mscale(20),
    width: "80%",
    marginHorizontal: "auto",
  },
  subButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: hscale(20),
    backgroundColor: "#ffffff",
    borderRadius: mscale(10),
    alignItems: "center",
  },
  planOffer: {
    fontFamily: "Inter-Medium",
    fontSize: mscale(14),
    color: "#ffffff",
  },
  subscribeButton: {
    padding: hscale(20),
    marginTop: hscale(40),
    backgroundColor: "#ffffff",
    borderRadius: mscale(50),
    fontFamily: "Inter-Bold",
    fontSize: mscale(16),
    textAlign: "center",
    color: colors.primary,
  },
});
