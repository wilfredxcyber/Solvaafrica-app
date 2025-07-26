import React, { useCallback, useState, useMemo, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import { mscale, hscale, wscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import LottieView from "lottie-react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import ToastManager, { Toast } from "toastify-react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import PrimaryButton from "@/src/components/primaryButton";

type NotificationItemType = {
  id: number;
  owner: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

const NotificationItem = React.memo(
  ({
    item,
    onPress,
  }: {
    item: NotificationItemType;
    onPress: (item: NotificationItemType) => void;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        activeOpacity={0.85}
        style={[
          styles.notificationCard,
          item.isRead ? styles.readCard : styles.unreadCard,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Notification titled ${item.title}, ${
          item.isRead ? "read" : "unread"
        }`}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>
            {item.title}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <Text
          numberOfLines={2}
          style={[styles.message, item.isRead && styles.unreadMessage]}
        >
          {item.message}
        </Text>
        <View
          style={{
            height: 1,
            backgroundColor: "black",
            margin: mscale(5),
          }}
        />
        <View
          style={{
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Text>View</Text>
          <AntDesign name="right" size={14} color="black" />
        </View>
      </TouchableOpacity>
    );
  }
);

const NotificationModal = ({
  visible,
  notification,
  onClose,
}: {
  visible: boolean;
  notification: NotificationItemType | null;
  onClose: () => void;
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessible={true}
      accessibilityViewIsModal={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{notification?.title}</Text>
          <View
            style={{
              height: 1,
              backgroundColor: "black",
              margin: mscale(10),
            }}
          />
          <Text style={styles.modalMessage}>{notification?.message}</Text>
          <Text style={styles.modalTimestamp}>
            {notification &&
              new Date(notification?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </Text>
          <View style={{
            marginTop: mscale(20),
          }}>
            <PrimaryButton text="Close" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItemType[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItemType | null>(null);
  const [markingRead, setMarkingRead] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await AUTH_API_CLIENT.get("/notification/all");
      if (response.status === 200) {
        setNotifications(response.data.data);
      } else {
        Toast.error("Failed to fetch notifications");
      }
    } catch (error) {
      Toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markSingleAsRead = async (id: number) => {
    const endpoint = `/notification/${id}/read`;
    setMarkingRead(true);
    try {
      await AUTH_API_CLIENT.patch(endpoint);
      Toast.error("Notification marked as read");
      fetchNotifications();
    } catch (error) {
      Toast.error("Failed to mark notification as read");
    } finally {
      setMarkingRead(false);
    }
  };

  const markAllAsRead = async () => {
    const endpoint = `/notification/read/all`;
    setMarkingRead(true);
    try {
      await AUTH_API_CLIENT.patch(endpoint);
      Toast.error("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      Toast.error("Failed to mark all as read");
    } finally {
      setMarkingRead(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const onNotificationPress = useCallback((item: NotificationItemType) => {
    if (!item.isRead) {
      markSingleAsRead(item.id);
    }
    setSelectedNotification(item);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: NotificationItemType }) => (
      <NotificationItem item={item} onPress={onNotificationPress} />
    ),
    [onNotificationPress]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ paddingRight: wscale(10) }}>
          <View>
            <Icon name="bell" size={24} color={colors.primary} />
            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  backgroundColor: "red",
                  borderRadius: 8,
                  width: 16,
                  height: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 10,
                    fontFamily: "Inter-Bold",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, unreadCount]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: wscale(10) }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <LottieView
            autoPlay
            style={{ width: wscale(50), height: hscale(50) }}
            source={require("../../../assets/animations/spin.json")}
          />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.message}>No notifications yet.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchNotifications();
                }}
                colors={[colors.primary]}
              />
            }
            accessibilityLabel="Notifications list"
          />
        </>
      )}

      <NotificationModal
        visible={!!selectedNotification}
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontFamily: "Inter-Bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCard: {
    padding: mscale(20),
    borderRadius: mscale(10),
  },
  unreadCard: {
    backgroundColor: "#D0BCFF",
  },
  readCard: {
    backgroundColor: "white",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(18),
    color: colors.black,
  },
  unreadTitle: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(18),
    color: colors.black,
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: mscale(14),
    color: "white",
    marginVertical: hscale(10),
  },
  unreadMessage: {
    color: "black",
  },
  timestamp: {
    fontFamily: "Inter-Light",
    fontSize: mscale(12),
    color: "#666",
    marginTop: hscale(4),
    textAlign: "right",
  },
  markAllButton: {
    backgroundColor: colors.primary,
    padding: mscale(10),
    borderRadius: mscale(6),
    alignItems: "center",
    marginBottom: hscale(12),
  },
  markAllButtonText: {
    color: "#fff",
    fontFamily: "Inter-Medium",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hscale(6),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: wscale(20),
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: mscale(10),
    padding: mscale(20),
    width: "100%",
  },
  modalTitle: {
    fontSize: mscale(20),
    fontFamily: "Inter-Bold",
    // marginBottom: hscale(10),
    textAlign: "center",
  },
  modalMessage: {
    fontSize: mscale(14),
    fontFamily: "Inter-Regular",
    color: colors.bodyText,
  },
  modalTimestamp: {
    marginTop: hscale(10),
    fontSize: mscale(12),
    color: "#888",
    textAlign: "right",
    fontFamily: "Inter-Light",
  },
  modalCloseButton: {
    marginTop: hscale(20),
    backgroundColor: colors.primary,
    paddingVertical: mscale(8),
    borderRadius: mscale(6),
    alignItems: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontFamily: "Inter-Medium",
    fontSize: mscale(14),
  },
});
