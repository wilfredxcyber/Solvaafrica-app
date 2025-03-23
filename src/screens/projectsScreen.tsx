import CheckCircleIcon from '@expo/vector-icons/FontAwesome';
import { Alert, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PDFIcon from "@expo/vector-icons/FontAwesome6";
import { useEffect, useRef, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import LottieView from 'lottie-react-native';

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
  const [loading, setLoading] = useState(false);

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
      setLoading(true)
      try {
        const fetchedData = await fetchProjects(value.trim().toLowerCase());
        setProjects(fetchedData?.data);
        fetchedData?.data.forEach((currentItem: any) => {
          setProjectFiles([...currentItem?.document]);
        });

      } catch (error) {
        console.log('Error fetching projects', error)
      } finally {
        setLoading(false)
      }
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
            loading ? (
              <LottieView autoPlay style={{ width: wscale(100), height: hscale(100), marginHorizontal: 'auto' }} source={require('../../assets/animations/spin.json')} />
            ) : <Text style={globalStyles.bodyText}>Search and download new projects files</Text>
          )}
        </View>
      </View>
    </ProtectPage>
  );
}

const ProjectItemView = ({ fileName, fileURI }: { fileName: string; fileURI: string }) => {
  const [startDownload, setStartDownload] = useState(false);
  const [fileExist, setFileExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // set file code to PRJ for project files
  const downloadFile = useDownloadFile(startDownload, 'PRJ');
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
        Alert.alert("Download Failed.", "Please try again later or contact support");
      }
    };

    initiateDownload();
  }, [startDownload]);

  const handleInitiateDownload = () => {
    DownloadIconRef.current && DownloadIconRef.current.play()
    setStartDownload(true)
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
        justifyContent: 'space-between'
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: wscale(20) }}>
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
      {!fileExist ? <Pressable onPress={handleInitiateDownload}>
        <LottieView ref={DownloadIconRef} style={{ width: wscale(64), height: hscale(64) }} source={require('../../assets/animations/download.json')} />
      </Pressable> : <CheckCircleIcon style={{ marginRight: wscale(20) }} name="check-circle" size={24} color={colors.primary} />}
    </View>
  );
};
