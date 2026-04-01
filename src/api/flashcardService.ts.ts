import { Platform } from "react-native";
import { AUTH_API_CLIENT } from "./apiClient";

const mapFlashcardType = (isTrueFalse: boolean, isOpenEnded: boolean) => {
  if (isTrueFalse) return "true/false";
  if (isOpenEnded) return "open-ended";
  return "open-ended"; // fallback
};

export const createFlashcards = async ({
  topic,
  file,
  difficulty,
  isTrueFalse,
  isOpenEnded,
}: any) => {
  try {
    const formData = new FormData();
    console.log(formData);

    // ✅ topic OR file
    if (topic) formData.append("topic", String(topic));

    if (file) {
      const fileUri =
        Platform.OS === "android" ? file.uri : file.uri.replace("file://", "");

      formData.append("document", {
        uri: fileUri,
        name: file.name || "upload",
        type: file.mimeType || file.type || "application/octet-stream",
      } as any);
    }

    // ✅ required fields
    formData.append("difficulty", difficulty.toLowerCase());
    formData.append("type", mapFlashcardType(isTrueFalse, isOpenEnded));

    const response = await AUTH_API_CLIENT.post("/flashcard/", formData, {
      transformRequest: () => formData, // 🔥 important for Android
    });

    return response.data;
  } catch (error: any) {
    console.log("❌ FLASHCARD ERROR:", error?.response?.data || error);
    console.log(error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to generate flashcards",
    );
  }
};
