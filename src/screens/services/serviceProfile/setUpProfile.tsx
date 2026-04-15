import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from "react-native";
import { colors } from "@/src/constants/theme";
import { mscale, hscale, wscale } from "@/src/helpers/metric";
import { useRouter } from "expo-router";
import { AUTH_API_CLIENT } from "../../../api/apiClient";
import { ServiceType } from "@/src/types";
import ErrorModal from "@/src/components/errorModal";
import { Picker } from "@react-native-picker/picker";
import ToastManager, { Toast } from "toastify-react-native";
import * as DocumentPicker from "expo-document-picker";
import { useAuthStore } from "@/src/stores/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFreelancerId,
  getFreelancerProfileState,
  mergeAuthUserProfile,
} from "@/src/helpers/freelancerProfile";

export default function SetUpProfile() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [categories, setCategories] = useState<ServiceType[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [profileImageUri, setProfileImageUri] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [uni, setUni] = useState("");

  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const { hasFreelancerProfile } = getFreelancerProfileState(authUser);

  const notify = (type: "success" | "error" | "info", message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.LONG);
      return;
    }

    if (type === "success") Toast.success(message);
    else if (type === "error") Toast.error(message);
    else Toast.info(message);
  };

  useEffect(() => {
    if (hasFreelancerProfile) {
      router.replace("/(services)/services-profile/service-profile");
      return;
    }

    const getServices = async () => {
      try {
        setLoading(true);
        const response = await AUTH_API_CLIENT.get("/freelancers/catigories");
        if (response?.status === 200) {
          setCategories(response.data.data);
        }
      } catch {
        setErrorMessage("Something went wrong while fetching services!");
        setErrorVisible(true);
      } finally {
        setLoading(false);
      }
    };

    void getServices();
  }, [hasFreelancerProfile, router]);

  const handlePickProfileImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const asset = result.assets?.[0];
        const pickedName = asset?.name;
        const uri = asset?.uri;
        const mimeType = asset?.mimeType;
        const file = (asset as any)?.file ?? null;

        if (!pickedName || !uri) {
          notify("error", "Invalid image selected. Please try again.");
          return;
        }

        setProfileImageUri({
          fileUri: uri,
          name: pickedName,
          mimeType: mimeType || "image/jpeg",
          file,
        });
      }
    } catch (error) {
      console.error("File picker error:", error);
      notify("error", "Error picking image. Please try again.");
    }
  };

  const handleUpdate = async () => {
    if (hasFreelancerProfile) {
      notify("info", "Freelancer profile already exists.");
      router.replace("/(services)/services-profile/service-profile");
      return;
    }

    if (
      !name ||
      !selectedCategoryId ||
      !description ||
      !amount ||
      !portfolio ||
      !phone ||
      !whatsapp ||
      !uni ||
      !profileImageUri?.fileUri
    ) {
      notify("info", "Ensure all fields are filled and an image is added.");
      return;
    }

    setUpdating(true);

    const formData = new FormData();
    formData.append("fullName", name);
    formData.append("categoryId", String(selectedCategoryId));
    formData.append("bio", description);
    formData.append("startingAmount", parseFloat(amount).toString());
    formData.append("portfolioLink", portfolio);
    formData.append("phoneNumber", phone);
    formData.append("whatsappLink", whatsapp);
    formData.append("location", uni);

    if (Platform.OS === "web") {
      let file = profileImageUri?.file as any;

      if (!file && profileImageUri?.fileUri) {
        const blob = await fetch(profileImageUri.fileUri).then((res) =>
          res.blob(),
        );
        file = new File([blob], profileImageUri.name || "profile.jpg", {
          type: profileImageUri.mimeType || blob.type || "image/jpeg",
        });
      }

      if (!file) {
        notify(
          "error",
          "Web upload needs a real file object. Please re-pick the image.",
        );
        setUpdating(false);
        return;
      }

      formData.append("profilePic", file, file.name || profileImageUri.name);
    } else {
      formData.append("profilePic", {
        uri: profileImageUri.fileUri,
        name: profileImageUri.name,
        type: profileImageUri.mimeType,
      } as any);
    }

    try {
      const response = await AUTH_API_CLIENT.post(
        "/freelancers/create",
        formData,
        {
          headers:
            Platform.OS === "web"
              ? undefined
              : { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.status === 200 || response.status === 201) {
        notify("success", "Profile created successfully");

        const currentUser = useAuthStore.getState().user;

        if (currentUser) {
          const createdFreelancerId =
            getFreelancerId(response?.data?.data) ||
            getFreelancerId(response?.data?.data?.freelancer) ||
            getFreelancerId(response?.data?.data?.freelancerId) ||
            getFreelancerId(response?.data?.data?.freelancerProfile) ||
            getFreelancerId(response?.data?.data?.freelancerProfileId);

          const updatedUser = mergeAuthUserProfile(currentUser, {
            ...response?.data?.data,
            role: "freelancer",
            freelancer:
              createdFreelancerId ??
              getFreelancerId(currentUser?.profile?.freelancer),
            freelancerId:
              createdFreelancerId ??
              getFreelancerId(currentUser?.profile?.freelancerId),
            freelancerProfile:
              createdFreelancerId ??
              getFreelancerId(currentUser?.profile?.freelancerProfile),
            freelancerProfileId:
              createdFreelancerId ??
              getFreelancerId(currentUser?.profile?.freelancerProfileId),
            hasServiceProfile: true,
          });

          useAuthStore.setState({ user: updatedUser });
          await AsyncStorage.setItem("User", JSON.stringify(updatedUser));
        }

        router.replace("/(services)/services-profile/service-profile");
      } else {
        notify("error", "Unexpected server response");
      }
    } catch (error: any) {
      console.error("Upload failed:", error?.message || error);

      const msg =
        error?.response?.data?.message ||
        "An unexpected error occurred. Please try again.";

      if (
        error?.response?.status === 400 &&
        String(msg).toLowerCase().includes("already a freelancer")
      ) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          const updatedUser = mergeAuthUserProfile(currentUser, {
            role: "freelancer",
            hasServiceProfile: true,
          });
          useAuthStore.setState({ user: updatedUser });
          await AsyncStorage.setItem("User", JSON.stringify(updatedUser));
        }

        notify("info", "Freelancer profile already exists.");
        router.replace("/(services)/services-profile/service-profile");
        return;
      }

      notify("error", msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ToastManager />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text
        style={{
          fontFamily: "Inter-Medium",
          fontSize: mscale(20),
          textAlign: "center",
          marginVertical: mscale(20),
        }}
      >
        Setup your profile as a freelancer!
      </Text>

      <TouchableOpacity
        onPress={handlePickProfileImage}
        style={styles.imagePicker}
      >
        {profileImageUri ? (
          <Image
            source={{ uri: profileImageUri.fileUri }}
            style={styles.profileImage}
          />
        ) : (
          <View
            style={{
              height: hscale(123),
              width: wscale(123),
              backgroundColor: "#EBEDEB80",
              borderRadius: mscale(16),
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: "auto",
            }}
          >
            <Image source={require("@/assets/images/services/Image.png")} />
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        editable={!updating}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          enabled={!updating}
          style={styles.picker}
          selectedValue={selectedCategoryId}
          onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
        >
          <Picker.Item label="Select a category" value={null} />
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.title} value={cat.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Location</Text>
      <TextInput
        placeholder="Input Location"
        value={uni}
        onChangeText={setUni}
        style={styles.input}
        editable={!updating}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[
          styles.input,
          { height: hscale(100), textAlignVertical: "top" },
        ]}
        multiline
        editable={!updating}
      />

      <Text style={styles.label}>Amount (NGN)</Text>
      <TextInput
        placeholder="Amount (Starting price)"
        value={amount}
        onChangeText={(text) => {
          const numeric = text.replace(/[^0-9]/g, "");
          setAmount(numeric);
        }}
        keyboardType="numeric"
        style={styles.input}
        editable={!updating}
      />

      <Text style={styles.label}>Portfolio Link</Text>
      <TextInput
        placeholder="Portfolio Link"
        value={portfolio}
        onChangeText={setPortfolio}
        style={styles.input}
        editable={!updating}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={(text) => {
          const numeric = text.replace(/[^0-9]/g, "");
          setPhone(numeric);
        }}
        keyboardType="phone-pad"
        style={styles.input}
        editable={!updating}
      />

      <Text style={styles.label}>WhatsApp Number</Text>
      <TextInput
        placeholder="WhatsApp Number"
        value={whatsapp}
        onChangeText={(text) => {
          const numeric = text.replace(/[^0-9]/g, "");
          setWhatsapp(numeric);
        }}
        keyboardType="number-pad"
        style={styles.input}
        editable={!updating}
      />

      <TouchableOpacity
        onPress={handleUpdate}
        disabled={updating}
        style={styles.updateButton}
      >
        {updating ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.updateText}>Create Profile</Text>
        )}
      </TouchableOpacity>

      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />

      <ToastManager />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wscale(10),
    backgroundColor: "#fff",
  },
  imagePicker: {
    alignSelf: "center",
    marginBottom: hscale(20),
  },
  profileImage: {
    width: wscale(100),
    height: hscale(100),
    borderRadius: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: mscale(8),
    padding: mscale(12),
    marginBottom: hscale(16),
    fontFamily: "Inter-Regular",
    fontSize: mscale(14),
    backgroundColor: colors.inputFieldNew,
    color: "#5C5F62",
  },
  updateButton: {
    backgroundColor: colors.primary,
    padding: mscale(14),
    borderRadius: mscale(8),
    alignItems: "center",
    marginBottom: 10,
  },
  updateText: {
    color: "#fff",
    fontFamily: "Inter-Bold",
    fontSize: mscale(16),
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: mscale(8),
    marginBottom: hscale(16),
    backgroundColor: colors.inputFieldNew,
    minHeight: hscale(48),
    justifyContent: "center",
    overflow: "hidden",
    paddingRight: wscale(12),
  },
  picker: {
    color: "#5C5F62",
    fontFamily: "Inter-Regular",
    fontSize: mscale(14),
    backgroundColor: colors.inputFieldNew,
    ...Platform.select({
      android: { height: hscale(48) },
      ios: { height: hscale(48) },
      web: {
        height: hscale(48),
        paddingHorizontal: mscale(12),
        borderWidth: 0,
        outlineWidth: 0 as any,
      } as any,
    }),
  },
  label: {
    fontSize: mscale(13),
    fontFamily: "Inter-Medium",
    marginBottom: hscale(4),
    marginTop: hscale(4),
  },
});
