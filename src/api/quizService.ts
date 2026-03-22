import { Platform } from "react-native";
import { AUTH_API_CLIENT } from "./apiClient";

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
    // ✅ 1. NO FILE → JSON (fast, no CORS issues)
    if (!file) {
      const response = await AUTH_API_CLIENT.post("/quiz/", {
        topic,
        difficulty: difficulty.toLowerCase(),
        // 👇 add back if backend needs it
        // quiz_type: mapQuizType(quizType),
      });

      return response.data;
    }

    // ✅ 2. FILE EXISTS → FormData
    const formData = new FormData();

    if (topic) {
      formData.append("topic", topic);
    }

    // 🔥 KEY PART (web vs mobile)
    if (Platform.OS === "web") {
      formData.append("document", file);
    } else {
      formData.append("document", {
        uri: file.uri,
        name: file.name || "upload.jpg",
        type: file.mimeType || "image/jpeg",
      } as any);
    }

    formData.append("difficulty", difficulty.toLowerCase());
    // formData.append("quiz_type", mapQuizType(quizType));

    const response = await AUTH_API_CLIENT.post("/quiz/", formData, {
      //   headers: {
      //     Accept: "application/json",
      //   },
    });

    return response.data;
  } catch (error: any) {
    console.log("❌ FULL ERROR:", error);
    console.log("❌ RESPONSE:", error?.response);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to generate quiz",
    );
  }
};
