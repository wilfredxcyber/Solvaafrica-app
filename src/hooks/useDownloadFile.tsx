import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

import { SavedFile } from "../types";

type FileDirectory = "Courses" | "Projects";

export const useDownloadFile = (initiateDownload: boolean = false, fileAlbum: string) => {
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
        console.log(downloadedFile.uri);
        const saveFile = { path: downloadedFile.uri, album: fileAlbum };

        const storedDownloads = await AsyncStorage.getItem("Downloads");

        if (!storedDownloads) {
          await AsyncStorage.setItem("Downloads", JSON.stringify([saveFile]));
        } else {
          const parsedDownloads = JSON.parse(storedDownloads);
          parsedDownloads.push(saveFile);
          await AsyncStorage.setItem("Downloads", JSON.stringify(parsedDownloads));
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
