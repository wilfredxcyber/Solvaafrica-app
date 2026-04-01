import { AUTH_API_CLIENT } from "./apiClient";

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
  const formData = new FormData();

  // ✅ topic
  if (topic) {
    formData.append("topic", topic);
  }

  // ✅ file
  if (file) {
    formData.append("document", {
      uri: file.uri,
      name: file.name || "document.pdf",
      type: file.mimeType || "application/pdf",
    } as any);
  }

  // ✅ normalize values
  formData.append("difficulty", difficulty.toLowerCase());
  formData.append("type", type === "Deep Dive" ? "deep-dive" : "standard");

  try {
    const response = await AUTH_API_CLIENT.post("/lesson/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: () => formData,
    });

    // ✅ Axios already parses JSON
    return response.data;
  } catch (error: any) {
    console.log("❌ API ERROR:", error?.response?.data || error.message);

    throw new Error(
      error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to create lesson",
    );
  }
};
