import { StaticScreenProps } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Alert, View } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";

import PrimaryButton from "../components/primaryButton";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { hscale } from "../helpers/metric";
import { PickedFile } from "../types";


export default function UploadFilePreviewScreen({ route }: StaticScreenProps<{ pickedFile: PickedFile }>) {
    const { pickedFile } = route.params;
    const [isUploading, setIsUploading] = useState(false);
    const navigation = useNavigation()

    const handleFileUpload = async () => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            const { name, fileUri, mimeType } = pickedFile;

            formData.append('documents', {
                uri: fileUri,
                name,
                type: mimeType
            });

            const formUploadResponse = await AUTH_API_CLIENT.postForm('/documents/upload', formData)
            if (formUploadResponse.status === 200) {
                Alert.alert('Success', 'File upload was successful!');
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Upload failed.', 'Try later, or contact support')
            console.log('Error uploading file', error)
        } finally {
            setIsUploading(false)
        }
    }
    return (
        <View style={globalStyles.screen}>
            <Image
                source={pickedFile.imageUri}
                style={{ width: '100%', height: hscale(500), marginVertical: hscale(20) }}
            />
            <PrimaryButton
                text="Upload file"
                onPress={handleFileUpload}
                isLoading={isUploading}
            />
        </View>
    )
}