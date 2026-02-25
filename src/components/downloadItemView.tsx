import { Pressable, StyleSheet, Text, View } from "react-native";
import DeleteIcon from "@expo/vector-icons/MaterialIcons";
import PDFIcon from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";

import { hscale, mscale, wscale } from "../helpers/metric";
import { DownloadItemViewProps } from "../types";
import { colors } from "../constants/theme";

export const DownloadItemView = ({
  source,
  fileCode,
  fileName,
  parentDirectory,
  onItemPress,
  onDeletePress,
}: DownloadItemViewProps) => {
  const isPdfFile =
    fileName?.toLowerCase().endsWith(".pdf") || source?.toLowerCase().includes(".pdf");

  return (
    <Pressable style={styles.downloadItemView} onPress={onItemPress}>
      {/* left side */}
      <View style={styles.downloadItemViewLeftSide}>
        {isPdfFile ? (
          <PDFIcon name="file-pdf" size={36} color={colors.primary} />
        ) : parentDirectory === "Courses" ? (
          <Image source={source} style={{ width: wscale(40), height: hscale(40) }} />
        ) : null}
        <Text numberOfLines={1} style={styles.text}>
          {fileCode ? fileCode + " " + fileName : fileName}
        </Text>
      </View>
      {/* right side */}
      {onDeletePress && (
        <Pressable onPress={onDeletePress}>
          <DeleteIcon name="delete" size={20} color={"red"} />
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  downloadItemView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hscale(20),
  },
  downloadItemViewLeftSide: { flexDirection: "row", alignItems: "center" },
  text: {
    fontFamily: "Inter-Medium",
    fontSize: mscale(12),
    marginLeft: 12,
  },
});
