import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { open } from "react-native-file-viewer-turbo";
import SearchIcon from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";

import { DownloadItemView } from "../components/downloadItemView";
import { DownloadedFileRef, FileDirectory } from "../types";
import { hscale, mscale, wscale } from "../helpers/metric";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";

export default function FilterScreen() {
  const [currentTab, setCurrentTab] = useState<FileDirectory>("Courses");
  const [filterQuery, setFilterQuery] = useState("");
  const [filteredList, setFilterdList] = useState<DownloadedFileRef[]>([]);

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
    try {
      await open(item.filePath);
    } catch (error) {
      Alert.alert("File error!", "Could not open this file");
      console.log("Could not open file", error);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <SearchBoxView handleSearchInputTextChange={handleSearchInputTextChange} />
      <TabsSwitcher setCurrentTab={setCurrentTab} />
      <View style={{ flex: 1 }}>
        {!filteredList.length ? (
          <View style={styles.noFileView}>
            <Text style={styles.noFileText}>
              Quickly look up downloaded files using the search box.
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

const SearchBoxView = ({
  handleSearchInputTextChange,
}: {
  handleSearchInputTextChange: (text: string) => void;
}) => {
  return (
    <View style={styles.searchBoxView}>
      <TextInput
        style={{ flex: 1 }}
        onChangeText={handleSearchInputTextChange}
        cursorColor={colors.primary}
      />
      <SearchIcon name="search" size={20} color={colors.primary} />
    </View>
  );
};

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
  searchBoxView: {
    backgroundColor: colors.inputField,
    flexDirection: "row",
    height: hscale(60),
    paddingHorizontal: wscale(20),
    borderRadius: mscale(30),
    alignItems: "center",
    marginTop: hscale(40),
  },
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
  noFileView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  noFileText: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(14),
    textAlign: "center",
    width: "80%",
  },
});
