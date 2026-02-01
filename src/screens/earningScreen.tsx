import { Alert, Pressable, StyleSheet, Text, View, ScrollView } from "react-native"; // Added ScrollView
//import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import StarIcon from "@expo/vector-icons/AntDesign";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import Icon from "@expo/vector-icons/FontAwesome";
import { useRouter, useFocusEffect } from "expo-router"; // Add expo-router

import { hscale, mscale, wscale } from "../helpers/metric";
import { useAuthStore } from "../stores/authStore";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import ToastManager, { Toast } from "toastify-react-native";

type Tab = "Refer" | "Earn";

export default function EarningScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("Refer");
  const [userBalance, setUserBalance] = useState<null | number>(null);

  const AuthUser = useAuthStore((state) => state.user);
  const { userID } = AuthUser.profile;

  useFocusEffect(
    useCallback(() => {
      const getUserEarnedBalance = async () => {
        try {
          const response = await AUTH_API_CLIENT.get(
            `/users/balance/${userID}`,
          );
          const { balance } = response.data.data;
          setUserBalance(balance);
          console.log("User balance fetched:", response.data);
        } catch (error) {
          Toast.error("Error fetching user balance");
          // console.log('Error fetching user balance', error)
        }
      };

      getUserEarnedBalance();
    }, []),
  );

  return (
    <View style={globalStyles.screen}>
      {/* tabs view */}
      <ToastManager />
      <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />
      
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hscale(20) }}
      >
        {activeTab === "Refer" && <ReferTabView />}
        {activeTab === "Earn" && <EarnTabView userBalance={userBalance} />}
      </ScrollView>
    </View>
  );
}

const EarnTabView = ({ userBalance }: { userBalance: number | null }) => {
  return (
    <View>
      <EarningsBalanceView userBalance={userBalance} />
    </View>
  );
};

const ReferTabView = () => {
  const [referrals, setReferrals] = useState<any[]>([]);
  const { profile } = useAuthStore((state) => state.user);
  const userReferralCode = profile.referralCode;
  
  return (
    <View>
      {/* how you earn view */}
      <View style={styles.bannerView}>
        <StarIcon name="star" size={20} color={colors.primary} />
        <View style={{ flex: 1, marginLeft: wscale(12) }}>
          <Text
            style={[
              styles.text,
              {
                fontFamily: "Inter-Bold",
                fontSize: mscale(20),
                color: colors.black,
              },
            ]}
          >
            How You Earn
          </Text>
          <View style={{ gap: 2, marginTop: hscale(0) }}>
            <Text style={styles.text}>Subscribe to premium package</Text>
            <Text style={styles.text}>
              People signup with your referral code
            </Text>
            <Text style={styles.text}>
              Referred individual pay for a material
            </Text>
          </View>
        </View>
      </View>

      <Text
        style={[
          styles.text,
          {
            fontSize: mscale(20),
            fontFamily: "Inter-Bold",
            color: colors.black,
            textAlign: "center",
            marginTop: hscale(40),
          },
        ]}
      >
        {" "}
        Get Free NGN 100.00
      </Text>
      <Text style={[styles.text, { textAlign: "center", fontSize: mscale(16) }]}>
        Share this hack with your friends
      </Text>
      <Text
        style={[styles.text, { textAlign: "center", marginTop: hscale(20),fontSize: mscale(16)}]}
      >
        You stand to earn NGN 100.00 when your friend input your referral code
        during sign up and registers to the premium package
      </Text>

      {/* Copy referral code view */}
      <CopyReferalCodeView />

      <Text
          style={{
            fontFamily: "Inter-Bold",
            fontSize: mscale(20),
            color: colors.black,
            marginTop: hscale(24),
          }}
        >
          Your Referrals
        </Text> 
      {/* Referrals section */}
      <View style={{ marginTop: hscale(8), alignItems: "center" }}>
        {referrals.length === 0 && (
          <>
            <Text
              style={{
                textAlign: "center",
                fontSize: mscale(14),
                color: "#5C5F62",
                width: "80%",
                lineHeight: mscale(20),
                marginBottom: hscale(24),
              }}
            >
              You currently do not have any referral. Your referrals will appear here
              when you refer friends using your code.
            </Text>

            {/* Empty state image */}
            <View
              style={{
                width: wscale(180),
                height: hscale(300),
                alignItems: "center"
                //marginBottom: hscale(32),
              }}
            >
              <Image
                source={require("../../assets/images/Referral.png")}
                style={{ width: 266, height: 283, }}
                contentFit="contain"
              />
            </View>
          </>
        )}

        <Text
          style={{
            fontFamily: "Inter-Bold",
            fontSize: mscale(24),
            color: colors.black,
            marginBottom: hscale(16),
          }}
        >
          Share Via
        </Text>

        {/* Social buttons */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: hscale(40) }}>
          <SocialButton label="WhatsApp" referralCode={userReferralCode} />
          <SocialButton label="X" referralCode={userReferralCode} />
          <SocialButton label="Facebook" referralCode={userReferralCode} />
        </View>
      </View>
    </View>
  );
};

const Tabs = ({
  setActiveTab,
  activeTab,
}: {
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
  activeTab: Tab;
}) => {
  const tabEarn: Tab = "Earn";
  const tabRefer: Tab = "Refer";
  return (
    <View style={styles.tabButtonsView}>
      <Pressable
        style={[
          styles.tabView,
          {
            backgroundColor: activeTab === "Refer" ? colors.primary : undefined,
          },
        ]}
        onPress={() => setActiveTab("Refer")}
      >
        <Text
          style={[
            {
              fontFamily: "Inter-Bold",
              fontSize: mscale(16),
              textAlign: "center",
            },
            {
              color: activeTab === "Refer" ? "#ffffff" : undefined,
            },
          ]}
        >
          {tabRefer}
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.tabView,
          {
            backgroundColor: activeTab === "Earn" ? colors.primary : undefined,
          },
        ]}
        onPress={() => setActiveTab("Earn")}
      >
        <Text
          style={[
            {
              fontFamily: "Inter-Bold",
              fontSize: mscale(16),
              textAlign: "center",
            },
            {
              color: activeTab === "Earn" ? "#ffffff" : colors.black,
            },
          ]}
        >
          {tabEarn}
        </Text>
      </Pressable>
    </View>
  );
};

const CopyReferalCodeView = () => {
  const { profile } = useAuthStore((state) => state.user);
  const [copiedCode, setCopiedCode] = useState(false);
  const userReferralCode = profile.referralCode;

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(userReferralCode);
    setCopiedCode(true);
    // Alert.alert('Copied!', 'Your referral code has been copied to clipboard.')
  };

  useEffect(() => {
    setTimeout(() => {
      setCopiedCode(false);
    }, 3000);
  }, [copiedCode]);
  return (
    <View style={styles.copyReferralCodeView}>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.text,
            { fontFamily: "Inter-Bold", color: colors.black, fontSize: mscale(24)},
          ]}
        >
          Referral code
        </Text>
        <Text>{userReferralCode}</Text>
      </View>
      <Text style={styles.textButton} onPress={handleCopyCode}>
        {copiedCode ? "Copied" : "Copy"}
      </Text>
    </View>
  );
};

// View to display the earned balance
const EarningsBalanceView = ({
  userBalance,
}: {
  userBalance: number | null | any;
}) => {
  const router = useRouter();

  const handleNavigateCashout = () => {
    const balanceString = userBalance ? userBalance.toString() : "0";
    router.push(`/cashout?balance=${balanceString}`);
  };
  
  return (
    <View>
    <View style={styles.copyReferralCodeView}>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.text,
            { fontFamily: "Inter-Bold", color: colors.black },
          ]}
        >
          Earnings
        </Text>
        {userBalance !== undefined && (
          <Text
            style={styles.text}
          >{`${userBalance ? userBalance?.toFixed(2) : "---"} NGN`}</Text>
        )}
        <Text
          style={[
            styles.text,
            { fontFamily: "Inter-Regular", color: colors.black, fontSize: mscale(12)},
          ]}
        >
          Minimum cashout NGN 10,000
        </Text>
      </View>
      <Text style={styles.textButton} onPress={handleNavigateCashout}>
        Cashout
      </Text>
    </View>

    </View>
   
  );
};

const SocialButton = ({ label, referralCode }: { label: string; referralCode: string }) => {
  const handlePress = () => {
    const message = `Join Solva Africa with my referral code: ${referralCode}`;
    if (label === "WhatsApp") {
      Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
    } else if (label === "X") {
      Linking.openURL(`twitter://post?message=${encodeURIComponent(message)}`);
    } else if (label === "Facebook") {
      Linking.openURL(`fb://post?message=${encodeURIComponent(message)}`);
    }
  };

  const iconName = label === "WhatsApp" ? "whatsapp" : label === "X" ? "twitter" : "facebook";

  return (
    <Pressable onPress={handlePress} style={styles.socialButton}>
      <Icon name={iconName} size={24} color="#000000" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tabButtonsView: {
    backgroundColor: "#F5F3FF",
    width: "100%",
    marginHorizontal: "auto",
    flexDirection: "row",
    borderRadius: mscale(30),
    marginBottom: hscale(10), // Added some spacing
  },
  tabView: {
    height: hscale(48),
    flex: 1,
    justifyContent: "center",
    borderRadius: mscale(30),
  },
  text: {
    fontFamily: "Inter-regular",
    fontSize: mscale(16),
    color: "#5C5F62",
  },
  bannerView: {
    backgroundColor: "#F5F3FF",
    marginTop: hscale(20),
    borderRadius: mscale(20),
    flexDirection: "row",
    paddingVertical: mscale(20),
    paddingHorizontal: mscale(20),
    height: hscale(184),
  },
  copyReferralCodeView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    paddingVertical: hscale(12),
    paddingHorizontal: wscale(24),
    borderRadius: mscale(12),
    marginTop: hscale(20),
    borderWidth: 1,
    borderColor: colors.black,
  },
  textButton: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(12),
    height: hscale(32),
    backgroundColor: colors.primary,
    paddingHorizontal: wscale(20),
    textAlign: "center",
    lineHeight: hscale(32),
    color: "#ffffff",
    borderRadius: mscale(16),
  },
  socialButton: {
    backgroundColor: colors.white,
    paddingHorizontal: wscale(16),
    paddingVertical: hscale(8),
    borderRadius: mscale(8),
  },
  socialButtonText: {
    color: "#000000",
    fontFamily: "Inter-Bold",
    fontSize: mscale(14),
  },
});