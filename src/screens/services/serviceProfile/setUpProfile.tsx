import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Linking,
  Image,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from "react-native";
import { colors } from "@/src/constants/theme";
import { mscale, hscale, wscale } from "@/src/helpers/metric";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { API_BASE_URL, AUTH_API_CLIENT } from "@/src/api/apiClient";
import { ServiceType } from "@/src/types";
import ErrorModal from "@/src/components/errorModal";
import { Picker } from "@react-native-picker/picker";
import ToastManager, { Toast } from "toastify-react-native";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useAuthStore } from "@/src/stores/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SetUpProfile() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [categories, setCategories] = useState<ServiceType[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getServices = async () => {
      try {
        setLoading(true);
        const response = await AUTH_API_CLIENT.get("/freelancers/catigories");

        if (response && response.status === 200) {
          setCategories(response.data.data);
        }
      } catch (error) {
        setErrorMessage("Something went wrong while fetching services!");
        setErrorVisible(true);
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  const [profileImageUri, setProfileImageUri] = useState<string | any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const navigation = useNavigation();

  const handlePickProfileImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const { name, uri, mimeType } = result.assets[0];
        if (!name || !uri || !mimeType) throw new Error("Invalid picked asset");

        const _pickedFile: any = {
          fileUri: uri,
          imageUri: uri,
          name,
          mimeType,
        };

        setProfileImageUri(_pickedFile);
      }
    } catch (error) {
      console.error("File picker error:", error);
      ToastAndroid.show(
        "Error picking image from document directory",
        ToastAndroid.LONG
      );
    }
  };

  const handleUpdate = async () => {

    if (
      !name ||
      !selectedCategoryId ||
      !description ||
      !amount ||
      !portfolio ||
      !phone ||
      !whatsapp ||
      !profileImageUri?.fileUri
    ) {
      ToastAndroid.show(
        "Ensure all fields are filled and an image is added.",
        ToastAndroid.LONG
      );
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

    formData.append("profilePic", {
      uri: profileImageUri.fileUri,
      name: profileImageUri.name,
      type: profileImageUri.mimeType,
    } as any);

    try {
      const response = await AUTH_API_CLIENT.post(
        "/freelancers/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        ToastAndroid.show("Profile created successfully", ToastAndroid.LONG);

        const AuthUser = useAuthStore.getState().user;
        if (AuthUser) {
          const updatedUser = {
            ...AuthUser,
            profile: {
              ...AuthUser.profile,
              role: "freelancer",
              freelancer: AuthUser.profile.freelancer ?? response?.data.data.id,
            },
            tokens: AuthUser.tokens,
          };
          useAuthStore.setState({ user: updatedUser });
          await AsyncStorage.setItem("User", JSON.stringify(updatedUser));
        }

        navigation.navigate("App", { screen: "ServiceProfile" });
      } else {
        ToastAndroid.show("Unexpected server response", ToastAndroid.LONG);
      }
    } catch (error: any) {
      console.error("Upload failed:", error?.message || error);
      ToastAndroid.show("An unexpected error occurred", ToastAndroid.LONG);
    } finally {
      setUpdating(false);
    }
  };

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
          selectedValue={selectedCategoryId}
          onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
        >
          <Picker.Item label="Select a category" value={null} />
          {categories.map((cat) => (
            <Picker.Item
              key={cat.id}
              label={cat.title}
              value={cat.id}
              style={styles.input}
            />
          ))}
        </Picker>
      </View>

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
        onChangeText={setAmount}
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
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        editable={!updating}
      />

      <Text style={styles.label}>WhatsApp Link</Text>
      <TextInput
        placeholder="WhatsApp Number"
        value={whatsapp}
        onChangeText={setWhatsapp}
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
  placeholder: {
    width: wscale(100),
    height: hscale(100),
    borderRadius: 50,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: mscale(8),
    padding: mscale(12),
    marginBottom: hscale(16),
    fontFamily: "Inter-Regular",
    fontSize: mscale(14),
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
    borderColor: "#ccc",
    borderRadius: mscale(8),
    marginBottom: hscale(16),
    backgroundColor: "#fff",
  },
  label: {
    fontSize: mscale(13),
    fontFamily: "Inter-Medium",
    marginBottom: hscale(4),
    marginTop: hscale(4),
  },
});
