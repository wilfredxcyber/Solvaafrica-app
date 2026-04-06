import { Platform } from "react-native";
import { API_BASE_URL, AUTH_API_CLIENT } from "./apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createLesson = async ({
  topic,
  file,
  difficulty,
  type,
}: {
  topic?: string;
  file?: any;
  difficulty: string;
  type: string;
}) => {
  try {
    // ✅ NO FILE → use axios
    if (!file) {
      const response = await AUTH_API_CLIENT.post("/lesson/", {
        topic,
        difficulty: difficulty.toLowerCase(),
        type: type === "Deep Dive" ? "deep-dive" : "standard",
      });

      return response.data;
    }

    // ✅ FILE → use fetch (ANDROID SAFE)
    const formData = new FormData();

    if (topic) {
      formData.append("topic", topic);
    }

    if (Platform.OS === "web") {
      formData.append("document", file);
    } else {
      const fileData = {
        uri: file.uri, // ✅ KEEP file://
        name: file.name || "document.pdf",
        type: file.mimeType || "application/pdf",
      };

      console.log("📂 LESSON FILE:", fileData);

      formData.append("document", fileData as any);
    }

    formData.append("difficulty", difficulty.toLowerCase());
    formData.append("type", type === "Deep Dive" ? "deep-dive" : "standard");

    // ✅ get token manually
    const tokenData = await AsyncStorage.getItem("User");
    const token = tokenData ? JSON.parse(tokenData)?.tokens?.accessToken : null;

    const response = await fetch(`${API_BASE_URL}/lesson/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ DO NOT set Content-Type
      },
      body: formData,
    });

    const data = await response.json();

    console.log("📡 LESSON RESPONSE:", data);

    if (!response.ok) {
      throw new Error(
        data?.message || data?.detail || "Failed to create lesson",
      );
    }

    return data;
  } catch (error: any) {
    console.log("❌ LESSON ERROR:", error);

    throw new Error(error.message || "Failed to create lesson");
  }
};
