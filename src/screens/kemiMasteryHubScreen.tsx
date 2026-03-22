import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";

const { height } = Dimensions.get("window");

export default function KemiMasteryHubScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const features = [
    {
      id: "quiz",
      title: "Create Quiz",
      description: "Transform your raw notes into an\ninteractive challenge.",
      icon: "list",
      backgroundColor: "rgba(255, 255, 255, 0.45)",
      route: "/createQuiz",
      buttonText: "START CREATING",
      badgeIcon: "pencil",
    },
    {
      id: "flashcards",
      title: "Flashcards",
      description: "AI-driven memorization sets for rapid\nlearning.",
      icon: "layers",
      backgroundColor: "rgba(255, 255, 255, 0.55)",
      route: "/generateFlashcards",
      buttonText: "GENERATE NOW",
    },
    {
      id: "lesson",
      title: "Curate Lesson",
      description: "Design a customized educational\npathway.",
      icon: "book",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      route: "/createLesson",
      buttonText: "DESIGN PATH",
    },
  ];

  const filteredFeatures = features.filter(
    (f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <LinearGradient
      colors={["#8224E3", "#AB6CE6", "#FAF4FF"]}
      style={[
        styles.container,
        Platform.OS === "web" && {
          position: "fixed" as any,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        },
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.topBarWrapper}>
        <View style={styles.topBar}>
          {!isSearching ? (
            <>
              <View style={styles.brandContainer}>
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="flash" size={18} color="#FACC15" />
                </View>
                <View>
                  <Text style={styles.brandName}>Kemi</Text>
                  <Text style={styles.brandSub}>MASTERY HUB</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => setIsSearching(true)}
              >
                {/* <Ionicons name="search" size={18} color={colors.white} /> */}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.searchBarContainer}>
              <TouchableOpacity
                onPress={() => {
                  setIsSearching(false);
                  setSearchQuery("");
                }}
              >
                <Ionicons name="close" size={24} color={colors.white} />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Search features..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                autoFocus
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="search" size={20} color={colors.white} />
            </View>
          )}
        </View>
      </View>

      <SafeAreaView
        style={[
          styles.safeArea,
          Platform.OS === "web" && {
            width: "100%",
            maxWidth: 800,
            alignSelf: "center",
            flex: 1,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Unlock your{"\n"}potential.</Text>
            <Text style={styles.heroSubtitle}>What will we learn today?</Text>
          </View>

          <View style={styles.cardsContainer}>
            {filteredFeatures.map((item) => (
              <View
                key={item.id}
                style={[styles.card, { backgroundColor: item.backgroundColor }]}
              >
                <View style={styles.cardHeader}>
                  <Ionicons
                    name={item.icon as any}
                    size={32}
                    color={colors.primary}
                  />
                  {item.badgeIcon && (
                    <View style={styles.iconBadge}>
                      <Ionicons
                        name={item.badgeIcon as any}
                        size={14}
                        color={colors.primary}
                      />
                    </View>
                  )}
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => router.push(item.route as any)}
                >
                  <Text style={styles.cardButtonText}>{item.buttonText}</Text>
                </TouchableOpacity>
              </View>
            ))}

            {filteredFeatures.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color="rgba(255,255,255,0.5)"
                />
                <Text style={styles.noResultsText}>
                  No features found for "{searchQuery}"
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 20,
    minHeight: height,
  },
  topBarWrapper: {
    width: "100%",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#1A171C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  brandName: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.white,
    lineHeight: 22,
  },
  brandSub: {
    fontWeight: "bold",
    fontSize: 10,
    color: colors.white,
    letterSpacing: 1,
    opacity: 0.8,
  },
  searchButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  heroTitle: {
    fontWeight: "bold",
    fontSize: 32,
    color: colors.white,
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  cardsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  card: {
    width: "100%",
    maxWidth: 600, // add a cap so they don't stretch forever on tablets
    borderRadius: 24,
    paddingVertical: 35,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
    justifyContent: "center",
  },
  iconBadge: {
    position: "absolute",
    bottom: -4,
    right: -8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 10,
    padding: 2,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 22,
    color: colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 15,
  },
  cardButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    width: "80%",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  cardButtonText: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.white,
    letterSpacing: 0.5,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    paddingHorizontal: 10,
    height: "100%",
    outlineStyle: "none",
  } as any,
  noResultsContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  noResultsText: {
    color: colors.white,
    fontSize: 16,
    marginTop: 15,
    opacity: 0.8,
  },
});
