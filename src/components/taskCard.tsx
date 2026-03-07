import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

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

const PRIMARY = "#6207A0";

const formatNaira = (amount: number) => {
  return `\u20A6 ${amount.toLocaleString("en-NG")}`;
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
  const isUrgent = /hour|expired/i.test(timeLeft);

  return (
    <View style={styles.card}>
      <View style={styles.contentRow}>
        <View style={styles.leftColumn}>
          <View style={styles.brandRow}>
            <View style={styles.logoWrap}>
              {logo ? (
                <Image source={logo} style={styles.logo} resizeMode="contain" />
              ) : (
                <View style={styles.logoPlaceholder} />
              )}
            </View>
            <Text style={styles.brandName} numberOfLines={1}>
              {brandName}
            </Text>
          </View>

          <View style={styles.tag}>
            <Text style={styles.tagText}>{campaignType}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.title}>{subtitle}</Text>}

          <View style={styles.metaRow}>
            <Text style={[styles.timeText, isUrgent ? styles.urgent : styles.safe]}>
              {timeLeft}
            </Text>
            <Text style={styles.spotText}>{spotsLeft}</Text>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <Text style={styles.poolLabel}>Total pool</Text>
          <Text style={styles.poolValue}>{formatNaira(totalPool)}</Text>

          <View style={styles.bannerWrap}>
            {banner ? (
              <Image source={banner} style={styles.banner} resizeMode="cover" />
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 14,
    marginBottom: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 4,
  },
  rightColumn: {
    width: 128,
    alignItems: "flex-end",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    width: 30,
    height: 30,
  },
  logoPlaceholder: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#D8D8D8",
  },
  brandName: {
    flex: 1,
    fontSize: 22,
    fontWeight: "900",
    color: "#111111",
  },
  tag: {
    marginTop: 10,
    marginLeft: 44,
    alignSelf: "flex-start",
    minWidth: 154,
    borderWidth: 1,
    borderColor: "#9EA29E",
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 12,
    backgroundColor: "#F4F7F2",
  },
  tagText: {
    fontSize: 12,
    color: "#8FB38C",
  },
  title: {
    marginTop: 14,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "800",
    color: "#111111",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 20,
    marginLeft: 10,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  safe: {
    color: "#49A15E",
  },
  urgent: {
    color: "#FF2B2B",
  },
  spotText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111111",
  },
  poolLabel: {
    fontSize: 12,
    color: "#3C3C3C",
  },
  poolValue: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY,
  },
  bannerWrap: {
    width: 74,
    height: 98,
    marginTop: 12,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#EEEEEE",
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  bannerPlaceholder: {
    flex: 1,
    backgroundColor: "#E4E4E4",
  },
  button: {
    alignSelf: "flex-start",
    marginTop: 20,
    marginLeft: 10,
    minWidth: 154,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
