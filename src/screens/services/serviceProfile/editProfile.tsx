import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "@/src/constants/theme";
import { mscale, hscale, wscale } from "@/src/helpers/metric";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import { FreelancerProfile, ServiceType } from "@/src/types";
import ErrorModal from "@/src/components/errorModal";
import { Picker } from "@react-native-picker/picker";
import ToastManager, { Toast } from "toastify-react-native";

type Props = StaticScreenProps<{ userData: FreelancerProfile }>;

export default function EditProfile({ route }: Props) {
  const { userData } = route.params;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [categories, setCategories] = useState<ServiceType[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const getServices = async () => {
      try {
        const response = await AUTH_API_CLIENT.get("/freelancers/catigories");
        if (response.status === 200) {
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

  useEffect(() => {
    if (userData) {
      setName(userData.fullName || "");
      setDescription(userData.bio || "");
      setAmount(String(userData.startingAmount || ""));
      setPortfolio(userData.portfolioLink || "");
      setPhone(userData.phoneNumber || "");
      setWhatsapp(userData.whatsappLink || "");
      setProfileImageUri(userData.profilePic || null);
      setSelectedCategoryId(userData.categoryId?.toString() || null);
    }
  }, [userData]);

  const handlePickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        setProfileImageUri(result.assets[0].uri);
      }
    } catch {
      Toast.error("Failed to pick image. Please try again.");
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
      !whatsapp
    ) {
      Toast.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", name.trim());
    formData.append("categoryId", String(selectedCategoryId));
    formData.append("bio", description);
    formData.append("startingAmount", amount);
    formData.append("portfolioLink", portfolio.trim());
    formData.append("phoneNumber", phone);
    formData.append("whatsappLink", whatsapp);

    if (profileImageUri && profileImageUri !== userData.profilePic) {
      const fileName = profileImageUri.split("/").pop() || "profile.jpg";
      const fileType = fileName.split(".").pop();
      const mimeType = fileType === "png" ? "image/png" : "image/jpeg";
      formData.append("profilePic", {
        uri: profileImageUri,
        name: fileName,
        type: mimeType,
      } as any);
    }
    console.log(formData,"fd")
    try {
      setUpdating(true);
      const response = await AUTH_API_CLIENT.patch(
        `/freelancers/edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(response, "edit res")
      if (response.status === 200) {
        Toast.success("Profile updated successfully!");
        navigation.goBack();
        
      } else {
        Toast.error("Unexpected response from server.");
      }
    } catch (error: any) {
      if (error.response) {
        Toast.error(error.response.data?.message || "Server error.");
      } else if (error.request) {
        Toast.error("No response from server.");
      } else {
        Toast.error("An unexpected error occurred.");
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit your profile</Text>

      <TouchableOpacity
        onPress={handlePickProfileImage}
        style={styles.imagePicker}
      >
        <Image
          source={{ uri: profileImageUri || undefined }}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
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
              value={cat.id.toString()}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
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
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        editable={!updating}
      />

      <Text style={styles.label}>Portfolio Link</Text>
      <TextInput
        value={portfolio}
        onChangeText={setPortfolio}
        style={styles.input}
        editable={!updating}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        editable={!updating}
      />

      <Text style={styles.label}>WhatsApp Link</Text>
      <TextInput
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
          <Text style={styles.updateText}>Update Profile</Text>
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
  title: {
    fontFamily: "Inter-Medium",
    fontSize: mscale(22),
    textAlign: "center",
    marginBottom: mscale(20),
  },
  imagePicker: {
    alignSelf: "center",
    marginBottom: hscale(20),
  },
  profileImage: {
    width: wscale(100),
    height: hscale(100),
    borderRadius: 50,
    backgroundColor: "#EBEDEB80",
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
