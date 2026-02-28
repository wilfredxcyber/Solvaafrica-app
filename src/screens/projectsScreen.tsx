import CheckCircleIcon from "@expo/vector-icons/FontAwesome";
import { Alert, Pressable, Text, View, Platform, ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";

import { SearchBoxView } from "../components/searchBoxView";
import { useDownloadFile } from "../hooks/useDownloadFile";
import { hscale, mscale, wscale } from "../helpers/metric";
import ProtectPage from "../components/protectPage";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import EmptyStateView from "../components/emptyStateView";
import { Toast } from "toastify-react-native";

export default function ProjectsScreen() {
  const getFileNameFromUrl = (url?: string) => {
    if (!url) return "Project file.pdf";

    try {
      const cleanUrl = url.split("?")[0];
      const lastSegment = cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
      const decoded = decodeURIComponent(lastSegment || "");
      return decoded || "Project file.pdf";
    } catch {
      return "Project file.pdf";
    }
  };

  const buildProjectFiles = (projectsList: any[]) =>
    (projectsList ?? []).flatMap((project: any, projectIndex: number) =>
      (project?.document ?? []).map((doc: any, docIndex: number) => ({
        fileName: doc?.name || getFileNameFromUrl(doc?.url) || project?.project?.name || "Project file.pdf",
        fileURI: doc?.url,
        fileKey: `${doc?.url || "project-file"}-${projectIndex}-${docIndex}`,
      }))
    );

  const [initialProjects, setInitialProjects] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectFiles, setProjectFiles] = useState<
    Array<{ fileName: string; fileURI: string; fileKey: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchInitialProjects = async () => {
      setLoading(true);
      try {
        const res = await AUTH_API_CLIENT.get("/projects");
        if (res.status === 200) {
          const allProjects = res.data?.data || [];
          setInitialProjects(allProjects);
          setProjects(allProjects);
          setProjectFiles(buildProjectFiles(allProjects));
        }
      } catch (error) {
        Toast.error("Error fetching initial projects")
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
      setProjectFiles(buildProjectFiles(initialProjects));
      return;
    }

    const filteredProjects = initialProjects.filter((project: any) =>
      project.project.name.toLowerCase().includes(query)
    );

    setProjects(filteredProjects);
    setProjectFiles(buildProjectFiles(filteredProjects));
  };

  const addDownloadingFile = (fileName: string) => {
    setDownloadingFiles(prev => new Set(prev).add(fileName));
  };

  const removeDownloadingFile = (fileName: string) => {
    setDownloadingFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(fileName);
      return newSet;
    });
  };

  return (
    <ProtectPage>
      <View style={globalStyles.screen}>
        <SearchBoxView handleSearchInputTextChange={handleInputChange} />
        <View style={{ flex: 1, marginTop: hscale(12) }}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <LottieView
                autoPlay
                loop
                style={{
                  width: Platform.select({ web: 80, default: wscale(50) }),
                  height: Platform.select({ web: 80, default: hscale(50) }),
                }}
                source={require("../../assets/animations/spin.json")}
              />
            </View>
          ) : projects?.length && projectFiles?.length ? (
            <ScrollView
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hscale(12) }}
            >
              {projectFiles.map((item) => (
                <ProjectItemView
                  key={item.fileKey}
                  fileName={item.fileName}
                  fileURI={item.fileURI}
                  fileKey={item.fileKey}
                  isDownloading={downloadingFiles.has(item.fileName)}
                  onDownloadStart={() => addDownloadingFile(item.fileName)}
                  onDownloadComplete={() => removeDownloadingFile(item.fileName)}
                />
              ))}
            </ScrollView>
          ) : (
            <EmptyStateView/>
          )}
        </View>
      </View>
    </ProtectPage>
  );
}

interface ProjectItemViewProps {
  fileName: string;
  fileURI: string;
  fileKey: string;
  isDownloading: boolean;
  onDownloadStart: () => void;
  onDownloadComplete: () => void;
}

const ProjectItemView = ({
  fileName,
  fileURI,
  fileKey,
  isDownloading,
  onDownloadStart,
  onDownloadComplete,
}: ProjectItemViewProps) => {
  const [fileExist, setFileExist] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const downloadFile = useDownloadFile(true, "PRJ"); // Always true since we control when to download
  const DownloadIconRef = useRef<LottieView>(null);
  const downloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current);
      }
    };
  }, []);

  const handleDownload = async () => {
    if (isDownloading || fileExist) return;
    
    console.log(`Starting download for: ${fileName}`);
    onDownloadStart();
    
    try {
      const result = await downloadFile("Projects", fileURI, fileName);
      
      console.log(`Download result:`, result);
      
      if (result.success) {
        setFileExist(true);
        setDownloadSuccess(true);
        
        // Show success state for 3 seconds
        if (downloadTimeoutRef.current) {
          clearTimeout(downloadTimeoutRef.current);
        }
        
        downloadTimeoutRef.current = setTimeout(() => {
          setDownloadSuccess(false);
        }, 3000);
        
        Toast.success(`Downloaded: ${fileName}`);
      } else {
        Toast.error(`Failed to download: ${fileName}`);
      }
    } catch (error) {
      console.error("Download error:", error);
      Toast.error(`Download failed: ${fileName}`);
    } finally {
      onDownloadComplete();
    }
  };

  const handleMobileDownload = () => {
    if (isDownloading || fileExist) return;
    
    // Play animation on mobile
    if (DownloadIconRef.current) {
      DownloadIconRef.current.play();
    }
    
    // Start download after animation starts
    setTimeout(() => {
      handleDownload();
    }, 300);
  };

  // Update the renderDownloadButton function in ProjectItemView
const renderDownloadButton = () => {
  if (fileExist || downloadSuccess) {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Platform.select({ web: 8, default: wscale(20) }),
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}>
        <CheckCircleIcon
          name="check-circle"
          size={Platform.select({ web: 18, default: 20 })}
          color={colors.primary}
        />
        <Text style={{
          fontFamily: "Inter-Regular",
          fontSize: Platform.select({ web: 12, default: mscale(11) }),
          color: colors.primary,
          marginLeft: 6,
          fontWeight: '500',
        }}>
          {downloadSuccess ? 'Downloaded!' : 'Downloaded'}
        </Text>
      </View>
    );
  }

  if (isDownloading) {
    return (
      <View style={{
        width: Platform.select({ web: 100, default: wscale(64) }),
        height: Platform.select({ web: 36, default: hscale(64) }),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
      }}>
        <LottieView
          autoPlay
          loop
          style={{
            width: Platform.select({ web: 24, default: wscale(30) }),
            height: Platform.select({ web: 24, default: hscale(30) }),
          }}
          source={require("../../assets/animations/spin.json")}
        />
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <Pressable
        onPress={handleDownload}
        disabled={isDownloading}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.primary,
          backgroundColor: 'transparent',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
          minWidth: 100,
          justifyContent: 'center',
        })}
      >
        <CheckCircleIcon
          name="download"
          size={14}
          color={colors.primary}
          style={{ marginRight: 6 }}
        />
        <Text style={{
          fontFamily: "Inter-Regular",
          fontSize: 12,
          color: colors.primary,
          fontWeight: '500',
        }}>
          Download
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handleMobileDownload}
      disabled={isDownloading}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
        width: wscale(64),
        height: hscale(64),
        justifyContent: 'center',
        alignItems: 'center',
      })}
    >
      <LottieView
        ref={DownloadIconRef}
        style={{ 
          width: wscale(64),
          height: hscale(64)
        }}
        source={require("../../assets/animations/download.json")}
      />
    </Pressable>
  );
};

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.inputFieldNew,
        minHeight: Platform.select({ web: 70, default: hscale(60) }),
        paddingVertical: Platform.select({ web: 12, default: hscale(8) }),
        borderRadius: 10,
        justifyContent: "space-between",
        marginVertical: Platform.select({ web: 8, default: hscale(8) }),
        borderWidth: 1,
        borderColor: colors.black,
        paddingHorizontal: Platform.select({ web: 16, default: wscale(12) }),
      }}
      key={fileKey}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontFamily: "Inter-Regular",
            fontSize: Platform.select({ web: 14, default: mscale(14) }),
            color: colors.black,
            flex: 1,
          }}
        >
          {fileName}
        </Text>
      </View>
      
      <View style={{ marginLeft: 8 }}>
        {renderDownloadButton()}
      </View>
    </View>
  );
};
