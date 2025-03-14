import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

import { DownloadedFileRef, FileDirectory } from "../types";

export const useDownloadFile = (initiateDownload: boolean = false, fileCode?: string) => {
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
        const downloadedFile = await FileSystem.downloadAsync(
          downloadFileUri,
          `${filesDownloadsDirectoryPath}/${originalFileName}`
        );
        // save download reference
        const downloadedFileRef: DownloadedFileRef = {
          fileName: originalFileName,
          filePath: downloadedFile.uri,
          parentDirectory: fileDirectory,
          fileCode,
        };
        const downloadRefsInStore = await AsyncStorage.getItem("DownloadRefs");
        if (downloadRefsInStore) {
          const downloadRefsList = JSON.parse(downloadRefsInStore);
          downloadRefsList.push(downloadedFileRef);
          await AsyncStorage.setItem("DownloadRefs", JSON.stringify(downloadRefsList));
        } else {
          await AsyncStorage.setItem("DownloadRefs", JSON.stringify([downloadedFileRef]));
        }
        return { isExistingFile: true, fileUri: downloadedFile.uri };
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
