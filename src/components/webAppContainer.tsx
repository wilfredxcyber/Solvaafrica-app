import React, { ReactNode } from "react";
import { View, StyleSheet, Platform } from "react-native";

type Props = {
  children: ReactNode;
};

export default function WebAppContainer({ children }: Props) {
  if (Platform.OS !== "web") {
    // On mobile
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
    // Platform-specific styles for web
    ...Platform.select({
      web: {
        // Use number for web height (100vh equivalent)
        height: '100vh' as any, 
        minHeight: '100vh' as any,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      },
      default: {
        // Mobile styles (empty or default)
        backgroundColor: '#ffffff',
      },
    }),
  },
  contentWrapper: {
    flex:1,
    // Platform-specific styles for web
    ...Platform.select({
      web: {
        width: '100%',
        maxWidth: 800,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        // Web-only CSS properties
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' as any,
        overflow: 'hidden' as any,
      },
      default: {
        // Mobile: full width
        width: '100%',
      },
    }),
  },
});