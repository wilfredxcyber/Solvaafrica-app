import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { mscale, hscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";

export default function InitialServiceScreen() {
  const navigation = useNavigation();
  const handleNav = () => {
    navigation.navigate("App", { screen: "Services" });
  };

  return (
    <ImageBackground
      source={require("@/assets/images/services/serviceBg2.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}>
          Find & connect with service providers around you!
        </Text>

        <TouchableOpacity style={styles.ctaButton} onPress={handleNav}>
          <Text style={styles.ctaText}>Explore our services</Text>
          <AntDesign name="arrowright" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  content: {
    paddingHorizontal: mscale(20),
    alignItems: "center",
    gap: mscale(40),
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(28),
    textAlign: "center",
    color: "black",
    lineHeight: hscale(40),
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: mscale(24),
    paddingVertical: mscale(12),
    borderRadius: mscale(10),
    gap: mscale(10),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Inter-SemiBold",
    fontSize: mscale(16),
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: mscale(14),
    paddingHorizontal: mscale(28),
    borderRadius: mscale(100), 
    gap: mscale(8),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  ctaText: {
    color: "#fff",
    fontSize: mscale(16),
    fontFamily: "Inter-SemiBold",
  },
});
