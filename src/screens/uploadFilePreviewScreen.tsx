import { StaticScreenProps } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Alert, View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";

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
  const navigation = useNavigation();

  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   if (pickedFile.mimeType === "application/pdf") {
  //     setSelectedType("project");
  //   } else if (pickedFile.mimeType.startsWith("image/")) {
  //     setSelectedType("question");
  //   }
  // }, [pickedFile]);

  const handleFileUpload = async () => {
    if (!selectedType) {
      Toast.error("Please select a type (Project or Question) first.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      const { name, fileUri, mimeType } = pickedFile;

      formData.append("dropdown", selectedType);
      formData.append("documents", {
        uri: fileUri,
        name,
        type: mimeType,
      } as any);

      console.log(selectedType, "upload ")
      console.log(name, fileUri, mimeType)

      const formUploadResponse = await AUTH_API_CLIENT.postForm(
        "/documents/upload",
        formData
      );

      if (formUploadResponse.status === 200) {
        Alert.alert("Success", "File upload was successful!");
        navigation.goBack();
      }
    } catch (error) {
      setErrorMessage("Upload failed, Try later or contact support");
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

       <View style={styles.pickerContainer}>
        <Picker
          enabled={!isUploading}
          selectedValue={selectedType}
          onValueChange={(value) => setSelectedType(value)}
        >
          <Picker.Item label="Select type" value={null} />
          <Picker.Item label="Project" value="project" />
          <Picker.Item label="Past Question" value="question" />
        </Picker>
      </View> 

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
          marginVertical: 5,
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

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    marginBottom: 10,
  },
});
