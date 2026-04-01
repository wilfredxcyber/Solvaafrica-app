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
  Animated,
  LayoutAnimation,
  UIManager,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { createLesson } from "../api/lessonService";

// Enable layout animation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CreateLessonScreen() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<any>(null);
  const [structure, setStructure] = useState("Standard");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [isGenerating, setIsGenerating] = useState(false);

  // Accordion states
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    Introduction: true,
    "Theory & Concepts": false,
    "Practical Examples": false,
    "Interactive Activities": false,
  });

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });
      if (result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        setFile(pickedFile);

        // Simulate AI extraction and outline update
        setIsGenerating(true);
        setTimeout(() => {
          setOutlineItems([
            {
              title: "Project Overview",
              content: `Detailed analysis of objectives found in ${pickedFile.name}.`,
            },
            {
              title: "Core Methodology",
              content: "Step-by-step breakdown of the technical approach.",
            },
            {
              title: "Resource Allocation",
              content: "Timeline and budget estimates extracted from the file.",
            },
            {
              title: "Risk Assessment",
              content:
                "Identified potential bottlenecks and mitigation strategies.",
            },
          ]);
          setExpandedSections({ "Project Overview": true });
          setIsGenerating(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error picking document: ", error);
    }
  };

  const [outlineItems, setOutlineItems] = useState([
    {
      title: "Introduction",
      content: "Overview of the topic and key learning objectives.",
    },
    {
      title: "Theory & Concepts",
      content: "In-depth explanation of the fundamental principles.",
    },
    {
      title: "Practical Examples",
      content: "Real-world applications and demonstrations.",
    },
    {
      title: "Interactive Activities",
      content: "Exercises and questions to reinforce learning.",
    },
  ]);

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
            <Text style={styles.headerTitle}>Create Lesson</Text>
            <View style={styles.backButton} />
          </View>

          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.pageTitle}>Create Lesson</Text>
            <Text style={styles.subtext}>
              Generate personalized lesson plans with AI
            </Text>

            {/* Topic Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Enter your lesson topic</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Photosynthesis in plants"
                  placeholderTextColor="#A098AE"
                  value={topic}
                  onChangeText={setTopic}
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
              style={styles.uploadContainer}
              onPress={handlePickDocument}
            >
              <Ionicons
                name={file ? "document-text" : "cloud-upload"}
                size={28}
                color={colors.primary}
              />
              <Text style={styles.uploadText} numberOfLines={1}>
                {file ? file.name : "Upload PDF or DOCX"}
              </Text>
              <Text style={styles.uploadSubtext}>
                AI will extract content from your files
              </Text>
            </TouchableOpacity>

            {/* Lesson Structure Cards */}
            <Text style={styles.fieldLabel}>Choose Lesson Structure</Text>
            <View style={styles.structureContainer}>
              <TouchableOpacity
                style={[
                  styles.structureCard,
                  structure === "Standard" && styles.structureCardActive,
                ]}
                onPress={() => setStructure("Standard")}
              >
                <Ionicons
                  name="list"
                  size={24}
                  color={structure === "Standard" ? colors.primary : "#A098AE"}
                  style={styles.cardIcon}
                />
                <Text
                  style={[
                    styles.cardTitle,
                    structure === "Standard" && styles.cardTitleActive,
                  ]}
                >
                  Standard
                </Text>
                <Text style={styles.cardDesc}>
                  Intro - Key Points - Summary
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.structureCard,
                  structure === "Deep Dive" && styles.structureCardActive,
                ]}
                onPress={() => setStructure("Deep Dive")}
              >
                <Ionicons
                  name="flask-outline"
                  size={24}
                  color={structure === "Deep Dive" ? colors.primary : "#A098AE"}
                  style={styles.cardIcon}
                />
                <Text
                  style={[
                    styles.cardTitle,
                    structure === "Deep Dive" && styles.cardTitleActive,
                  ]}
                >
                  Deep Dive
                </Text>
                <Text style={styles.cardDesc}>
                  Research - Theory - Analysis
                </Text>
              </TouchableOpacity>
            </View>

            {/* AI-Generated Outline Section */}
            <View style={styles.outlineHeaderRow}>
              <Text style={styles.sectionTitle}>AI-Generated Outline</Text>
              <TouchableOpacity>
                <Ionicons name="refresh" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.outlineList}>
              {outlineItems.map((item, index) => (
                <View key={index} style={styles.outlineItemCard}>
                  <TouchableOpacity
                    style={styles.outlineItemHeader}
                    onPress={() => toggleSection(item.title)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.outlineItemTitleRow}>
                      <Ionicons
                        name={
                          expandedSections[item.title]
                            ? "chevron-down"
                            : "chevron-forward"
                        }
                        size={16}
                        color="#A098AE"
                        style={{ marginRight: 10 }}
                      />
                      <Text style={styles.outlineItemTitle}>{item.title}</Text>
                    </View>
                    <TouchableOpacity>
                      <Ionicons name="pencil" size={16} color="#A098AE" />
                    </TouchableOpacity>
                  </TouchableOpacity>

                  {expandedSections[item.title] && (
                    <View style={styles.outlineItemBody}>
                      <TextInput
                        style={styles.outlineEditor}
                        multiline
                        defaultValue={item.content}
                        placeholderTextColor="#A098AE"
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Difficulty Level */}
            <Text style={[styles.fieldLabel, { marginTop: 10 }]}>
              Difficulty Level
            </Text>
            <View style={styles.difficultyContainer}>
              {["Easy", "Intermediate", "Advanced"].map((diff) => (
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

            {/* Footer Actions */}
            {/* <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                if (Platform.OS === "web")
                  window.alert("Lesson saved successfully!");
                else Alert.alert("Success", "Lesson saved successfully!");
                router.push("/kemiMasteryHub");
              }}
            >
              <Ionicons
                name="save"
                size={20}
                color={colors.white}
                style={styles.playIcon}
              />
              <Text style={styles.saveButtonText}>Save Final Lesson</Text>
            </TouchableOpacity> */}

            {/* Generate Outline Button */}
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

                  const data = await createLesson({
                    topic,
                    file,
                    difficulty,
                    type: structure,
                  });

                  console.log("✅ LESSON:", data);

                  // 🔥 OPTIONAL: update outline with API response
                  if (data?.outline) {
                    setOutlineItems(data.outline);
                  }

                  Alert.alert("Success", "Lesson generated!");
                } catch (error: any) {
                  Alert.alert("Error", error.message || "Something went wrong");
                } finally {
                  setIsGenerating(false);
                }
              }}
            >
              {isGenerating ? (
                <Text style={styles.generateButtonText}>
                  Generating Outline...
                </Text>
              ) : (
                <>
                  <Ionicons
                    name="sparkles"
                    size={18}
                    color={colors.white}
                    style={styles.sparkleIcon}
                  />
                  <Text style={styles.generateButtonText}>
                    Generate Lesson Outline
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.bottomSecondaryButtons}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => {
                  if (Platform.OS === "web")
                    window.alert("Link copied to clipboard!");
                  else Alert.alert("Share", "Link copied to clipboard!");
                }}
              >
                <Ionicons
                  name="share-social"
                  size={18}
                  color={colors.primary}
                  style={styles.secIcon}
                />
                <Text style={styles.secondaryBtnText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryBtn, styles.reviewBtnBase]}
                onPress={() => {
                  if (Platform.OS === "web")
                    window.alert("Opening lesson preview...");
                  else Alert.alert("Review", "Opening lesson preview...");
                }}
              >
                <Ionicons
                  name="eye"
                  size={18}
                  color={colors.primary}
                  style={styles.secIcon}
                />
                <Text style={styles.secondaryBtnText}>Review</Text>
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
    fontSize: 14,
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
    paddingTop: 5,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 5,
  },
  subtext: {
    fontSize: 13,
    color: "#A098AE",
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#1F1F1F",
    marginBottom: 10,
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
    color: colors.primary,
  },
  uploadContainer: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    backgroundColor: "#FFFFFF",
  },
  uploadText: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 11,
    color: "#A098AE",
  },
  structureContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 25,
  },
  structureCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#F4EDF8",
    borderRadius: 12,
    padding: 15,
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  structureCardActive: {
    borderColor: colors.primary,
    backgroundColor: "#FAF5FF",
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1F1F1F",
    marginBottom: 4,
  },
  cardTitleActive: {
    color: colors.primary,
  },
  cardDesc: {
    fontSize: 10,
    color: "#A098AE",
    lineHeight: 14,
  },
  generateButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 35,
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
    fontSize: 15,
    color: colors.white,
  },
  outlineHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: colors.primary,
  },
  outlineList: {
    marginBottom: 20,
  },
  outlineItemCard: {
    borderWidth: 1,
    borderColor: "#F4EDF8",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    overflow: "hidden",
  },
  outlineItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  outlineItemTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  outlineItemTitle: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#1F1F1F",
  },
  outlineItemBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 5,
  },
  outlineEditor: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
    textAlignVertical: "top",
    outlineStyle: "none",
  } as any,
  difficultyContainer: {
    flexDirection: "row",
    backgroundColor: "#F4EDF8",
    borderRadius: 8,
    padding: 4,
    marginBottom: 35,
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
    fontSize: 12,
    color: "#6B7280",
  },
  difficultyTextActive: {
    color: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  playIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.white,
  },
  bottomSecondaryButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  reviewBtnBase: {
    backgroundColor: "#FAF5FF",
    borderWidth: 0,
  },
  secIcon: {
    marginRight: 6,
  },
  secondaryBtnText: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.primary,
  },
});
