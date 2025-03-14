import { Text, View, RefreshControl, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeleteIcon from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import * as FileSystem from "expo-file-system";
import { useCallback, useState } from "react";
import { Image } from "expo-image";

import { hscale, mscale, wscale } from "../helpers/metric";
import { globalStyles } from "../styles/global";
import { DownloadedFileRef } from "../types";
import { colors } from "../constants/theme";

export default function DownloadScreen() {
  const navigation = useNavigation();
  const [downloadsList, setDownloadsList] = useState<DownloadedFileRef[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchDonwloads = async () => {
        const downloadsRefListInStore = await AsyncStorage.getItem("DownloadRefs");
        if (downloadsRefListInStore) {
          const downloadsRefList = JSON.parse(downloadsRefListInStore);
          setDownloadsList(downloadsRefList);
          setRefreshing(false);
        }
      };

      fetchDonwloads();
    }, [refreshing])
  );

  const onRefresh = () => {
    setRefreshing(true);
  };

  const handleDeleteItem = async (item: DownloadedFileRef) => {
    const downloadsInStore = await AsyncStorage.getItem("DownloadRefs");
    const downloadList: DownloadedFileRef[] = downloadsInStore && JSON.parse(downloadsInStore);

    // Delete actual file from device storage !important
    await FileSystem.deleteAsync(item.filePath);
    // Remove the file reference !important
    const filteredDownloadRefList = downloadList.filter(
      (currentItem) => currentItem.filePath !== item.filePath
    );
    await AsyncStorage.setItem("DownloadRefs", JSON.stringify(filteredDownloadRefList));
    // update state
    setRefreshing(true);
  };

  return (
    <View style={globalStyles.screen}>
      <Text style={{ fontFamily: "Inter-Bold", fontSize: mscale(24), color: colors.black }}>
        Downloads
      </Text>
      <FlashList
        data={downloadsList}
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <DownloadItemView
              fileCode={item.fileCode + "(" + (index + 1) + ")"}
              source={item.filePath}
              fileName={item.fileName}
              onDeletePress={() => handleDeleteItem(item)}
            />
          );
        }}
        contentContainerStyle={{ paddingVertical: hscale(20) }}
        refreshControl={
          <RefreshControl refreshing={refreshing} colors={[colors.primary]} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const DownloadItemView = ({
  source,
  fileCode,
  fileName,
  onDeletePress,
}: {
  source: string;
  fileCode: string;
  fileName: string;
  onDeletePress: (item: string) => void;
}) => {
  return (
    <View style={styles.downloadItemView}>
      {/* left side */}
      <View style={styles.downloadItemViewLeftSide}>
        <Image source={source} style={{ width: wscale(40), height: hscale(40) }} />
        <Text numberOfLines={1} style={styles.text}>
          {fileCode ? fileCode + " " + fileName : fileName}
        </Text>
      </View>
      {/* right side */}
      <DeleteIcon name="delete" size={20} color={"red"} onPress={() => onDeletePress(source)} />
    </View>
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
    fontSize: mscale(16),
    marginLeft: 12,
  },
});
