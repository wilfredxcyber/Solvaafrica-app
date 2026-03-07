import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";

import TaskCard from "../../components/taskCard";
import { AUTH_API_CLIENT } from "../../api/apiClient";
import { calcSpotsLeft, calcTimeLeft, normalizeTaskRecord } from "../../utils/taskNormalization";
import ProtectPage from "@/src/components/protectPage";

type ApiTask = Record<string, unknown>;

type TaskListItem = {
  id: string;
  brandName: string;
  campaignType: string;
  title: string;
  timeLeft: string;
  spotsLeft: string;
  totalPool: number;
  banner?: { uri: string };
  logo?: { uri: string };
};

async function fetchTasks(): Promise<ApiTask[]> {
  const res = await AUTH_API_CLIENT.get("/tasks");
  const payload = res.data;

  if (Array.isArray(payload?.data?.tasks)) return payload.data.tasks;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.tasks)) return payload.tasks;
  if (Array.isArray(payload)) return payload;

  throw new Error("Unexpected tasks response format");
}

export default function ExploreTaskScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"high">("high");

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const tasks = useMemo<TaskListItem[]>(() => {
    const mappedTasks = (data ?? []).map((task, index) => {
      const normalizedTask = normalizeTaskRecord(task);

      return {
        id: normalizedTask.id ?? String(task.id ?? index),
        brandName: normalizedTask.brandName ?? "Unknown Brand",
        campaignType: normalizedTask.campaignType ?? "Campaign",
        title: normalizedTask.title ?? "Untitled Campaign",
        timeLeft: calcTimeLeft(normalizedTask.endDate),
        spotsLeft: calcSpotsLeft(normalizedTask.totalSpots, normalizedTask.usedSpots),
        totalPool: normalizedTask.totalPool,
        banner: normalizedTask.bannerImage ? { uri: normalizedTask.bannerImage } : undefined,
        logo: normalizedTask.sponsorLogo ? { uri: normalizedTask.sponsorLogo } : undefined,
      };
    });

    if (activeFilter === "high") {
      return mappedTasks.sort((a, b) => b.totalPool - a.totalPool);
    }

    return mappedTasks;
  }, [activeFilter, data]);

  const renderItem = useCallback(
    ({ item }: { item: TaskListItem }) => (
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
    [router],
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6207A0" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Could not load tasks</Text>
        <Pressable onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ProtectPage>
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#111111" />
        </Pressable>
        <Text style={styles.headerTitle}>Explore Task</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.filtersRow}>
            <Pressable
              style={[styles.filterButton, styles.filterButtonActive]}
              onPress={() => setActiveFilter("high")}
            >
              <Text style={[styles.filterText, styles.filterTextActive]}>
                High Reward {"\uD83D\uDD25"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.filterButton}
              onPress={() =>
                router.push({
                  pathname: "/earning",
                  params: { tab: "Earn" },
                })
              }
            >
              <Text style={styles.filterText}>Earns</Text>
            </Pressable>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.message}>No tasks available</Text>
          </View>
        }
      />
    </SafeAreaView>
    </ProtectPage>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: 64,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111111",
  },
  filtersRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
    marginBottom: 18,
  },
  filterButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#8E8E8E",
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: "#FFFFFF",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
  },
  filterTextActive: {
    color: "#111111",
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 15,
    color: "#111111",
  },
  retryText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#6207A0",
  },
});
