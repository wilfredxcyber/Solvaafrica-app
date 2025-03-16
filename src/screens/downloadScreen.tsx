import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View, RefreshControl, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { open } from "react-native-file-viewer-turbo";
import { FlashList } from "@shopify/flash-list";
import * as FileSystem from "expo-file-system";
import { useCallback, useState } from "react";

import { DownloadItemView } from "../components/downloadItemView";
import { hscale, mscale } from "../helpers/metric";
import { globalStyles } from "../styles/global";
import { DownloadedFileRef } from "../types";
import { colors } from "../constants/theme";

export default function DownloadScreen() {
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

  const handleOpenItem = async (item: DownloadedFileRef) => {
    try {
      await open(item.filePath);
    } catch (error) {
      Alert.alert("File error!", "Could not open this file");
      console.log("Could not open file", error);
    }
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
              parentDirectory={item.parentDirectory}
              onDeletePress={() => handleDeleteItem(item)}
              onItemPress={() => handleOpenItem(item)}
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
