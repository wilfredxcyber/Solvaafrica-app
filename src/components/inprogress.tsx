import { View, Text, Image } from "react-native";
import React from "react";
import { wscale, hscale } from "../helpers/metric";

export default function InProgress() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View>
        <Image
          source={require("../../assets/images/inprogress.png")}
          style={{
            width: wscale(300),
            height: hscale(300),
            // marginHorizontal: "auto",
          }}
        />
      </View>
    </View>
  );
}
