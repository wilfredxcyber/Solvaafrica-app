import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import { kemiService } from "../api/apiClient";

export default function StudyModeScreen() {
  const router = useRouter();

  // Animation mechanics
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  // Mock Data State
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      // using the mock generation service from apiClient
      const data = await kemiService.generate("flashcard", "Chemistry 101");
      setFlashcards(data as any[]);
      setIsLoading(false);
    };
    loadCards();
  }, []);

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (isFlipped) {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
      setIsFlipped(false);
    }
    if (currentIndex < 19) {
      // Mocking 20 total cards length
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.back(); // End of stack
    }
  };

  const prevCard = () => {
    if (isFlipped) {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
      setIsFlipped(false);
    }
    if (currentIndex < 19) {
      // Mocking 20 total cards length
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.back(); // End of stack
    }
  };

  const frontAnimatedStyle = {
    backfaceVisibility: "hidden" as any,
    zIndex: isFlipped ? 0 : 1,
    transform: [
      { perspective: 1000 },
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    backfaceVisibility: "hidden" as any,
    position: "absolute" as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: isFlipped ? 1 : 0,
    transform: [
      { perspective: 1000 },
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  // Safe fallbacks for display while loading
  const totalCards = 20;
  const displayIndex = currentIndex + 1;
  const currentCard = flashcards.length > 0 ? flashcards[0] : null;
  // Normally it would be flashcards[currentIndex], but mock only returns 1. We'll use the 1 card repeatedly for demo.

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
          backgroundColor: "#F7F8FC",
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
            <Text style={styles.headerTitle}>Study Mode</Text>
            <View style={styles.backButton} />
          </View>

          {/* Progress Bar Area */}
          <View style={styles.progressContainer}>
            <View style={styles.progressMeta}>
              <Text style={styles.topicText}>CHEMISTRY 101</Text>
              <Text style={styles.progressText}>
                {displayIndex} / {totalCards}
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(displayIndex / totalCards) * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* Flashcard Area */}
          <View style={styles.cardWrapper}>
            <View style={styles.flipContainer}>
              {/* Front of Card */}
              <Animated.View
                style={[styles.flashcard, frontAnimatedStyle]}
                pointerEvents={!isFlipped ? "auto" : "none"}
              >
                <View style={styles.cardInnerTopRow}>
                  <View style={styles.aiBadge}>
                    <Ionicons
                      name="sparkles"
                      size={14}
                      color={colors.primary}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.aiBadgeText}>AI ASSIST</Text>
                  </View>
                </View>

                <View style={styles.cardCenterContent}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="beaker" size={36} color={colors.primary} />
                  </View>
                  <Text style={styles.cardQuestion}>
                    {isLoading
                      ? "Loading..."
                      : "What is the chemical symbol for Gold?"}
                  </Text>
                  <Text style={styles.cardHint}>
                    {isLoading ? "" : "Think about the Latin name 'Aurum'"}
                  </Text>
                </View>

                <View style={styles.cardBottomRow}>
                  <TouchableOpacity
                    style={styles.flipButton}
                    onPress={flipCard}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="sync"
                      size={20}
                      color={colors.white}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.flipButtonText}>Tap to Flip</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              {/* Back of Card */}
              <Animated.View
                style={[
                  styles.flashcard,
                  styles.flashcardBackBase,
                  backAnimatedStyle,
                ]}
                pointerEvents={isFlipped ? "auto" : "none"}
              >
                <View style={styles.cardInnerTopRow}>
                  <View style={styles.aiBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color="#10B981"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.aiBadgeText, { color: "#10B981" }]}>
                      ANSWER
                    </Text>
                  </View>
                </View>

                <View style={styles.cardCenterContent}>
                  <Text style={styles.cardAnswerText}>Au</Text>
                  <Text style={styles.cardHint}>
                    {isLoading
                      ? ""
                      : currentCard?.back ||
                        "Automated AI definition based on your notes."}
                  </Text>
                </View>

                <View style={styles.cardBottomRow}>
                  <TouchableOpacity
                    style={[styles.flipButton, { backgroundColor: "#F4EDF8" }]}
                    onPress={flipCard}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="sync"
                      size={20}
                      color={colors.primary}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[styles.flipButtonText, { color: colors.primary }]}
                    >
                      Flip Back
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </View>

          {/* Feedback Buttons Area */}
          <View style={styles.evaluationSection}>
            <Text style={styles.evaluationTitle}>HOW WAS THIS CARD?</Text>
            <View style={styles.feedbackRow}>
              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={nextCard}
              >
                <View style={styles.feedbackIconCircle}>
                  <Ionicons name="sad" size={28} color={colors.primary} />
                </View>
                <Text style={styles.feedbackLabel}>HARD</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={nextCard}
              >
                <View style={styles.feedbackIconCircle}>
                  <Ionicons name="happy" size={28} color={colors.primary} />
                </View>
                <Text style={styles.feedbackLabel}>GOOD</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={nextCard}
              >
                <View style={styles.feedbackIconCircle}>
                  <Ionicons
                    name="happy-outline"
                    size={28}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.feedbackLabel}>EASY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FC",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
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
  progressContainer: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  topicText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#A098AE",
    letterSpacing: 1,
  },
  progressText: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.primary,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: "#F4EDF8",
    borderRadius: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    perspective: "1000px" as any,
  },
  flipContainer: {
    width: "100%",
    maxWidth: 450,
    flex: 1,
    minHeight: 400,
    maxHeight: 650,
    position: "relative",
  },
  flashcard: {
    width: "100%",
    height: "100%", // Fit exactly to flipContainer bounds
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 20,
    justifyContent: "space-between",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  flashcardBackBase: {
    backgroundColor: "#FAF5FF", // slight tint for the back of card
  },
  cardInnerTopRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4EDF8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  aiBadgeText: {
    fontWeight: "bold",
    fontSize: 10,
    color: colors.primary,
  },
  cardCenterContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F4EDF8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  cardQuestion: {
    fontWeight: "bold",
    fontSize: 24,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
    lineHeight: 32,
  },
  cardAnswerText: {
    fontWeight: "bold",
    fontSize: 48,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 15,
  },
  cardHint: {
    fontSize: 14,
    color: "#A098AE",
    textAlign: "center",
  },
  cardBottomRow: {
    alignItems: "center",
    paddingBottom: 10,
  },
  flipButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  flipButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.white,
  },
  evaluationSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  evaluationTitle: {
    fontWeight: "bold",
    fontSize: 12,
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 15,
  },
  feedbackRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    maxWidth: 500,
    width: "100%",
  },
  feedbackButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAD6EE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#F4EDF8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  feedbackLabel: {
    fontWeight: "bold",
    fontSize: 12,
    color: colors.primary,
  },
});
