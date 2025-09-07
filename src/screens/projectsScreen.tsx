import CheckCircleIcon from "@expo/vector-icons/FontAwesome";
import { Alert, Pressable, Text, ToastAndroid, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import LottieView from "lottie-react-native";

import { SearchBoxView } from "../components/searchBoxView";
import { useDownloadFile } from "../hooks/useDownloadFile";
import { hscale, mscale, wscale } from "../helpers/metric";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import EmptyStateView from "../components/emptyStateView";
import ToastManager from "toastify-react-native";

export default function ProjectsScreen() {
  const [initialProjects, setInitialProjects] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialProjects = async () => {
      setLoading(true);
      try {
        const res = await AUTH_API_CLIENT.get("/projects");

        if (res.status === 200) {
          const allProjects = res.data?.data || [];
          console.log("Projects API response:", allProjects);

          setInitialProjects(allProjects);
          setProjects(allProjects);
        }
      } catch (error) {
        ToastAndroid.show("Error fetching projects", ToastAndroid.LONG);
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
      return;
    }

    const filteredProjects = initialProjects.filter((item: any) =>
      item.project?.name?.toLowerCase().includes(query)
    );

    setProjects(filteredProjects);
  };

  return (
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
        ) : projects?.length ? (
          <FlashList
            showsVerticalScrollIndicator={false}
            data={projects}
            estimatedItemSize={56}
            renderItem={({ item }) => (
              <View
                style={{
                  marginBottom: hscale(16),
                  paddingHorizontal: wscale(10),
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: mscale(8),
                  paddingVertical: hscale(6),
                }}
              >
                <Text
                  style={{
                    fontSize: mscale(12),
                    fontFamily: "Inter-SemiBold",
                    marginBottom: hscale(4),
                  }}
                >
                  {item.project?.name}
                </Text>

                {item.document?.map((doc: any) => (
                  <ProjectItemView
                    key={doc.id}
                    fileName={doc.name}
                    fileURI={doc.url}
                  />
                ))}
              </View>
            )}
          />
        ) : (
          <EmptyStateView />
        )}
      </View>
    </View>
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
  const downloadFile = useDownloadFile(startDownload, "PRJ");
  const DownloadIconRef = useRef<LottieView>(null);

  useEffect(() => {
    const initiateDownload = async () => {
      try {
        if (!fileURI || !fileName) return;
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
    DownloadIconRef.current?.play();
    setStartDownload(true);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.inputField,
        height: hscale(60),
        paddingVertical: hscale(3),
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
        <Text
          numberOfLines={1}
          style={{
            fontFamily: "Inter-Regular",
            fontSize: mscale(14),
            color: colors.black,
            // marginLeft: wscale(2),
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
