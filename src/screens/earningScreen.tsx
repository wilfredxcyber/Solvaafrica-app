import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import StarIcon from "@expo/vector-icons/AntDesign";
import * as Clipboard from "expo-clipboard";

import { hscale, mscale, wscale } from "../helpers/metric";
import { useAuthStore } from "../stores/authStore";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import ToastManager, { Toast } from "toastify-react-native";
import SocialIcon from "@expo/vector-icons/FontAwesome";
import { jobOffersData } from "../stores/jobData";
import { Job } from "../types";
import ErrorModal from "../components/errorModal";
import { Share } from "react-native";

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
            `/users/balance/${userID}`
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
    }, [])
  );

  return (
    <View style={globalStyles.screen}>
      {/* tabs view */}
      <ToastManager />
      <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />
      {activeTab === "Refer" && <ReferTabView />}
      {activeTab === "Earn" && <EarnTabView userBalance={userBalance} />}
    </View>
  );
}

const EarnTabView = ({ userBalance }: { userBalance: number | null }) => {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true);
        const response = await AUTH_API_CLIENT.get("/jobs");
        if (response.status === 200) {
          setJobs(response.data.data);
        }
      } catch (error) {
        console.error("Job fetch error:", error);
        setErrorMessage("Something went wrong while fetching jobs!");
        setErrorVisible(true);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  return (
    <View>
      <EarningsBalanceView userBalance={userBalance} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: hscale(20),
        }}
      >
        <Text
          style={{
            fontSize: mscale(24),
            fontFamily: "Inter-Bold",
            color: colors.black,
          }}
        >
          Job Offers
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("App", { screen: "Job" })}
        >
          <Text
            style={{
              fontSize: mscale(15),
              fontFamily: "Inter-Medium",
              color: colors.primary,
            }}
          >
            View all
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={Array.isArray(jobs) ? jobs.slice(0, 3) : []}
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
};

const ReferTabView = () => {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const AuthUser = useAuthStore((state) => state.user);
  const { userID } = AuthUser.profile;
  const [referrals, setReferrals] = useState<any[]>([]);

  const APP_NAME = "Solva";
  const DEEP_LINK_BASE = "https://www.solvaafrica.com";
  const getReferralLink = () => {
    return `${DEEP_LINK_BASE}/signup?ref=${AuthUser.referralCode}`;
  };
  const handleSocialShare = async (platform: "wa" | "fb" | "tw") => {
    const referralLink = getReferralLink();
    const message = `🎉 Join ${APP_NAME} and start earning! Use my referral code: ${AuthUser.referralCode}\n\nSign up here: ${referralLink}`;

    let url = "";

    switch (platform) {
      case "wa":
        url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        break;

      case "fb":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          referralLink
        )}&quote=${encodeURIComponent(message)}`;
        break;

      case "tw":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          message
        )}`;
        break;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Toast.error("Unable to open share link. Try copying manually.");
      }
    } catch (error) {
      console.error("Social share error:", error);
      Toast.error("Could not open social sharing.");
    }
  };

  useEffect(() => {
    const getReferrals = async () => {
      try {
        const response = await AUTH_API_CLIENT.get(
          `/users/referrals/${userID}`
        );
        if (response.status === 200) {
          setReferrals(response.data.data.referralUsers);
        
        }
      } catch (error) {
        Toast.error("Error fetching user referrals");
      }
    };

    getReferrals();
  }, []);

  const renderReferralItem = ({ item }: { item: any }) => (
    <View
      style={{
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      }}
    >
      <Text style={{ fontFamily: "Inter-Medium", fontSize: 16 }}>
        {item.fullName}
      </Text>
      <Text style={{ fontFamily: "Inter-Regular", color: "#555" }}>
        {item.email}
      </Text>
    </View>
  );

  return (
    <ScrollView>
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
          <View style={{ gap: 12, marginTop: hscale(10) }}>
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
            fontFamily: "Inter-Bold",
            color: colors.black,
            textAlign: "center",
            marginTop: hscale(15),
          },
        ]}
      >
        Get Free NGN 100.00
      </Text>
      <Text style={[styles.text, { textAlign: "center" }]}>
        Share this hack with your friends
      </Text>
      <Text
        style={[styles.text, { textAlign: "center", marginTop: hscale(20) }]}
      >
        You stand to earn NGN 100.00 when your friend inputs your referral code
        during sign up and registers to the premium package
      </Text>

      <CopyReferalCodeView />

      <View style={{ marginTop: hscale(20) }}>
        <Text
          style={{
            fontSize: mscale(18),
            fontFamily: "Inter-Bold",
            color: colors.black,
          }}
        >
          Your Referrals
        </Text>

        {referrals.length === 0 ? (
          <>
            <Text style={[styles.text, { textAlign: "center" }]}>
              You currently do not have any referral. Your referrals will appear
              here when you refer friends using your code.
            </Text>
            <Image
              source={require("../../assets/images/referImg.png")}
              style={{
                width: wscale(220),
                height: hscale(234),
                alignSelf: "center",
                marginTop: mscale(10),
              }}
            />
          </>
        ) : (
          <FlatList
            data={referrals}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderReferralItem}
            contentContainerStyle={{ marginTop: 10 }}
          />
        )}

        {/* <View style={styles.socialIconsView}>
          <TouchableOpacity
            onPress={() => handleSocialShare("wa")}
            style={styles.socialBox}
          >
            <SocialIcon name="whatsapp" size={20} />
            <Text style={styles.socialText}>Whatsapp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSocialShare("fb")}
            style={styles.socialBox}
          >
            <SocialIcon name="facebook" size={24} />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSocialShare("tw")}
            style={styles.socialBox}
          >
            <SocialIcon name="twitter" size={24} />
            <Text style={styles.socialText}>Twitter</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ScrollView>
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
            { fontFamily: "Inter-Bold", color: colors.black },
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
  const navigation = useNavigation();

  const handleNavigateCashout = () => {
    navigation.navigate("App", { screen: "Cashout", params: { userBalance } });
  };
  return (
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
          <Text style={styles.text}>{`${userBalance?.toFixed(2)} NGN`}</Text>
        )}
      </View>
      <Text style={styles.textButton} onPress={handleNavigateCashout}>
        Cashout
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tabButtonsView: {
    backgroundColor: "#ECECEC",
    width: "85%",
    marginHorizontal: "auto",
    flexDirection: "row",
    borderRadius: mscale(30),
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
    backgroundColor: "#ECECEC",
    marginTop: hscale(20),
    borderRadius: mscale(15),
    flexDirection: "row",
    padding: mscale(20),
    height: hscale(180),
  },
  copyReferralCodeView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECECEC",
    paddingVertical: hscale(12),
    paddingHorizontal: wscale(24),
    borderRadius: mscale(12),
    marginTop: hscale(20),
    borderWidth: 1.5,
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
  socialIconsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignSelf: "center",
    marginVertical: mscale(20),
  },
  socialText: {
    fontFamily: "Inter-Medium",
    fontSize: mscale(12),
    color: colors.black,
    marginTop: hscale(8),
  },
  socialBox: {
    borderRadius: mscale(12),
    borderColor: "#5C5F62",
    borderWidth: 1,
    width: wscale(82),
    height: hscale(82),
    justifyContent: "center",
    alignItems: "center",
  },
});
