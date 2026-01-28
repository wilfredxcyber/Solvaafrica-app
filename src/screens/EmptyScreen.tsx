// EmptyScreen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@/src/constants/theme";

export default function EmptyScreen() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white, // white background
  },
});
