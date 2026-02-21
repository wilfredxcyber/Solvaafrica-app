import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";

import { AUTH_API_CLIENT } from "../api/apiClient";

async function fetchTask(id: string) {
  const res = await AUTH_API_CLIENT.get(`/tasks/${id}`);
  return res.data.data;
}

async function submitTask(payload: { taskId: string; link: string }) {
  const res = await AUTH_API_CLIENT.post("/submissions/create", payload);
  return res.data.data;
}

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [link, setLink] = useState("");
  const [certified, setCertified] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTask(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: submitTask,
    onSuccess: () => {
      Alert.alert("Success", "Task submitted successfully");
      setLink("");
      setCertified(false);
    },
    onError: () => {
      Alert.alert("Error", "Submission failed");
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text>Could not load task</Text>
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
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.text}>{data.overview}</Text>

        <TextInput
          value={link}
          onChangeText={setLink}
          placeholder="Paste content link"
          style={styles.input}
        />

        <Pressable
          onPress={() => setCertified(!certified)}
          style={styles.checkboxRow}
        >
          <View style={[styles.checkbox, certified && styles.checked]} />
          <Text>I certify this is my work</Text>
        </Pressable>

        <Pressable
          disabled={!link || !certified || mutation.isPending}
          onPress={() => mutation.mutate({ taskId: id!, link })}
          style={[
            styles.submitBtn,
            (!link || !certified) && styles.disabled,
          ]}
        >
          <Text style={styles.submitText}>
            {mutation.isPending ? "Submitting..." : "Submit Task"}
          </Text>
        </Pressable>
      </ScrollView>
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
  title: { fontSize: 18, fontWeight: "700" },
  text: { marginTop: 6, color: "#555" },
  input: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  checked: { backgroundColor: "#000" },
  submitBtn: {
    marginTop: 20,
    backgroundColor: "#5B21B6",
    padding: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  disabled: { opacity: 0.5 },
  submitText: { color: "#fff", fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
