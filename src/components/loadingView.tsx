import { View, StyleSheet, ActivityIndicator, Text } from "react-native";

import { colors } from "../constants/theme";
import { mscale } from "../helpers/metric";

export default function LoadingView({ isLoading }: { isLoading: boolean }) {
  return isLoading ? (
    <View style={styles.loadingView}>
      <ActivityIndicator color={colors.primary} size={"large"} />
      <Text style={{
        fontSize: mscale(14),
        fontFamily: "Inter-Medium",
        color: colors.primary,
        textAlign: "center",
        
      }}> Loading, Please wait</Text>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  loadingView: {
    backgroundColor: "#ffffff",
    position: "absolute",
    marginHorizontal: "auto",
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "center",
    zIndex: 9900,
  },
});
