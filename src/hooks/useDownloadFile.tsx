import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

type FileDirectory = "Courses" | "Projects";

export const useDownloadFile = (initiateDownload: boolean = false) => {
  const downloadFile = async (
    fileDirectory: FileDirectory,
    downloadFileUri: string,
    originalFileName: string
  ) => {
    try {
      const filesDownloadsDirectoryPath = FileSystem.documentDirectory + `${fileDirectory}`;
      const filesDirectoryExist = (await FileSystem.getInfoAsync(filesDownloadsDirectoryPath))
        .exists;

      if (!filesDirectoryExist) {
        await FileSystem.makeDirectoryAsync(filesDownloadsDirectoryPath, { intermediates: true });
      }

      // file exist already?
      const files = await FileSystem.readDirectoryAsync(filesDownloadsDirectoryPath);
      const existingFile = files.find(
        (currentFile) => currentFile.toLowerCase() === originalFileName.toLowerCase()
      );
      if (existingFile) {
        console.log({ existingFile: true });
        return { isExistingFile: true, fileUri: `${filesDownloadsDirectoryPath}/${existingFile}` };
      }

      // proceed to download file
      if (initiateDownload) {
        const fileDownloadUri = await FileSystem.downloadAsync(
          downloadFileUri,
          `${filesDownloadsDirectoryPath}/${originalFileName}`
        );
        console.log(fileDownloadUri.uri);
        return { isExistingFile: true, fileUri: fileDownloadUri.uri };
      }

      return { isExistingFile: null, fileUri: null };
    } catch (error) {
      console.log(error);
      Alert.alert("Error downloading", "Please retry later.");
      return { isExistingFile: null, fileUri: null };
    }
  };

  return downloadFile;
};
