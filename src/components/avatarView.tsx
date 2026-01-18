import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

import { hscale, mscale, wscale } from "../helpers/metric";
import { useAuthStore } from "../stores/authStore";
import { colors } from "../constants/theme";
import { Platform } from "expo-modules-core";

export default function AvatarView() {
  const user = useAuthStore((state) => state.user);
  const { fullName } = user.profile;
  const [firstName, lastName] = fullName.trim().split(" ");
  const [userNamePrefix, setUserNamePrefix] = useState("");

  useEffect(() => {
    setUserNamePrefix(firstName[0] + lastName[0]);
  }, [fullName]);

  return (
    <View style={styles.avatarView}>
      <Text style={styles.avatarViewText}>{userNamePrefix.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarView: {
    width: wscale(40),
    height: hscale(40),
    backgroundColor: colors.primary,
    borderRadius: mscale(30),
    justifyContent: "center",
    ...Platform.select({
      web: {
        maxWidth: '100%',
        maxHeight: 'auto',
      }
    })
  },
  avatarViewText: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(14),
    color: "#ffffff",
    textAlign: "center",
    textTransform: "uppercase",
  },
});
