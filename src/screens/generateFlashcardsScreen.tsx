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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import { createFlashcards } from "../api/flashcardService.ts";

export default function GenerateFlashcardsScreen() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<any>(null);
  const [numCards, setNumCards] = useState(20);
  const [difficulty, setDifficulty] = useState("Medium");
  const [isTrueFalse, setIsTrueFalse] = useState(true);
  const [isOpenEnded, setIsOpenEnded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);

  const isTopicFilled = topic.trim().length > 0;
  const isFileSelected = !!file;

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "image/*",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (!result.canceled && result.assets?.length > 0) {
        const pickedFile = result.assets[0];

        if (Platform.OS === "web") {
          setFile(pickedFile.file);
        } else {
          setFile(pickedFile);
        }

        setTopic(""); // 🔥 clear topic
      }
    } catch (error) {
      console.error(error);
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
          backgroundColor: colors.white,
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
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Generate Flashcards</Text>
            <View style={styles.backButton} /> {/* Empty view for centering */}
          </View>

          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.subtext}>
              Create study sets instantly using AI
            </Text>

            {/* Topic Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.labelTitle}>TOPIC OR SUBJECT</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Photosynthesis"
                  placeholderTextColor="#A098AE"
                  value={topic}
                  onChangeText={(text) => {
                    setTopic(text);
                    if (text) setFile(null); // 🔥 clears file
                  }}
                  editable={!isFileSelected || isGenerating}
                />
              </View>
            </View>

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* File Upload Section */}
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
                  }}
                  style={{ marginTop: 10 }}
                >
                  <Text style={{ color: "#EF4444", fontWeight: "bold" }}>
                    Remove File
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            {/* Preview Section */}
            {/* <Text style={styles.sectionLabel}>PREVIEW</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewQuestionNumber}>QUESTION 1</Text>
              <Text style={styles.previewQuestionText}>
                What is the primary byproduct of photosynthesis?
              </Text>
              <Ionicons
                name="eye"
                size={20}
                color="#C4B5FD"
                style={styles.eyeIcon}
              />
            </View> */}

            {/* Number of Cards */}
            <View style={styles.rowBetween}>
              <Text style={styles.fieldLabel}>Number of Cards</Text>
              <View style={styles.badgeLabel}>
                <Text style={styles.badgeText}>{numCards}</Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.sliderTrack}
              onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
              onPress={(e) => {
                if (sliderWidth > 0) {
                  const event = e.nativeEvent as any;
                  const touchX =
                    event.offsetX !== undefined
                      ? event.offsetX
                      : event.locationX;
                  const percent = touchX / sliderWidth;
                  const value = Math.max(
                    1,
                    Math.min(50, Math.round(percent * 50)),
                  );
                  setNumCards(value);
                }
              }}
            >
              <View
                style={[
                  styles.sliderFill,
                  { width: `${(numCards / 50) * 100}%`, pointerEvents: "none" },
                ]}
              />
              <View
                style={[
                  styles.sliderThumb,
                  { left: `${(numCards / 50) * 100}%`, pointerEvents: "none" },
                ]}
              />
            </TouchableOpacity>

            {/* Difficulty */}
            <Text style={styles.fieldLabel}>Difficulty</Text>
            <View style={styles.difficultyContainer}>
              {["Easy", "Medium", "Hard"].map((diff) => (
                <TouchableOpacity
                  key={diff}
                  style={[
                    styles.difficultyButton,
                    difficulty === diff && styles.difficultyButtonActive,
                  ]}
                  onPress={() => setDifficulty(diff)}
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

            {/* Question Type */}
            <Text style={styles.fieldLabel}>Question Type</Text>
            <View style={styles.questionTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  isTrueFalse && styles.typeButtonActive,
                ]}
                onPress={() => setIsTrueFalse(!isTrueFalse)}
              >
                <Text style={styles.typeText}>True / False</Text>
                <View
                  style={[
                    styles.checkbox,
                    isTrueFalse && styles.checkboxActive,
                  ]}
                >
                  {isTrueFalse && (
                    <Ionicons name="checkmark" size={12} color="#FFF" />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  isOpenEnded && styles.typeButtonActive,
                ]}
                onPress={() => setIsOpenEnded(!isOpenEnded)}
              >
                <Text style={styles.typeText}>Open Ended</Text>
                <View
                  style={[
                    styles.checkbox,
                    isOpenEnded && styles.checkboxActive,
                  ]}
                >
                  {isOpenEnded && (
                    <Ionicons name="checkmark" size={12} color="#FFF" />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Bottom Action Buttons */}
            {/* <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => router.push("/studyMode")}
            >
              <Ionicons
                name="play-circle"
                size={20}
                color={colors.white}
                style={styles.playIcon}
              />
              <Text style={styles.reviewButtonText}>Review Now</Text>
            </TouchableOpacity> */}

            {/* Generate Button */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.generateButton}
                disabled={isGenerating}
                onPress={async () => {
                  try {
                    if (!topic && !file) {
                      Alert.alert(
                        "Error",
                        "Provide a topic or upload a document",
                      );
                      return;
                    }

                    setIsGenerating(true);

                    const data = await createFlashcards({
                      topic,
                      file,
                      difficulty,
                      isTrueFalse,
                      isOpenEnded,
                    });

                    const cards = data?.data?.cards;

                    Alert.alert("Success", "Flashcards generated!");

                    router.push({
                      pathname: "/studyMode",
                      params: {
                        cards: JSON.stringify(cards),
                        topic: topic || "Flashcards",
                      },
                    });
                  } catch (error: any) {
                    Alert.alert(
                      "Error",
                      error.message || "Something went wrong",
                    );
                  } finally {
                    setIsGenerating(false);
                  }
                }}
              >
                {isGenerating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons
                      name="sparkles"
                      size={18}
                      color={colors.white}
                      style={styles.sparkleIcon}
                    />
                    <Text style={styles.generateButtonText}>
                      Generate Flashcards
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.bottomSecondaryButtons}>
                <TouchableOpacity style={styles.secondaryBtn}>
                  <Ionicons name="save" size={16} color={colors.primary} />
                  <Text style={styles.secondaryBtnText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryBtn}>
                  <Ionicons
                    name="share-social"
                    size={16}
                    color={colors.primary}
                  />
                  <Text style={styles.secondaryBtnText}>Share</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: colors.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
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
    paddingTop: 10,
    paddingBottom: 40,
  },
  subtext: {
    fontSize: 14,
    color: "#1F1F1F",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  labelTitle: {
    fontWeight: "bold",
    fontSize: 11,
    color: "#1F1F1F",
    marginBottom: 8,
    letterSpacing: 1,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: "#F4EDF8",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  textInput: {
    fontSize: 14,
    color: "#1F1F1F",
    outlineStyle: "none",
  } as any,
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F4EDF8",
  },
  dividerText: {
    marginHorizontal: 15,
    fontWeight: "bold",
    fontSize: 10,
    color: "#A098AE",
  },
  uploadContainer: {
    borderWidth: 1.5,
    borderColor: "#EAD6EE",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#F9F5FB",
  },
  uploadText: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.primary,
    marginTop: 12,
  },
  generateButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  sparkleIcon: {
    marginRight: 8,
  },
  generateButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.white,
  },
  sectionLabel: {
    fontWeight: "bold",
    fontSize: 11,
    color: "#A098AE",
    letterSpacing: 1,
    marginBottom: 10,
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#EAD6EE",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  previewQuestionNumber: {
    fontWeight: "bold",
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  previewQuestionText: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  eyeIcon: {
    opacity: 0.8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  fieldLabel: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1F1F1F",
    marginBottom: 12,
  },
  badgeLabel: {
    backgroundColor: "#F4EDF8",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontWeight: "bold",
    fontSize: 12,
    color: colors.primary,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: "#F4EDF8",
    borderRadius: 4,
    marginBottom: 25,
    position: "relative",
    justifyContent: "center",
  },
  sliderFill: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  sliderThumb: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginLeft: -8, // center the thumb on the value percentage
  },
  difficultyContainer: {
    flexDirection: "row",
    backgroundColor: "#F9F5FB",
    borderRadius: 8,
    padding: 4,
    marginBottom: 25,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  difficultyButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  difficultyText: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#A098AE",
  },
  difficultyTextActive: {
    color: colors.primary,
  },
  questionTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F4EDF8",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  typeButtonActive: {
    borderColor: "#F4EDF8",
    backgroundColor: "#FFFfff",
  },
  typeText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  reviewButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  playIcon: {
    marginRight: 8,
  },
  reviewButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.white,
  },
  bottomSecondaryButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#EAD6EE",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  secIcon: {
    marginRight: 6,
  },
  secondaryBtnText: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.primary,
  },

  uploadSubtext: {
    fontSize: 10,
    color: "#A098AE",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 25 : 15,
    borderTopWidth: 1,
    borderTopColor: "#F4EDF8",
  },
});
