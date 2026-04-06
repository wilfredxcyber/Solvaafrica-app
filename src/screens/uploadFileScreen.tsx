import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import WarnIcon from "@expo/vector-icons/FontAwesome5";
import * as DocumentPicker from "expo-document-picker";
import LeftIcon from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";

import { colors, screenHorizontalPadding } from "../constants/theme";
import { hscale, mscale, wscale } from "../helpers/metric";
import { PickedFile } from "../types";
import ToastManager, { Toast } from "toastify-react-native";

const isPdfFile = (name: string, mimeType?: string | null) =>
  mimeType === "application/pdf" || name.toLowerCase().endsWith(".pdf");

export default function UploadFilesScreen() {
  const router = useRouter();

  const handleUseFilePicker = async () => {
    try {
      const pickedFile = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!pickedFile.canceled) {
        const { name, uri, mimeType } = pickedFile.assets[0];
        if (!name || !uri) return;

        if (!isPdfFile(name, mimeType)) {
          Toast.error("Only PDF files are allowed for upload");
          return;
        }

        const _pickedFile: PickedFile = {
          fileUri: uri,
          imageUri: uri,
          name,
          mimeType: "application/pdf",
        };

        router.push({
          pathname: "/upload-preview",
          params: { pickedFile: JSON.stringify(_pickedFile) },
        });
      }
    } catch {
      Toast.error("Error picking file from document directory");
    }
  };

  return (
    <>
      <View style={{ backgroundColor: colors.primary, flex: 1 }}>
        {/* Back button */}
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)");
            }
          }}
          style={{
            width: wscale(48),
            height: hscale(48),
            justifyContent: "center",
            marginLeft: screenHorizontalPadding,
          }}
        >
          <LeftIcon name="arrow-back-outline" size={24} color="#ffffff" />
        </Pressable>

        <View style={{ flex: 1 }}>
          {/* Header image */}
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

          {/* Title */}
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

          {/* Subtitle */}
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
            Only PDF documents are allowed for upload.
          </Text>

          {/* Bottom sheet */}
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View
              style={{
                backgroundColor: "#ffffff",
                height: "60%",
                borderTopLeftRadius: mscale(20),
                borderTopRightRadius: mscale(20),
                paddingTop: hscale(32),
              }}
            >
              {/* Upload button */}
              <Pressable
                onPress={handleUseFilePicker}
                style={{
                  backgroundColor: colors.primary,
                  width: 300,
                  height: 53,
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  borderRadius: mscale(8),
                }}
              >
                <Text
                  style={{
                    color: "#ffffff",
                    fontFamily: "Inter-Bold",
                    fontSize: mscale(16),
                  }}
                >
                  Click to select a file from storage
                </Text>
              </Pressable>

              {/* Warning */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "80%",
                  backgroundColor: "#fadada",
                  marginHorizontal: "auto",
                  paddingVertical: hscale(12),
                  paddingHorizontal: wscale(24),
                  borderRadius: mscale(6),
                  borderWidth: 2,
                  borderColor: "#FF0707",
                  marginTop: hscale(24),
                }}
              >
                <WarnIcon
                  name="exclamation-triangle"
                  size={24}
                  color="#FF0707"
                />
                <Text
                  style={{
                    fontFamily: "Inter-Bold",
                    marginLeft: wscale(8),
                    color: "#FF0707",
                    flex: 1,
                  }}
                >
                  Note what is expected while uploading PDFs
                </Text>
              </View>

              {/* Disclaimer */}
              <Text
                style={{
                  width: "80%",
                  marginHorizontal: "auto",
                  marginTop: hscale(16),
                  fontSize: mscale(12),
                  color: colors.black,
                  lineHeight: mscale(18),
                }}
              >
                <Text style={{ fontFamily: "Inter-Bold", color: colors.black }}>
                  Disclaimer:
                </Text>
                Content on Solva isn’t ours and wasn’t uploaded by us. For
                educational use only
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ToastManager />
    </>
  );
}
