import { View, StyleSheet, Platform, Dimensions } from "react-native";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const { height: windowHeight } = Dimensions.get("window");

export default function WebAppContainer({ children }: Props) {
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <View style={styles.webContainer}>
      <View style={styles.mobileBoundary}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    minHeight: windowHeight,
    paddingVertical: 40,
    paddingHorizontal: 8,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },

  // NOT a "card", just a width boundary
  mobileBoundary: {
    width: "100%",
    maxWidth: 435,
    flex: 1,
  },
});
