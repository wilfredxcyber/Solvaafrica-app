import { StackActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, StyleSheet, Text, View, Image } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";

import { DownloadItemView } from "../components/downloadItemView";
import { SearchBoxView } from "../components/searchBoxView";
import { DownloadedFileRef, FileDirectory } from "../types";
import { hscale, mscale, wscale } from "../helpers/metric";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import EmptyStateView from "../components/emptyStateView";
import LottieView from "lottie-react-native";

export default function FilterScreen() {
  const [currentTab, setCurrentTab] = useState<FileDirectory>("Courses");
  const [filterQuery, setFilterQuery] = useState("");
  const [filteredList, setFilterdList] = useState<DownloadedFileRef[]>([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   //  get all downloads via cached refs
  //   const getDownloads = async () => {
  //     const downloadRefs = await AsyncStorage.getItem("DownloadRefs");
  //     const downloads: DownloadedFileRef[] = downloadRefs && JSON.parse(downloadRefs);

  //     if (!filterQuery.trim().length) {
  //       setFilterdList([]);
  //       return;
  //     }

  //     if (currentTab === "Courses") {
  //       const coursesFilter = downloads.filter(
  //         (currentItem) =>
  //           (currentItem.fileCode?.toLowerCase().includes(filterQuery.toLowerCase().trim())) || currentItem.fileName.toLowerCase().includes(filterQuery.toLowerCase().trim()) && currentItem.parentDirectory === 'Courses'
  //       );
  //       setFilterdList(coursesFilter);
  //     } else if (currentTab === "Projects") {
  //       const projectsFilter = downloads.filter(
  //         (currentItem) =>
  //           currentItem.parentDirectory === "Projects" &&
  //           currentItem.fileName.toLowerCase().includes(filterQuery.toLowerCase())
  //       );
  //       setFilterdList(projectsFilter);
  //     }
  //   };

  //   getDownloads();
  // }, [filterQuery, currentTab]);

  useEffect(() => {
    const getDownloads = async () => {
      setIsLoading(true);
      try {
        const downloadRefs = await AsyncStorage.getItem("DownloadRefs");
        const downloads: DownloadedFileRef[] =
          downloadRefs && JSON.parse(downloadRefs);

        if (!downloads) {
          setFilterdList([]);
          return;
        }

        let filtered = downloads.filter(
          (item) => item.parentDirectory === currentTab
        );

        if (filterQuery.trim().length > 0) {
          filtered = filtered.filter(
            (item) =>
              item.fileCode
                ?.toLowerCase()
                .includes(filterQuery.toLowerCase().trim()) ||
              item.fileName
                .toLowerCase()
                .includes(filterQuery.toLowerCase().trim())
          );
        }

        setFilterdList(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    getDownloads();
  }, [filterQuery, currentTab]);

  const handleSearchInputTextChange = (text: string) => {
    setFilterQuery(text);
  };

  const handleOpenItem = async (item: DownloadedFileRef) => {
    if (item.parentDirectory === "Projects") {
      navigation.dispatch(
        StackActions.push("App", {
          screen: "PdfViewer",
          params: { pdfUri: item.filePath },
        })
      );
    } else {
      navigation.dispatch(
        StackActions.push("App", {
          screen: "ImageViewer",
          params: { imageSource: item.filePath },
        })
      );
    }
  };

  return (
    <View style={globalStyles.screen}>
      <SearchBoxView
        handleSearchInputTextChange={handleSearchInputTextChange}
      />
      <TabsSwitcher setCurrentTab={setCurrentTab} />
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View
            style={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LottieView
              autoPlay
              style={{
                width: wscale(50),
                height: hscale(50),
                alignSelf: "center",
              }}
              source={require("../../assets/animations/spin.json")}
            />
            <Text>Loading, Please wait!</Text>
          </View>
        ) : !filteredList.length ? (
          // <View style={styles.centeredView}>
          //   <View>
          //     <Image
          //       source={require("../../assets/images/notFound.png")}
          //       style={{
          //         width: wscale(200),
          //         height: hscale(200),
          //         marginHorizontal: "auto",
          //       }}
          //     />
          //   </View>
          //   <Text style={styles.emptyText}>
          //     No files found.
          //   </Text>
          // </View>
          <EmptyStateView />
        ) : (
          <FlashList
            contentContainerStyle={{ paddingVertical: hscale(40) }}
            estimatedItemSize={78}
            data={filteredList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <DownloadItemView
                fileCode={item.fileCode?.trim() + "(" + (index + 1) + ")"}
                source={item.filePath}
                fileName={item.fileName}
                parentDirectory={item.parentDirectory}
                onItemPress={() => handleOpenItem(item)}
              />
            )}
          />
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: mscale(16),
    color: colors.bodyText,
  },
  emptyText: {
    fontFamily: "Inter-Regular",
    fontSize: mscale(14),
    color: colors.bodyText,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
