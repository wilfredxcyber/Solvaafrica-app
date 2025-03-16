import { StackActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";

import { DownloadItemView } from "../components/downloadItemView";
import { SearchBoxView } from "../components/searchBoxView";
import { DownloadedFileRef, FileDirectory } from "../types";
import { hscale, mscale } from "../helpers/metric";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";

export default function FilterScreen() {
  const [currentTab, setCurrentTab] = useState<FileDirectory>("Courses");
  const [filterQuery, setFilterQuery] = useState("");
  const [filteredList, setFilterdList] = useState<DownloadedFileRef[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    //  get all downloads via cached refs
    const getDownloads = async () => {
      const downloadRefs = await AsyncStorage.getItem("DownloadRefs");
      const downloads: DownloadedFileRef[] = downloadRefs && JSON.parse(downloadRefs);

      if (!filterQuery.trim().length) {
        setFilterdList([]);
        return;
      }

      if (currentTab === "Courses") {
        const coursesFilter = downloads.filter(
          (currentItem) =>
            (currentItem.parentDirectory === "Courses" &&
              currentItem.fileCode?.toLowerCase().includes(filterQuery.toLowerCase().trim())) ||
            currentItem.fileName.toLowerCase().includes(filterQuery.toLowerCase().trim())
        );
        setFilterdList(coursesFilter);
      } else if (currentTab === "Projects") {
        const projectsFilter = downloads.filter(
          (currentItem) =>
            currentItem.parentDirectory === "Projects" &&
            currentItem.fileName.toLowerCase().includes(filterQuery.toLowerCase())
        );
        setFilterdList(projectsFilter);
      }
    };

    getDownloads();
  }, [filterQuery, currentTab]);

  const handleSearchInputTextChange = (text: string) => {
    setFilterQuery(text);
  };

  const handleOpenItem = async (item: DownloadedFileRef) => {
    navigation.dispatch(
      StackActions.push("App", { screen: "ImageViewer", params: { imageSource: item.filePath } })
    );
  };

  return (
    <View style={globalStyles.screen}>
      <SearchBoxView handleSearchInputTextChange={handleSearchInputTextChange} />
      <TabsSwitcher setCurrentTab={setCurrentTab} />
      <View style={{ flex: 1 }}>
        {!filteredList.length ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Inter-Regular",
                fontSize: mscale(14),
                color: colors.bodyText,
              }}
            >
              Filter files downloaded to this device
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <FlashList
              contentContainerStyle={{ paddingVertical: hscale(40) }}
              estimatedItemSize={78}
              data={filteredList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <DownloadItemView
                  fileCode={item.fileCode + "(" + (index + 1) + ")"}
                  source={item.filePath}
                  fileName={item.fileName}
                  parentDirectory={item.parentDirectory}
                  onItemPress={() => handleOpenItem(item)}
                />
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const TabsSwitcher = ({
  setCurrentTab,
}: {
  setCurrentTab: React.Dispatch<React.SetStateAction<FileDirectory>>;
}) => {
  const tabs: FileDirectory[] = ["Courses", "Projects"];
  const [activeTab, setActiveTab] = useState<FileDirectory>("Courses");

  const handleSwitchTab = (pressedTab: FileDirectory) => {
    setActiveTab(pressedTab);
    setCurrentTab(pressedTab);
  };

  return (
    <View style={styles.tabSwitcherView}>
      {tabs.map((currentTabItem) => (
        <Text
          style={[
            styles.tabItem,
            activeTab === currentTabItem
              ? { color: colors.primary, backgroundColor: colors.inputField }
              : null,
          ]}
          key={currentTabItem}
          onPress={() => handleSwitchTab(currentTabItem)}
        >
          {currentTabItem}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabSwitcherView: {
    flexDirection: "row",
    gap: 20,
  },
  tabItem: {
    fontFamily: "Inter-Medium",
    fontSize: mscale(16),
    color: colors.black,
    marginTop: hscale(20),
    padding: mscale(12),
    borderRadius: mscale(4),
  },
});
