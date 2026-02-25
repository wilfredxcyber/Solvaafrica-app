import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Alert, Platform } from "react-native";
import { DownloadedFileRef, FileDirectory } from "../types";

export const useDownloadFile = (initiateDownload: boolean = false, fileCode?: string) => {
  const downloadFile = async (
    fileDirectory: FileDirectory,
    downloadFileUri: string,
    originalFileName: string,
    overrideFileCode?: string
  ) => {
    try {
      const effectiveFileCode = overrideFileCode ?? fileCode;

      // Always track the download reference regardless of platform
      const downloadedFileRef: DownloadedFileRef = {
        fileName: originalFileName,
        filePath: downloadFileUri, // For web, store the original URL
        parentDirectory: fileDirectory,
        fileCode: effectiveFileCode,
        platform: Platform.OS,
        downloadDate: new Date().toISOString(),
      };

      // Handle platform-specific downloads
      let result;
      if (Platform.OS === 'web') {
        result = await handleWebDownload(downloadFileUri, originalFileName, downloadedFileRef);
      } else {
        result = await handleMobileDownload(fileDirectory, downloadFileUri, originalFileName, effectiveFileCode, downloadedFileRef);
      }

      // Save download reference to AsyncStorage for both platforms
      await saveDownloadReference(downloadedFileRef);
      
      return result;
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error downloading", "Please retry later.");
      return { isExistingFile: null, fileUri: null, success: false };
    }
  };

  const saveDownloadReference = async (downloadedFileRef: DownloadedFileRef) => {
    try {
      const downloadRefsInStore = await AsyncStorage.getItem("DownloadRefs");
      if (downloadRefsInStore) {
        const downloadRefsList = JSON.parse(downloadRefsInStore);
        
        // Check if file already exists in references
        const existingIndex = downloadRefsList.findIndex(
          (ref: DownloadedFileRef) => 
            ref.fileName === downloadedFileRef.fileName && 
            ref.parentDirectory === downloadedFileRef.parentDirectory
        );
        
        if (existingIndex >= 0) {
          // Update existing reference
          downloadRefsList[existingIndex] = downloadedFileRef;
        } else {
          // Add new reference
          downloadRefsList.push(downloadedFileRef);
        }
        
        await AsyncStorage.setItem("DownloadRefs", JSON.stringify(downloadRefsList));
      } else {
        await AsyncStorage.setItem("DownloadRefs", JSON.stringify([downloadedFileRef]));
      }
      
      console.log("Download reference saved:", downloadedFileRef);
    } catch (error) {
      console.error("Error saving download reference:", error);
    }
  };

  const handleMobileDownload = async (
    fileDirectory: FileDirectory,
    downloadFileUri: string,
    originalFileName: string,
    fileCode?: string,
    downloadedFileRef?: DownloadedFileRef
  ) => {
    const filesDownloadsDirectoryPath = FileSystem.documentDirectory + `${fileDirectory}`;
    const filesDirectoryExist = (await FileSystem.getInfoAsync(filesDownloadsDirectoryPath)).exists;

    if (!filesDirectoryExist) {
      await FileSystem.makeDirectoryAsync(filesDownloadsDirectoryPath, { intermediates: true });
    }

    // Check if file already exists
    const files = await FileSystem.readDirectoryAsync(filesDownloadsDirectoryPath);
    const existingFile = files.find(
      (currentFile) => currentFile.toLowerCase() === originalFileName.toLowerCase()
    );
    
    if (existingFile) {
      return { 
        isExistingFile: true, 
        fileUri: `${filesDownloadsDirectoryPath}/${existingFile}`,
        success: true 
      };
    }

    // Proceed to download file
    if (initiateDownload) {
      const downloadedFile = await FileSystem.downloadAsync(
        downloadFileUri,
        `${filesDownloadsDirectoryPath}/${originalFileName}`
      );
      
      // Update file path in reference for mobile
      if (downloadedFileRef) {
        downloadedFileRef.filePath = downloadedFile.uri;
      }
      
      return { 
        isExistingFile: true, 
        fileUri: downloadedFile.uri,
        success: true 
      };
    }
    
    return { isExistingFile: null, fileUri: null, success: false };
  };

  const handleWebDownload = async (
    downloadFileUri: string,
    originalFileName: string,
    downloadedFileRef?: DownloadedFileRef
  ) => {
    try {
      // For web, create a temporary link and trigger download
      const response = await fetch(downloadFileUri);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = originalFileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      return { 
        isExistingFile: true, // Mark as existing so it appears in downloads screen
        fileUri: downloadFileUri, // Store the original URL
        success: true 
      };
    } catch (error) {
      console.error("Web download error:", error);
      
      // Fallback: Try simple link approach
      try {
        const link = document.createElement('a');
        link.href = downloadFileUri;
        link.download = originalFileName;
        link.target = '_blank';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
        
        return { 
          isExistingFile: true,
          fileUri: downloadFileUri,
          success: true 
        };
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  };

  return downloadFile;
};
