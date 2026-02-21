import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";

type TaskCardProps = {
  brandName: string;
  campaignType: string;
  title: string;
  subtitle?: string;
  timeLeft: string;
  spotsLeft: string;
  totalPool: number;
  logo?: any;
  banner?: any;
  onPress: () => void;
};

const formatNaira = (amount: number) => {
  return `₦ ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export default function TaskCard({
  brandName,
  campaignType,
  title,
  subtitle,
  timeLeft,
  spotsLeft,
  totalPool,
  logo,
  banner,
  onPress,
}: TaskCardProps) {
  const isUrgent = timeLeft.toLowerCase().includes("hour");

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {/* LEFT */}
        <View style={styles.left}>
          <View style={styles.brandRow}>
            <View style={styles.logoWrap}>
              {logo ? (
                <Image source={logo} style={styles.logo} resizeMode="contain" />
              ) : (
                <View style={styles.logoPlaceholder} />
              )}
            </View>
            <Text style={styles.brandName}>{brandName}</Text>
          </View>

          <View style={styles.tag}>
            <Text style={styles.tagText}>{campaignType}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.title}>{subtitle}</Text>}

          <View style={styles.metaRow}>
            <Text
              style={[
                styles.timeText,
                isUrgent ? styles.urgent : styles.safe,
              ]}
            >
              {timeLeft}
            </Text>
            <Text style={styles.spotText}>{spotsLeft}</Text>
          </View>
        </View>

        {/* RIGHT */}
        <View style={styles.right}>
          <Text style={styles.poolLabel}>Total pool</Text>
          <Text style={styles.poolValue}>{formatNaira(totalPool)}</Text>

          <View style={styles.bannerWrap}>
            {banner ? (
              <Image source={banner} style={styles.banner} />
            ) : (
              <View style={styles.bannerPlaceholder} />
            )}
          </View>
        </View>
      </View>

      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>View Task</Text>
      </Pressable>
    </View>
  );
}

const PRIMARY = "#5B21B6";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  topRow: {
    flexDirection: "row",
    gap: 12,
  },

  left: {
    flex: 1,
  },

  right: {
    width: 120,
    alignItems: "flex-end",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logoWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 26,
    height: 26,
  },

  logoPlaceholder: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#DADADA",
  },

  brandName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
  },

  tag: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B7E4C7",
    backgroundColor: "#F2FFF6",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2F855A",
  },

  title: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },

  metaRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 10,
  },

  timeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  urgent: {
    color: "#E11D48",
  },

  safe: {
    color: "#2F855A",
  },

  spotText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
  },

  poolLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },

  poolValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY,
  },

  bannerWrap: {
    marginTop: 10,
    width: 66,
    height: 66,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F2F2F2",
  },

  banner: {
    width: "100%",
    height: "100%",
  },

  bannerPlaceholder: {
    flex: 1,
    backgroundColor: "#E6E6E6",
  },

  button: {
    marginTop: 14,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
    minWidth: 150,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});
