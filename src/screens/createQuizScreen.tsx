import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";
import { API_BASE_URL } from "../api/apiClient";
import { createQuiz } from "../api/quizService";
import { formatQuizQuestions } from "@/utils/formatQuiz";

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

export default function CreateQuizScreen() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState("Medium");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<any>(null);
  const [quizType, setQuizType] = useState("Multiple Choice");
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    // {
    //   id: 1,
    //   question:
    //     "What is the primary byproduct of photosynthesis released into the atmosphere?",
    //   options: ["A) Carbon Dioxide", "B) Oxygen", "C) Nitrogen", "D) Hydrogen"],
    //   correctIndex: 1,
    // },
    // {
    //   id: 2,
    //   question:
    //     "Which pigment is responsible for absorbing light energy during photosynthesis?",
    //   options: ["A) Chlorophyll", "B) Carotene", "C) Hemoglobin", "D) Melanin"],
    //   correctIndex: 0,
    // },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const isTopicFilled = topic.trim().length > 0;
  const isFileSelected = !!file;

  const handleDeleteQuestion = (id: number) => {
    setQuizQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleEditQuestion = (id: number, newText: string) => {
    setQuizQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, question: newText } : q)),
    );
  };

  const handleShare = () => {
    if (Platform.OS === "web") {
      window.alert("Sharing your quiz link!");
    } else {
      Alert.alert("Share", "Sharing your quiz link!");
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (!result.canceled && result.assets?.length > 0) {
        const pickedFile = result.assets[0];

        if (Platform.OS === "web") {
          setFile(pickedFile.file); // ✅ MUST be File
        } else {
          setFile(pickedFile);
        }
        setTopic(""); // 🔥 CLEAR topic (important)

        // Optional: remove fake preview if using API
        setQuizQuestions([]);
      }
    } catch (error) {
      console.error("Error picking document: ", error);
    }
  };

  const handleAskKemi = async () => {
    try {
      if (!topic && !file) {
        Alert.alert("Error", "Please provide a topic or upload a document");
        return;
      }

      setIsGenerating(true);

      const data = await createQuiz({
        topic,
        file,
        difficulty,
        quizType,
      });

      const questionsFromAPI = data?.data?.questions;
      setQuizQuestions(formatQuizQuestions(questionsFromAPI));

      Alert.alert("Success", "Quiz generated successfully!");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        Platform.OS === "web" && {
          position: "fixed" as any,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          backgroundColor: colors.white, // ensures background paints full width on web
        },
      ]}
    >
      <SafeAreaView
        style={[
          styles.safeArea,
          Platform.OS === "web" && {
            width: "100%",
            maxWidth: 800,
            alignSelf: "center",
            height: "100%",
          },
        ]}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={isGenerating}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create your Quiz</Text>
            <View style={styles.backButton} /> {/* Empty view for centering */}
          </View>

          {/* Body Content */}
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Topic Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>What is the topic?</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={[styles.textInput, isFileSelected && { opacity: 0.5 }]}
                  placeholder="Photosynthesis"
                  placeholderTextColor="#A098AE"
                  value={topic}
                  onChangeText={(text) => {
                    setTopic(text);
                    if (text) setFile(null); // 🔥 clears file
                  }}
                  editable={!isFileSelected || isGenerating} // 🔥 disables typing
                />
              </View>
            </View>

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[
                styles.uploadContainer,
                isTopicFilled && { opacity: 0.5 },
              ]}
              onPress={handlePickDocument}
              disabled={isTopicFilled || isGenerating}
            >
              <Ionicons
                name={file ? "document-text" : "cloud-upload"}
                size={24}
                color={colors.primary}
              />

              <Text style={styles.uploadText} numberOfLines={1}>
                {file ? file.name : "Upload PDF, DOCX or Image"}
              </Text>

              <Text style={styles.uploadSubtext}>
                {file && file.size
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                  : "Max file size: 10MB"}
              </Text>

              {/* 🔥 ADD THIS */}
              {file && (
                <TouchableOpacity
                  onPress={() => {
                    setFile(null);
                    setQuizQuestions([]); // optional reset
                  }}
                  style={{ marginTop: 10 }}
                >
                  <Text style={{ color: "#EF4444", fontWeight: "bold" }}>
                    Remove File
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            {/* Quiz Type Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quiz Type</Text>
              <View
                style={[
                  styles.dropdownContainer,
                  {
                    paddingVertical: Platform.OS === "ios" ? 0 : 0,
                    paddingHorizontal: 0,
                    overflow: "hidden",
                  },
                ]}
              >
                <Picker
                  selectedValue={quizType}
                  onValueChange={(itemValue) => setQuizType(itemValue)}
                  enabled={!isGenerating}
                  style={
                    Platform.select({
                      web: {
                        width: "100%",
                        height: 45,
                        borderWidth: 0,
                        color: "#1F1F1F",
                        backgroundColor: "transparent",
                        paddingHorizontal: 15,
                        outlineStyle: "none",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: "500",
                      },
                      default: {
                        width: "100%",
                        color: "#1F1F1F",
                        backgroundColor: "transparent",
                      },
                    }) as any
                  }
                  dropdownIconColor={colors.primary}
                >
                  <Picker.Item
                    label="Multiple Choice"
                    value="Multiple Choice"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="True/False"
                    value="True/False"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Fill in the Blank"
                    value="Fill in the Blank"
                    style={{ fontSize: 14 }}
                  />
                </Picker>
              </View>
            </View>

            {/* AI Preview Section */}
            <View style={styles.aiPreviewHeader}>
              <Ionicons
                name="sparkles"
                size={20}
                color={colors.primary}
                style={styles.sparkleIcon}
              />
              <View>
                <Text style={styles.aiPreviewTitle}>AI Preview</Text>
                <Text style={styles.aiPreviewSubtitle}>
                  GENERATED FROM TOPIC OR FILE
                </Text>
              </View>
            </View>

            {/* Question Cards Mapping */}
            {quizQuestions.map((q, index) => (
              <View key={q.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumberText}>
                    QUESTION {index + 1}
                  </Text>
                  <View style={styles.actionIcons}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() =>
                        setEditingId(editingId === q.id ? null : q.id)
                      }
                    >
                      <Ionicons
                        name={
                          editingId === q.id ? "checkmark-circle" : "pencil"
                        }
                        size={18}
                        color={editingId === q.id ? colors.primary : "#000"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleDeleteQuestion(q.id)}
                    >
                      <Ionicons name="trash" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {editingId === q.id ? (
                  <TextInput
                    style={[styles.questionText, styles.editInput]}
                    value={q.question}
                    onChangeText={(text) => handleEditQuestion(q.id, text)}
                    multiline
                    autoFocus
                  />
                ) : (
                  <Text style={styles.questionText}>{q.question}</Text>
                )}

                <View style={styles.optionsGrid}>
                  <View style={styles.optionRow}>
                    <Text
                      style={
                        q.correctIndex === 0
                          ? styles.optionTextCorrect
                          : styles.optionText
                      }
                    >
                      {q.options[0]}
                    </Text>
                    <Text
                      style={
                        q.correctIndex === 1
                          ? styles.optionTextCorrect
                          : styles.optionText
                      }
                    >
                      {q.options[1]}
                    </Text>
                  </View>
                  <View style={styles.optionRow}>
                    <Text
                      style={
                        q.correctIndex === 2
                          ? styles.optionTextCorrect
                          : styles.optionText
                      }
                    >
                      {q.options[2]}
                    </Text>
                    <Text
                      style={
                        q.correctIndex === 3
                          ? styles.optionTextCorrect
                          : styles.optionText
                      }
                    >
                      {q.options[3]}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Difficulty */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.difficultyContainer}>
                {["Easy", "Medium", "Hard"].map((diff) => (
                  <TouchableOpacity
                    key={diff}
                    style={[
                      styles.difficultyButton,
                      difficulty === diff && styles.difficultyButtonActive,
                    ]}
                    onPress={() => setDifficulty(diff)}
                    disabled={isGenerating}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        difficulty === diff && styles.difficultyTextActive,
                      ]}
                    >
                      {diff}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bottom Buttons */}
            <View style={styles.bottomButtonsContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAskKemi}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <Ionicons
                      name="sparkles"
                      size={20}
                      color={colors.white}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.saveButtonText}>Ask Kemi</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
                disabled={isGenerating}
              >
                <Ionicons
                  name="share-social"
                  size={20}
                  color={colors.primary}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.shareButtonText}>Share with Friends</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white, // matches background
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1F1F1F",
    marginBottom: 10,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  textInput: {
    fontSize: 14,
    color: "#1F1F1F",
    outlineStyle: "none", // Remove native chrome/web focus stroke
  } as any,
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: -5,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 15,
    fontWeight: "bold",
    fontSize: 12,
    color: "#A098AE",
  },
  uploadContainer: {
    borderWidth: 1.5,
    borderColor: "#F6E1EF",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    backgroundColor: "#FFFFFF",
  },
  uploadText: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.primary,
    marginTop: 10,
    marginBottom: 6,
  },
  uploadSubtext: {
    fontSize: 10,
    color: "#A098AE",
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: "#1F1F1F",
    fontWeight: "500",
  },
  aiPreviewHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 15,
  },
  sparkleIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  aiPreviewTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1F1F1F",
    marginBottom: 2,
  },
  aiPreviewSubtitle: {
    fontSize: 10,
    color: "#A098AE",
    fontStyle: "italic",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  questionCard: {
    backgroundColor: "#F9F5FB", // Very faint purple
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionNumberText: {
    fontWeight: "bold",
    fontSize: 12,
    color: colors.primary,
    letterSpacing: 1,
  },
  actionIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
  questionText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1F1F1F",
    marginBottom: 15,
    lineHeight: 20,
  },
  optionsGrid: {
    flexDirection: "column",
  },
  optionRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  optionText: {
    flex: 1,
    fontSize: 11,
    color: "#A098AE",
  },
  optionTextCorrect: {
    flex: 1,
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primary,
  },
  difficultyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  difficultyButtonActive: {
    borderColor: colors.primary,
    backgroundColor: "#F6E1EF",
  },
  difficultyText: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#1F1F1F",
  },
  difficultyTextActive: {
    color: colors.primary,
  },
  bottomButtonsContainer: {
    marginTop: 20,
    gap: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.white,
  },
  shareButton: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  shareButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.primary,
  },
  editInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 8,
    backgroundColor: colors.white,
    outlineStyle: "none",
  } as any,
});
