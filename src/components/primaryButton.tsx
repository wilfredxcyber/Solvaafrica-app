import { Pressable, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useState } from "react";

import { hscale, mscale } from "../helpers/metric";
import { colors } from "../constants/theme";
import { Platform } from "react-native";

type TprimaryButtonProps = { text: string; onPress: () => void; isLoading?: boolean };

export default function PrimaryButton({ text, onPress, isLoading = false }: TprimaryButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      style={[styles.buttonView, { opacity: pressed ? 0.9 : 1 }]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={isLoading}
    >
      {!isLoading ? (
        <Text style={styles.buttonText}>{text}</Text>
      ) : (
        <ActivityIndicator size={"small"} color={"#ffffff"} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonView: {
  backgroundColor: colors.primary,
  width: "100%",
  borderRadius: mscale(100),
  minHeight: hscale(60),
  justifyContent: "center",
  alignItems: "center", 
  ...Platform.select({
    web: {
      cursor: 'pointer' as any,
      outlineStyle: 'none' as any,
    }
  })
  },
  buttonText: {
    textAlign: "center",
    color: "#ffffff",
    fontFamily: "Inter-Medium",
    fontSize: mscale(16),
    textTransform: "capitalize",
  },
});
