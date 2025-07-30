import React from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { mscale, hscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";

export default function Complaints() {
  const email = "support@example.com"; 

  return (
    <View style={[globalStyles.screen, styles.container]}>
      <Text style={styles.header}>Submit a Complaint</Text>
      <Text style={styles.body}>
        If you have any complaints, please send an email to{" "}
        <Text
          style={styles.email}
          onPress={() => Linking.openURL(`mailto:${email}`)}
        >
          {email}
        </Text>
        . We’ll respond as soon as possible.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: hscale(20),
  },
  header: {
    fontSize: mscale(18),
    fontFamily: "Inter-Bold",
    marginBottom: hscale(10),
  },
  body: {
    fontSize: mscale(14),
    fontFamily: "Inter-Regular",
    color: colors.bodyText,
    lineHeight: hscale(22),
  },
  email: {
    color: colors.primary,
    textDecorationLine: "underline",
    fontFamily: "Inter-Medium",
  },
});
