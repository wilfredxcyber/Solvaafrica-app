import { StaticScreenProps } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Alert, View, Text } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";

import PrimaryButton from "../components/primaryButton";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { hscale, mscale } from "../helpers/metric";
import { PickedFile } from "../types";
import ErrorModal from "../components/errorModal";
import ToastManager, { Toast } from "toastify-react-native";
import { colors } from "../constants/theme";

export default function UploadFilePreviewScreen({
  route,
}: StaticScreenProps<{ pickedFile: PickedFile }>) {
  const { pickedFile } = route.params;
  const [isUploading, setIsUploading] = useState(false);
  const navigation = useNavigation();

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = async () => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      const { name, fileUri, mimeType } = pickedFile;

      formData.append("documents", {
        uri: fileUri,
        name,
        type: mimeType,
      } as any);

      const formUploadResponse = await AUTH_API_CLIENT.postForm(
        "/documents/upload",
        formData
      );
      if (formUploadResponse.status === 200) {
        Alert.alert("Success", "File upload was successful!");
        navigation.goBack();
        // Toast.success("File uploaded successfully!");
      }
    } catch (error) {
      //   Alert.alert("Upload failed.", "Try later, or contact support");
      //   console.log("Error uploading file", error);
      let message = "Upload failed, Try later or contact support";
      setErrorMessage(message);
      setErrorVisible(true);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <View style={globalStyles.screen}>
      <Image
        source={pickedFile.imageUri}
        style={{
          width: "100%",
          height: hscale(500),
          marginVertical: hscale(20),
        }}
      />
      <PrimaryButton
        text="Upload file"
        onPress={handleFileUpload}
        isLoading={isUploading}
      />
      <Text
        style={{
          fontFamily: "Inter-Bold",
          fontSize: mscale(14),
          color: colors.primary,
          textAlign: "center",
          marginVertical: 5
        }}
      >
        Note: PQ upload takes a minimum of 3 days for it to be verified
      </Text>
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
      <ToastManager />
    </View>
  );
}
