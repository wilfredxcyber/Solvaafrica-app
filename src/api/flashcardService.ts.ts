import { Platform } from "react-native";
import { API_BASE_URL, AUTH_API_CLIENT } from "./apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const mapFlashcardType = (isTrueFalse: boolean, isOpenEnded: boolean) => {
  if (isTrueFalse) return "true/false";
  if (isOpenEnded) return "open-ended";
  return "open-ended";
};

export const createFlashcards = async ({
  topic,
  file,
  difficulty,
  isTrueFalse,
  isOpenEnded,
}: any) => {
  try {
    // ✅ NO FILE → use axios (works perfectly)
    if (!file) {
      const response = await AUTH_API_CLIENT.post("/flashcard/", {
        topic,
        difficulty: difficulty.toLowerCase(),
        type: mapFlashcardType(isTrueFalse, isOpenEnded),
      });

      return response.data;
    }

    // ✅ FILE → use fetch (ANDROID SAFE)
    const formData = new FormData();

    if (topic) {
      formData.append("topic", topic);
    }

    // ✅ Correct file handling for all platforms
    if (Platform.OS === "web") {
      formData.append("document", file);
    } else {
      const fileData = {
        uri: file.uri, // ✅ KEEP file://
        name: file.name || "upload.jpg",
        type: file.mimeType || "image/jpeg",
      };

      console.log("📂 FILE BEING SENT:", fileData);

      formData.append("document", fileData as any);
    }

    formData.append("difficulty", difficulty.toLowerCase());
    formData.append("type", mapFlashcardType(isTrueFalse, isOpenEnded));

    // ✅ Get token manually (since fetch doesn’t use interceptors)
    const tokenData = await AsyncStorage.getItem("User");
    const token = tokenData ? JSON.parse(tokenData)?.tokens?.accessToken : null;

    console.log("🔑 TOKEN:", token ? "EXISTS" : "MISSING");

    const response = await fetch(`${API_BASE_URL}/flashcard/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ DO NOT set Content-Type
      },
      body: formData,
    });

    const data = await response.json();

    console.log("📡 RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to generate flashcards");
    }

    return data;
  } catch (error: any) {
    console.log("❌ FLASHCARD ERROR:", error);
    throw new Error(error.message || "Failed to generate flashcards");
  }
};
