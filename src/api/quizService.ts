import { Platform } from "react-native";
import { API_BASE_URL, AUTH_API_CLIENT } from "./apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const mapQuizType = (type: string) => {
  switch (type) {
    case "Multiple Choice":
      return "multiple_choice";
    case "True/False":
      return "true_false";
    case "Fill in the Blank":
      return "fill_in_blank";
    default:
      return "multiple_choice";
  }
};

export const createQuiz = async ({
  topic,
  file,
  difficulty,
  quizType,
}: any) => {
  try {
    console.log("FILE OBJECT:", file);
    console.log("URI:", file?.uri);
    console.log("TYPE:", file?.mimeType);
    console.log("NAME:", file?.name);

    // ✅ 1. NO FILE → axios (works fine)
    if (!file) {
      const response = await AUTH_API_CLIENT.post("/quiz/", {
        topic,
        difficulty: difficulty.toLowerCase(),
        // quiz_type: mapQuizType(quizType),
      });

      return response.data;
    }

    // ✅ 2. FILE → use fetch (ANDROID SAFE)
    const formData = new FormData();

    if (topic) {
      formData.append("topic", topic);
    }

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
    // formData.append("quiz_type", mapQuizType(quizType));

    // ✅ fetch needs manual token
    const tokenData = await AsyncStorage.getItem("User");
    const token = tokenData ? JSON.parse(tokenData)?.tokens?.accessToken : null;

    const response = await fetch(`${API_BASE_URL}/quiz/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ DO NOT set Content-Type
      },
      body: formData,
    });

    const data = await response.json();

    console.log("📡 QUIZ RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to generate quiz");
    }

    return data;
  } catch (error: any) {
    console.log("❌ QUIZ ERROR:", error);

    throw new Error(error.message || "Failed to generate quiz");
  }
};
