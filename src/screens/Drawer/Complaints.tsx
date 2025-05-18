// import InProgress from "@/src/components/inprogress";
// import { globalStyles } from "@/src/styles/global";
// import { View, Text } from "react-native";


// export default function Complaints() {
//     return (
//         <View style={globalStyles.screen}>
//             {/* <Text>Complaints Screen</Text> */}
//             <InProgress/>
//         </View>
//     )
// } 
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { globalStyles } from "@/src/styles/global";
import { mscale, hscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";

export default function Complaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [newComplaint, setNewComplaint] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

//   const fetchComplaints = async () => {
//     setLoading(true);
//     try {
//       // Replace with your API call
//       const res = await AUTH_API_CLIENT.get("/complaints");
//       setComplaints(res.data?.data || []);
//     } catch (err) {
//       console.log("Error fetching complaints:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

  const submitComplaint = async () => {
    if (!newComplaint.trim()) return;

    setSubmitting(true);
    try {
      // Replace with your POST endpoint
      const res = await AUTH_API_CLIENT.post("/complaints", {
        message: newComplaint.trim(),
      });

      setComplaints((prev) => [
        { id: Date.now().toString(), message: newComplaint.trim() },
        ...prev,
      ]);
      setNewComplaint("");
    } catch (err) {
      console.log("Error submitting complaint:", err);
    } finally {
      setSubmitting(false);
    }
  };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.complaintItem}>
      <Text style={styles.complaintText}>{item.message}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={globalStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.header}>Submit a Complaint</Text>

      <TextInput
        placeholder="Type your complaint here..."
        value={newComplaint}
        onChangeText={setNewComplaint}
        style={styles.input}
        multiline
      />

      <Pressable style={styles.button} onPress={submitComplaint} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? "Submitting..." : "Submit"}</Text>
      </Pressable>

      {/* <Text style={styles.subHeader}>Your Complaints</Text> */}

      {/* {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : complaints.length === 0 ? (
        <Text style={styles.empty}>No complaints yet.</Text>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hscale(24) }}
        />
      )} */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: mscale(18),
    fontFamily: "Inter-Bold",
    marginBottom: hscale(8),
  },
  subHeader: {
    fontSize: mscale(16),
    fontFamily: "Inter-SemiBold",
    marginTop: hscale(20),
    marginBottom: hscale(10),
  },
  input: {
    backgroundColor: colors.inputField,
    padding: mscale(12),
    borderRadius: mscale(8),
    fontSize: mscale(14),
    fontFamily: "Inter-Regular",
    minHeight: hscale(80),
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: hscale(10),
    borderRadius: mscale(8),
    marginTop: hscale(12),
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: mscale(14),
    fontFamily: "Inter-Medium",
  },
  complaintItem: {
    backgroundColor: colors.inputField,
    padding: mscale(12),
    borderRadius: mscale(8),
    marginBottom: hscale(10),
  },
  complaintText: {
    fontSize: mscale(14),
    fontFamily: "Inter-Regular",
  },
  empty: {
    fontSize: mscale(14),
    fontFamily: "Inter-Regular",
    color: colors.bodyText,
    marginTop: hscale(16),
  },
});
