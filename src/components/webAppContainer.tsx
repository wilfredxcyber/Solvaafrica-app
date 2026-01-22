import { View, StyleSheet, Platform } from "react-native";
import { Dimensions } from "react-native";
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
      <View style={styles.contentWrapper}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    minHeight: windowHeight, // Ensure the container takes up at least the viewport height
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    
  },
  contentWrapper: {
   
    width: "100%",
    maxWidth: 430, // Adjust the maximum width of the content
    backgroundColor: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)", // Web-specific styles
    overflow: "hidden",
    flexGrow: 1,
    minHeight: windowHeight - 32
    , // Adjust for padding
  },
});
