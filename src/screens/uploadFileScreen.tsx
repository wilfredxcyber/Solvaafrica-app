import { Alert, Pressable, Text, View } from "react-native";
import CameraIcon from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import WarnIcon from "@expo/vector-icons/FontAwesome5";
import PdfPageImage from 'react-native-pdf-page-image';
import * as DocumentPicker from 'expo-document-picker';
import LeftIcon from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";

import { colors, screenHorizontalPadding } from "../constants/theme";
import { hscale, mscale, wscale } from "../helpers/metric";
import { PickedFile } from "../types";


export default function UploadFilesScreen() {
  const navigation = useNavigation();
  const handleOpenCamera = () => {
    console.log("Hello");
  };

  const handleUseFilePicker = async() => {
    try {
      const pickedFile = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg'],
        copyToCacheDirectory: true,
      })
      if(!pickedFile.canceled){
        const {name, uri, mimeType } = pickedFile.assets[0];
        if(!name || !uri || !mimeType) throw new Error('Invalid picked asset');
        // route param picked file
        const _pickedFile: PickedFile = {fileUri: uri, imageUri: uri, name, mimeType}
        if(mimeType === 'application/pdf'){
          // genrate image from pdf page
          const scale = 1.0;
          const pdfPageImage = await PdfPageImage.generate(uri, 1, scale);
          _pickedFile.imageUri = pdfPageImage.uri;
        }
        navigation.navigate('App', {screen: 'UploadPreview', params: {pickedFile: _pickedFile}})
      }
    } catch (error) {
      Alert.alert('Error', 'Kindly contact support')
      console.log('Error picking file from  document directory', error)
    }
  };

  return (
    <View style={{ backgroundColor: colors.primary, flex: 1 }}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          width: wscale(48),
          height: hscale(48),
          justifyContent: "center",
          alignItems: "flex-start",
          marginLeft: screenHorizontalPadding,
        }}
      >
        <LeftIcon name="arrow-back-outline" size={24} color={"#ffffff"} />
      </Pressable>

      <View style={{ flex: 1 }}>
        <View style={{ height: hscale(142), width: wscale(113), marginHorizontal: "auto" }}>
          <Image
            source={require("../../assets/images/file.png")}
            style={{ height: "100%", width: "100%" }}
            contentFit="fill"
          />
        </View>
        <Text
          style={{
            fontFamily: "Inter-Bold",
            fontSize: mscale(24),
            color: "#fff",
            textAlign: "center",
            marginTop: hscale(24),
          }}
        >
          Educational Resources
        </Text>
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: mscale(14),
            color: "#fff",
            textAlign: "center",
            width: "80%",
            marginHorizontal: "auto",
            marginTop: hscale(12),
          }}
        >
          Only documents in jpeg, png, pdf formats are allowed for upload.
        </Text>

        {/* bottom sheet */}
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: "#ffffff",
              height: "60%",
              justifyContent: "center",
              borderTopLeftRadius: mscale(20),
              borderTopRightRadius: mscale(20),
            }}
          >
            <Pressable
              onPress={handleOpenCamera}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.primary,
                alignSelf: "center",
                height: hscale(56),
                paddingHorizontal: wscale(20),
                borderRadius: mscale(8),
              }}
            >
              <CameraIcon name="photo-camera" size={24} color={"#ffffff"} />
              <Text style={{ fontFamily: "Inter-Bold", marginLeft: wscale(12), color: "#ffffff" }}>
                Use Camera
              </Text>
            </Pressable>
            <Text
              onPress={handleUseFilePicker}
              style={{
                fontFamily: "Inter-Bold",
                color: colors.primary,
                fontSize: mscale(20),
                textAlign: "center",
                marginTop: hscale(20),
              }}
            >
              Select the file from storage
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "80%",
                backgroundColor: "#FFEACC",
                marginHorizontal: "auto",
                paddingVertical: hscale(12),
                paddingHorizontal: wscale(24),
                borderRadius: mscale(6),
                borderWidth: 2,
                borderColor: "#E28400",
                marginTop: hscale(20),
              }}
            >
              <WarnIcon name="exclamation-triangle" size={24} color={"#E28400"} />
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  marginLeft: wscale(8),
                  width: "80%",
                  color: "#E28400",
                }}
              >
                Note what is expected while uploading PDFs
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
