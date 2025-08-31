import { Alert, Linking, Pressable, Text, ToastAndroid, View } from "react-native";
import { useCameraPermissions, CameraView } from "expo-camera";
import CameraIcon from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import WarnIcon from "@expo/vector-icons/FontAwesome5";
import PdfPageImage from "react-native-pdf-page-image";
import CheckIcon from "@expo/vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import LeftIcon from "@expo/vector-icons/Ionicons";
import { useRef, useState } from "react";
import { Image } from "expo-image";

import { colors, screenHorizontalPadding } from "../constants/theme";
import { hscale, mscale, wscale } from "../helpers/metric";
import PrimaryButton from "../components/primaryButton";
import ProtectPage from "../components/protectPage";
import { PickedFile } from "../types";
import ToastManager, { Toast } from "toastify-react-native";

export default function UploadFilesScreen() {
  const navigation = useNavigation();
  const [permission, requestCameraPermission] = useCameraPermissions();
  const [launchCameraView, setLaunchCameraView] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const CameraRef = useRef<CameraView>(null);
  const [capturing, setCapturing] = useState(false);

  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      Alert.alert(
        "Permission required",
        "We need your permission to show the camera",
        [
          {
            text: "Grant access",
            onPress: async () => await requestCameraPermission(),
          },
        ]
      );
    } else if (permission.status === "denied") {
      Alert.alert(
        "Permission required",
        "We need your permission to show the camera"
      );
      await Linking.openSettings();
      return;
    }
    setLaunchCameraView(true);
  };

  const handleCapture = async () => {
    setCapturing(true);
    if (!cameraReady) return;
    try {
      const capturedResult =
        CameraRef?.current &&
        (await CameraRef.current.takePictureAsync({ quality: 1 }));
      if (!capturedResult || !capturedResult.uri) return;

      const { uri } = capturedResult;
      const capturedImageName = uri.split("/").pop();
      if (capturedImageName) {
        navigation.navigate("App", {
          screen: "UploadPreview",
          params: {
            pickedFile: {
              name: capturedImageName,
              fileUri: uri,
              imageUri: uri,
              mimeType: "image/jpeg",
            },
          },
        });
      }
    } catch (error) {
      ToastAndroid.show("Error capturing image with device camera", ToastAndroid.LONG);
    } finally {
      setCapturing(false);
    }
  };

  const handleUseFilePicker = async () => {
    try {
      const pickedFile = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg"],
        copyToCacheDirectory: true,
      });
      if (!pickedFile.canceled) {
        const { name, uri, mimeType } = pickedFile.assets[0];
        if (!name || !uri || !mimeType) throw new Error("Invalid picked asset");
        const _pickedFile: PickedFile = {
          fileUri: uri,
          imageUri: uri,
          name,
          mimeType,
        };
        if (mimeType === "application/pdf") {
          const scale = 1.0;
          const pdfPageImage = await PdfPageImage.generate(uri, 1, scale);
          _pickedFile.imageUri = pdfPageImage.uri;
        }
        navigation.navigate("App", {
          screen: "UploadPreview",
          params: { pickedFile: _pickedFile },
        });
      }
    } catch (error) {
      ToastAndroid.show("Error picking file from document directory", ToastAndroid.LONG);
    }
  };

  if (launchCameraView) {
    return (
      <CameraView
        onCameraReady={() => setCameraReady(true)}
        ref={CameraRef}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <View
          style={{ backgroundColor: "#F3EDF7", padding: hscale(20), gap: 12 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "Inter-Bold", fontSize: mscale(14) }}>
              Ensure the enviroment is well lit
            </Text>
            <CheckIcon name="check-circle" size={24} color={"green"} />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "Inter-Bold", fontSize: mscale(14) }}>
              Keep the camera steady and focused
            </Text>
            <CheckIcon name="check-circle" size={24} color={"green"} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "Inter-Bold", fontSize: mscale(14) }}>
              Resolution should be at the highest
            </Text>
            <CheckIcon name="check-circle" size={24} color={"green"} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "Inter-Bold", fontSize: mscale(14) }}>
              Live capture should be in jpeg or png
            </Text>
            <CheckIcon name="check-circle" size={24} color={"green"} />
          </View>

          <PrimaryButton
            text="Capture"
            onPress={handleCapture}
            isLoading={capturing}
          />
        </View>
        <ToastManager />
      </CameraView>
    );
  }

  return (
    // <ProtectPage>

    <>
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
          <View
            style={{
              height: hscale(142),
              width: wscale(113),
              marginHorizontal: "auto",
            }}
          >
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
                <Text
                  style={{
                    fontFamily: "Inter-Bold",
                    marginLeft: wscale(12),
                    color: "#ffffff",
                  }}
                >
                  Use Camera
                </Text>
              </Pressable>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Inter-Bold",
                  color: colors.primary,
                  fontSize: mscale(14),
                  marginVertical: mscale(5),
                }}
              >
                OR
              </Text>
              <Text
                onPress={handleUseFilePicker}
                style={{
                  fontFamily: "Inter-Bold",
                  color: colors.primary,
                  fontSize: mscale(20),
                  textAlign: "center",
                  // marginTop: hscale(20),
                }}
              >
                Click to select a file from storage
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
                <WarnIcon
                  name="exclamation-triangle"
                  size={24}
                  color={"#E28400"}
                />
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

              <Text style={{ fontFamily: "Inter-Regular", fontSize: mscale(12), textAlign: "center", marginTop: hscale(20) }}>
                Disclaimer: Content on Solva isn’t ours and wasn’t uploaded by
                us. For educational use only
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ToastManager />
    </>

    // </ProtectPage>
  );
}
