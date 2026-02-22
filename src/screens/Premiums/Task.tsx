import React, { useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";

import TaskCard from "../../components/taskCard";
import { AUTH_API_CLIENT } from "../../api/apiClient";

type ApiTask = {
  id: number;
  title: string;
  type: string;
  sponsorName: string;
  bannerImage: string | null;
  sponsorLogo: string | null;
  endDate: string;
  totalPool: string;
  totalSpots: number;
  usedSpots: number;
};

async function fetchTasks(): Promise<ApiTask[]> {
  const res = await AUTH_API_CLIENT.get("/tasks");
  return res.data.data;
}

function calcTimeLeft(endDate: string) {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours} hours left`;

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `${days} days left`;
}

function calcSpotsLeft(total: number, used: number) {
  const left = Math.max(0, total - used);
  return `${left} spot left`;
}

export default function ExploreTaskScreen() {
  const router = useRouter();
  const [_, setActive] = useState("high");

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["task"],
    queryFn: fetchTasks,
  });

  const tasks = useMemo(() => {
    return (data ?? []).map((t) => ({
      id: t.id.toString(),
      brandName: t.sponsorName,
      campaignType: t.type,
      title: t.title,
      timeLeft: calcTimeLeft(t.endDate),
      spotsLeft: calcSpotsLeft(t.totalSpots, t.usedSpots),
      totalPool: Number(t.totalPool),
      banner: t.bannerImage ? { uri: t.bannerImage } : undefined,
      logo: t.sponsorLogo ? { uri: t.sponsorLogo } : undefined,
    }));
  }, [data]);

  const renderItem = useCallback(
    ({ item }: any) => (
      <TaskCard
        {...item}
        onPress={() =>
          router.push({
            pathname: "/task-details",
            params: { id: item.id },
          })
        }
      />
    ),
    [router]
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Could not load tasks</Text>
        <Pressable onPress={() => refetch()}>
        <Text style={{ marginTop: 10 }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Explore Task</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No tasks available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 54,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
