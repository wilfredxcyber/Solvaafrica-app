import { StackActions, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View, RefreshControl, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
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
  const navigation = useNavigation();

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

  const handleOpenItem = (item: DownloadedFileRef) => {
    if (item.parentDirectory === 'Projects') {
      console.log('pressed item', item)
      return
    }
    navigation.dispatch(
      StackActions.push("App", { screen: "ImageViewer", params: { imageSource: item.filePath } })
    );
  };

  return (
    <View style={globalStyles.screen}>
      <Text style={{ fontFamily: "Inter-Bold", fontSize: mscale(24), color: colors.black }}>
        Downloads
      </Text>
      {downloadsList.length ? (
        <FlashList
          data={downloadsList}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <DownloadItemView
                fileCode={item.fileCode?.trim() + "(" + (index + 1) + ")"}
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
            <RefreshControl
              refreshing={refreshing}
              colors={[colors.primary]}
              onRefresh={onRefresh}
            />
          }
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Inter-Regular",
              fontSize: mscale(14),
              color: colors.bodyText,
            }}
          >
            Files you downloaded to this device will show here
          </Text>
        </View>
      )}
    </View>
  );
}
