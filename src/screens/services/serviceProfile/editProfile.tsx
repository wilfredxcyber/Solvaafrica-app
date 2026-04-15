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
  ToastAndroid,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "@/src/constants/theme";
import { mscale, hscale, wscale } from "@/src/helpers/metric";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import { FreelancerProfile, ServiceType } from "@/src/types";
import ErrorModal from "@/src/components/errorModal";
import { Picker } from "@react-native-picker/picker";
import ToastManager, { Toast } from "toastify-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [userData, setUserData] = useState<FreelancerProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [categories, setCategories] = useState<ServiceType[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [initialized, setInitialized] = useState(false);

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [uni, setUni] = useState("");

  const cleanImageUrl = (url?: string | null) => {
    if (!url) return null;

    return url
      .trim()
      .replace(/\s/g, "") // remove ALL spaces
      .replace("%20", "") // remove encoded space
      .replace("%2F", "/"); // fix Firebase path encoding if needed
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      try {
        const response = await AUTH_API_CLIENT.get(`/freelancers/${id}`);
        console.log(response);

        if (response.status === 200) {
          const data = response.data?.data?.freelancer ?? response.data?.data;

          setUserData(data);
        }
      } catch (error) {
        console.log("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (userData && !initialized) {
      // console.log(userData);
      setName(userData.fullName || "");
      setDescription(userData.bio || "");
      setAmount(String(userData.startingAmount || ""));
      setPortfolio(userData.portfolioLink || "");
      setPhone(userData.phoneNumber || "");
      setWhatsapp(userData.whatsappLink || "");
      setProfileImageUri(userData.profilePic || null);
      setSelectedCategoryId(userData.categoryId?.toString() || null);
      setUni(userData.location || "");

      setInitialized(true); // 👈 prevents reset
    }
  }, [userData, initialized]);

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

  // useEffect(() => {
  //   if (userData) {
  //     setName(userData.fullName || "");
  //     setDescription(userData.bio || "");
  //     setAmount(String(userData.startingAmount || ""));
  //     setPortfolio(userData.portfolioLink || "");
  //     setPhone(userData.phoneNumber || "");
  //     setWhatsapp(userData.whatsappLink || "");
  //     setProfileImageUri(userData.profilePic || null);
  //     setSelectedCategoryId(userData.categoryId?.toString() || null);
  //     setUni(userData.location || "");
  //   }
  // }, [userData]);

  const handlePickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // ✅ THIS is the correct workaround
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        setProfileImageUri(result.assets[0].uri);
      }
    } catch {
      ToastAndroid.show(
        "Failed to pick image. Please try again.",
        ToastAndroid.LONG,
      );
    }
  };

  const handleUpdate = async () => {
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (!name.trim()) return Toast.error("Name is required");
    if (!selectedCategoryId) return Toast.error("Select a category");
    if (description.trim().length < 10)
      return Toast.error("Description too short");
    if (!amount || isNaN(Number(amount))) return Toast.error("Invalid amount");
    if (!isValidUrl(portfolio)) return Toast.error("Invalid portfolio link");
    if (phone.length < 10) return Toast.error("Invalid phone number");
    // if (!whatsapp.startsWith("http"))
    //   return Toast.error("Invalid WhatsApp link");
    if (!uni.trim()) return Toast.error("Location required");

    try {
      setUpdating(true);

      const formData = new FormData();
      formData.append("fullName", name.trim());
      formData.append("categoryId", String(selectedCategoryId));
      formData.append("bio", description);
      formData.append("startingAmount", amount);
      formData.append("portfolioLink", portfolio.trim());
      formData.append("phoneNumber", phone);
      formData.append("whatsappLink", whatsapp);
      formData.append("location", uni);

      if (profileImageUri && profileImageUri !== userData?.profilePic) {
        const fileName = profileImageUri.split("/").pop() || "profile.jpg";

        if (Platform.OS === "web") {
          // ✅ WEB FIX
          const response = await fetch(profileImageUri);
          const blob = await response.blob();

          formData.append("profilePic", blob, fileName);
        } else {
          // ✅ MOBILE (Android/iOS)
          const fileType = fileName.split(".").pop();

          const mimeType =
            fileType === "png"
              ? "image/png"
              : fileType === "jpg" || fileType === "jpeg"
                ? "image/jpeg"
                : "image/jpeg";

          formData.append("profilePic", {
            uri: profileImageUri,
            name: fileName,
            type: mimeType,
          } as any);
        }
      }

      const tokenData = await AsyncStorage.getItem("User");
      const token = tokenData
        ? JSON.parse(tokenData)?.tokens?.accessToken
        : null;

      const response = await fetch(
        "https://api.solvaafrica.com/api/v1/freelancers/edit",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Update failed");
      }

      Toast.success("Profile updated!");

      router.back(); // ✅ best navigation
    } catch (err: any) {
      console.log("UPDATE ERROR:", err);
      Toast.error(err.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  // Show loading if userData is not available yet
  if (!userData) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: mscale(10), fontFamily: "Inter-Regular" }}>
          Loading profile data...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit your profile</Text>

      <TouchableOpacity
        onPress={handlePickProfileImage}
        style={styles.imagePicker}
      >
        <Image
          source={{
            uri: profileImageUri || undefined,
          }}
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
        value={amount ? `₦${" "}${Number(amount).toLocaleString()}` : ""}
        onChangeText={(text) => {
          // remove commas & non-numbers
          const cleaned = text.replace(/,/g, "").replace(/\D/g, "");

          if (cleaned.length <= 10) {
            setAmount(cleaned); // 👈 store 500000
          }
        }}
        keyboardType="number-pad"
        placeholder="Enter amount (NGN)"
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
        onChangeText={(text) => {
          // remove anything that is not a number
          const cleaned = text.replace(/\D/g, "");

          // limit to max 11 digits (Nigeria standard)
          if (cleaned.length <= 11) {
            setPhone(cleaned);
          }
        }}
        keyboardType="number-pad"
        maxLength={11} // extra safety
        style={styles.input}
        editable={!updating}
      />

      <Text style={styles.label}>WhatsApp Number</Text>
      <TextInput
        value={whatsapp}
        onChangeText={setWhatsapp}
        style={styles.input}
        editable={!updating}
      />

      <TouchableOpacity
        onPress={handleUpdate}
        disabled={updating}
        style={[styles.updateButton, updating && { opacity: 0.6 }]}
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
    minHeight: "100%",
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
    borderColor: "#000", // black border
    borderRadius: mscale(8),
    padding: mscale(12),
    marginBottom: hscale(16),
    fontFamily: "Inter-Regular",
    fontSize: mscale(14),
    backgroundColor: colors.inputFieldNew, // background added
    color: "#5C5F62",
  },
  updateButton: {
    backgroundColor: colors.primary,
    padding: mscale(12),
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
    paddingRight: wscale(12), // to prevent text from touching the edge
  },

  picker: {
    color: "#5C5F62",
    fontFamily: "Inter-Regular",
    fontSize: mscale(14),
    backgroundColor: colors.inputFieldNew,
    ...Platform.select({
      android: {
        height: hscale(48),
      },
      ios: {
        height: hscale(48),
      },
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
