import { View, Text } from "react-native";
import React from "react";
import { globalStyles } from "@/src/styles/global";
import InProgress from "@/src/components/inprogress";

export default function Task() {
  return (
    <View style={globalStyles.screen}>
      <InProgress />
    </View>
  );
}