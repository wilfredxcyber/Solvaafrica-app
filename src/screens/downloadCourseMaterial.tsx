import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { Alert, Dimensions, View } from "react-native";
import { useEffect, useState } from "react";
import { Image } from "expo-image";

import { screenHorizontalPadding } from "../constants/theme";
import { useDownloadFile } from "../hooks/useDownloadFile";
import PrimaryButton from "../components/primaryButton";
import { globalStyles } from "../styles/global";
import { hscale } from "../helpers/metric";
import ErrorModal from "../components/errorModal";

export default function DownloadCourseMaterial() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [startDownload, setStartDownload] = useState(false);
  const [fileExist, setFileExist] = useState(false);
  const fileCode = Array.isArray(params.fileCode) ? params.fileCode[0] : params.fileCode;
  const screenTitle = Array.isArray(params.screenTitle) ? params.screenTitle[0] : params.screenTitle;
  const url = Array.isArray(params.url) ? params.url[0] : params.url;
  const originalFileName = Array.isArray(params.originalFileName) ? params.originalFileName[0] : params.originalFileName;
  const downloadFile = useDownloadFile(startDownload, fileCode);
  const [isLoading, setIsLoading] = useState(false);

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    navigation.setOptions({ title: screenTitle });
  }, []);

  // download file
  useEffect(() => {
    const initiateDownload = async () => {
      try {
        setIsLoading(true);
        const { isExistingFile } = await downloadFile(
          "Courses",
          url,
          originalFileName
        );
        if (isExistingFile) {
          setFileExist(true);
          return;
        }
      } catch (error) {
        let message =
          "Download error, Please try again later or contact support!";
        setErrorMessage(message);
        setErrorVisible(true);
        // Alert.alert(
        //   "Download Failed.",
        //   "Please try again later or contact support"
        // );
      } finally {
        setIsLoading(false);
      }
    };

    initiateDownload();
  }, [startDownload]);

  const handleInitiateDownload = async () => {
    setStartDownload(true);
  };

  const handleOpenDownloads = () => {
    router.replace('/(tabs)/downloads');
  };

  return (
    <View style={globalStyles.screen}>
      <Image
        contentFit="contain"
        source={params.url}
        style={{
          width: Dimensions.get("window").width - screenHorizontalPadding * 2,
          height: hscale(500),
          marginBottom: hscale(20),
        }}
      />

      {fileExist ? (
        <PrimaryButton text="File in downloads" onPress={handleOpenDownloads} />
      ) : (
        <PrimaryButton
          text="Download file"
          onPress={handleInitiateDownload}
          isLoading={isLoading}
        />
      )}
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </View>
  );
}