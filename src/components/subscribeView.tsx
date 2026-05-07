import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Linking,
  Platform,
} from "react-native";
import { useNavigation, Link } from "@react-navigation/native";
import ArrowLeftIcon from "@expo/vector-icons/Octicons";
import CheckIcon from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";

import { AUTH_API_CLIENT, PUB_API_CLIENT } from "../api/apiClient";
import { hscale, mscale, wscale } from "../helpers/metric";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import LoadingView from "./loadingView";
import ErrorModal from "./errorModal";

type subscriptionPlans = "Basic" | "Premium";

export default function SubscribeView() {
  const navigation = useNavigation();

  const [activePlan, setActivePlan] = useState<subscriptionPlans>("Premium");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const planOffers: PlanOfferProps = {
    basic: ["Past questions", "Project Materials"],
    premium: [
      "Upload PQ/Project (earn money)",
      "Grant/Scholarship Information",
      "Get Certified on short courses",
      "Innovation/Angel investors news",
      "Therapy",
      "Task (earn money completing a task)",
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
    let win: Window | null = null;

    try {
      // ✅ ONLY open window on web
      if (Platform.OS === "web") {
        win = window.open("", "_blank");

        if (win) {
          win.document.write("<p>Redirecting to payment...</p>");
        }
      }

      setIsLoading(true);

      const res = await AUTH_API_CLIENT.get(
        `/sub/${activePlan}/link?callback=https://www.solvaafrica.com`,
      );

      if (res.status === 200) {
        const subLink = res.data.data.authorization_url;

        console.log("Subscription response", res.data);
        console.log("SUB LINK:", subLink);

        // ✅ WEB
        if (Platform.OS === "web") {
          if (win) {
            win.location.href = subLink; // 🔥 Safari-safe redirect
          } else {
            alert("Please allow popups for this site");
          }
          return;
        }

        // ✅ MOBILE (iOS / Android)
        await Linking.openURL(subLink);
      }
    } catch (error: any) {
      console.log("FULL ERROR:", error);

      // close blank tab if error
      if (Platform.OS === "web" && win) {
        win.close();
      }

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Subscription failed";

      setErrorMessage(message);
      setErrorVisible(true);
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
          handleOnPress={() => handleSubButtonPress("Premium")}
          subPlan="Premium"
          subPrice="999"
          isActive={activePlan === "Premium" ? true : false}
        />
        {activePlan === "Premium" && (
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
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </View>
  );
}

interface SubButtonProps {
  subPlan: "Premium" | "Basic";
  subPrice: "999";
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
        {`\u20A6 ${subPrice} / month`}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  subscribe: {
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    textAlign: "center",
    fontSize: mscale(24),
    width: 361,
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
