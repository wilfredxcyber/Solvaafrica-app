import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { mscale, hscale, wscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import LottieView from "lottie-react-native";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchNotifications = async () => {
      setLoading(true);
      setTimeout(() => {
        const mockNotifications: any[] = [
          {
            id: "1",
            title: "Subscription Activated",
            message: "Your premium subscription is now active.",
            timestamp: "2h ago",
          },
          {
            id: "2",
            title: "New Project Available",
            message: "A new project document has been added.",
            timestamp: "1d ago",
          },
        ];

        setNotifications(mockNotifications || []) ; // or empty array to test empty state
        setLoading(false);
      }, 1000);
    };

    fetchNotifications();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={globalStyles.screen}>
      {/* <Text style={styles.header}>Notifications</Text> */}
      {loading ? (
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LottieView
            autoPlay
            style={{
              width: wscale(50),
              height: hscale(50),
              alignSelf: "center",
            }}
            source={require("../../../assets/animations/spin.json")}
          />
          <Text>Loading notifications</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.message}>No notifications yet.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: hscale(24) }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: mscale(18),
    fontFamily: "Inter-Bold",
    marginBottom: hscale(16),
  },
  notificationCard: {
    // backgroundColor: colors.greyView,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    padding: mscale(10),
    borderRadius: mscale(10),
    // marginBottom: hscale(12),
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(18),
    color: colors.black,
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: mscale(14),
    color: colors.bodyText,
    marginTop: hscale(4),
  },
  timestamp: {
    fontFamily: "Inter-Light",
    fontSize: mscale(12),
    color: colors.bodyText,
    marginTop: hscale(4),
    textAlign: "right"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
