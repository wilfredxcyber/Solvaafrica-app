import CheckCircleIcon from "@expo/vector-icons/FontAwesome";
import { Alert, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PDFIcon from "@expo/vector-icons/FontAwesome6";
import { useEffect, useRef, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import LottieView from "lottie-react-native";

import { SearchBoxView } from "../components/searchBoxView";
import { useDownloadFile } from "../hooks/useDownloadFile";
import { hscale, mscale, wscale } from "../helpers/metric";
import ProtectPage from "../components/protectPage";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import EmptyStateView from "../components/emptyStateView";
import ToastManager, { Toast } from "toastify-react-native";


export default function ProjectsScreen() {
  const [initialProjects, setInitialProjects] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectFiles, setProjectFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialProjects = async () => {
      setLoading(true);
      try {
        const res = await AUTH_API_CLIENT.get("/projects");
        if (res.status === 200) {
          const allProjects = res.data?.data || [];
          setInitialProjects(allProjects);
          setProjects(allProjects);
          setProjectFiles(
            allProjects.flatMap((project: any) => project.document)
          );
        }
      } catch (error) {
        // console.log("Error fetching initial projects:", error);
        Toast.error("Error fetching initial projects");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialProjects();
  }, []);

  const handleInputChange = (value: string) => {
    const query = value.trim().toLowerCase();
    if (!query.length) {
      setProjects(initialProjects);
      setProjectFiles(
        initialProjects.flatMap((project: any) => project.document)
      );
      return;
    }

    const filteredProjects = initialProjects.filter((project: any) =>
      project.project.name.toLowerCase().includes(query)
    );

    setProjects(filteredProjects);
    setProjectFiles(
      filteredProjects.flatMap((project: any) => project.document)
    );
  };

  return (
    // <ProtectPage>
      <View style={globalStyles.screen}>
        <SearchBoxView handleSearchInputTextChange={handleInputChange} />
        <View style={{ flex: 1, marginTop: hscale(12) }}>
          {loading ? (
            <LottieView
              autoPlay
              style={{
                width: wscale(50),
                height: hscale(50),
                alignSelf: "center",
              }}
              source={require("../../assets/animations/spin.json")}
            />
          ) : projects?.length && projectFiles?.length ? (
            <FlashList
              showsVerticalScrollIndicator={false}
              data={projectFiles}
              estimatedItemSize={56}
              renderItem={({ item, index }) => (
                <ProjectItemView
                  fileName={projects[index].project.name}
                  fileURI={item?.url}
                />
              )}
            />
          ) : (
            // <Text style={globalStyles.bodyText}>No projects found.</Text>
            <EmptyStateView />
          )}
        </View>
      </View>
    // </ProtectPage>
  );
}

const ProjectItemView = ({
  fileName,
  fileURI,
}: {
  fileName: string;
  fileURI: string;
}) => {
  const [startDownload, setStartDownload] = useState(false);
  const [fileExist, setFileExist] = useState(false);
  // set file code to PRJ for project files
  const downloadFile = useDownloadFile(startDownload, "PRJ");
  const DownloadIconRef = useRef<LottieView>(null);

  useEffect(() => {
    const initiateDownload = async () => {
      try {
        if (!fileURI || !fileName) return; // prevent falsy values from being passed
        const { isExistingFile } = await downloadFile(
          "Projects",
          fileURI,
          fileName
        );
        if (isExistingFile) {
          setFileExist(true);
          return;
        }
      } catch (error) {
        Alert.alert(
          "Download Failed.",
          "Please try again later or contact support"
        );
      }
    };

    initiateDownload();
  }, [startDownload]);

  const handleInitiateDownload = () => {
    DownloadIconRef.current && DownloadIconRef.current.play();
    setStartDownload(true);
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.inputField,
        height: hscale(60),
        paddingVertical: hscale(8),
        borderRadius: mscale(8),
        justifyContent: "space-between",
        marginVertical: hscale(8),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: wscale(20),
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
      </View>
      {!fileExist ? (
        <Pressable onPress={handleInitiateDownload}>
          <LottieView
            ref={DownloadIconRef}
            style={{ width: wscale(64), height: hscale(64) }}
            source={require("../../assets/animations/download.json")}
          />
        </Pressable>
      ) : (
        <CheckCircleIcon
          style={{ marginRight: wscale(20) }}
          name="check-circle"
          size={24}
          color={colors.primary}
        />
      )}
      <ToastManager />
    </View>
  );
};
