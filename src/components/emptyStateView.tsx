import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

import { mscale, wscale } from "../helpers/metric";
import { globalStyles } from "../styles/global";


const ThinkingMan = require("../../assets/images/ThinkingMan.png");

export default function EmptyStateView() {
  return (
    <View>
      <Image
        source={ThinkingMan}
        style={{
          width: wscale(300),
          aspectRatio: 1,
          marginHorizontal: "auto",
        }}
      />
      <Text style={styles.text}>Hmmmmmm.</Text>
      <Text style={[styles.text, globalStyles.bodyText]}>
        Kindly check back later, we are so sorry.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: { fontFamily: "Inter-Bold", fontSize: mscale(20), textAlign: "center" },
});
