import React from "react";
import { Modal, View, Text, StyleSheet, Pressable, Image } from "react-native";
import { colors } from "../constants/theme";
import { hscale, mscale, wscale } from "../helpers/metric";

export default function ErrorModal({
  visible,
  message,
  onClose,
}: {
  visible: boolean;
  message: string;
  onClose: () => void;
}) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* <Text style={styles.title}>Error</Text> */}
          <View>
            <Image
              source={require("../../assets/images/error.png")}
              style={{
                width: wscale(200),
                height: hscale(200),
                marginHorizontal: "auto",
                marginVertical: hscale(10),
              }}
            />
          </View>
          <Text style={styles.message}>{message}</Text>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: mscale(12),
    padding: hscale(20),
    alignItems: "center",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(18),
    marginBottom: hscale(10),
    color: "red",
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: mscale(16),
    textAlign: "center",
    marginBottom: hscale(20),
    color: colors.bodyText,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: hscale(10),
    paddingHorizontal: hscale(20),
    borderRadius: mscale(8),
  },
  buttonText: {
    fontFamily: "Inter-Bold",
    color: "#fff",
    fontSize: mscale(14),
  },
});
