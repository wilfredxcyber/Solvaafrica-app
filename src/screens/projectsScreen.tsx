import { Alert, Pressable, Text, View } from "react-native";
import PDFIcon from "@expo/vector-icons/FontAwesome6";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";

import { SearchBoxView } from "../components/searchBoxView";
import { useDownloadFile } from "../hooks/useDownloadFile";
import { hscale, mscale, wscale } from "../helpers/metric";
import ProtectPage from "../components/protectPage";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<any[]>();
  const [projectFiles, setProjectFiles] = useState<any[]>();
  const [fileName, setFileName] = useState<string>();

  const fetchProjects = async (searchQuery: string) => {
    try {
      const res = await AUTH_API_CLIENT.get("/projects", {
        params: { search: searchQuery.trim().toLowerCase() },
      });
      if (res.status === 200) {
        const data = res.data;
        return Promise.resolve(data);
      }
    } catch (error) {
      Promise.reject(error);
    }
  };

  let timeOutId: null | NodeJS.Timeout = null;

  const handleInputChange = (value: string) => {
    if (!value.trim().length) return;

    if (timeOutId) {
      clearTimeout(timeOutId);
    }

    // this is a debounce to delay requests to the server as the user types
    timeOutId = setTimeout(async () => {
      const fetchedData = await fetchProjects(value.trim().toLowerCase());
      setProjects(fetchedData?.data);
      fetchedData?.data.forEach((currentItem: any) => {
        setProjectFiles([...currentItem?.document]);
      });
    }, 500);
  };

  useEffect(() => {
    return () => {
      timeOutId && clearTimeout(timeOutId);
    };
  }, []);

  return (
    <ProtectPage>
      <View style={globalStyles.screen}>
        <SearchBoxView handleSearchInputTextChange={handleInputChange} />
        <View style={{ flex: 1, marginTop: hscale(12) }}>
          {projects?.length && projectFiles?.length ? (
            <FlashList
              showsVerticalScrollIndicator={false}
              data={projectFiles}
              estimatedItemSize={56}
              renderItem={({ item, index }) => (
                <ProjectItemView fileName={projects[index].project.name} fileURI={item?.url} />
              )}
            />
          ) : (
            <Text>Download new project files. Start searching now</Text>
          )}
        </View>
      </View>
    </ProtectPage>
  );
}

const ProjectItemView = ({ fileName, fileURI }: { fileName: string; fileURI: string }) => {
  const handleDownloadProjectFile = () => {
    console.log("Hello", fileURI);
  };
  return (
    <Pressable
      onPress={handleDownloadProjectFile}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.inputField,
        height: hscale(60),
        paddingHorizontal: wscale(20),
        borderRadius: mscale(8),
      }}
    >
      <PDFIcon name="file-pdf" size={32} color={colors.primary} />
      <Text
        numberOfLines={1}
        style={{
          fontFamily: "Inter-Regular",
          fontSize: mscale(14),
          color: colors.black,
          marginLeft: wscale(12),
        }}
      >
        {fileName}
      </Text>
    </Pressable>
  );
};
