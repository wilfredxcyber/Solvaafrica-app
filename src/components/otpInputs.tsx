import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { hscale, mscale, wscale } from "../helpers/metric";
import { colors } from "../constants/theme";

const OtpInput = ({ onSubmit }: { onSubmit: (otp: string) => void }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [pressed, setPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      onSubmit(newOtp.join(""));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            autoFocus={i === 0}
          />
        ))}
      </View>
      <Pressable
        style={[styles.buttonView, { opacity: pressed ? 0.9 : 1 }]}
        onPress={() => onSubmit(otp.join(""))}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        // disabled={isLoading}
        disabled={otp.some((d) => d === "")}
      >
        {!isLoading ? (
          <Text style={styles.buttonText}>Proceed</Text>
        ) : (
          <ActivityIndicator size={"small"} color={"#ffffff"} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  label: { fontSize: mscale(16), marginBottom: mscale(12) },
  otpContainer: {
    flexDirection: "row",
    gap: mscale(10),
    marginVertical: mscale(20),
  },
  input: {
    width: wscale(60),
    height: hscale(60),
    borderWidth: 1,
    borderRadius: mscale(8),
    textAlign: "center",
    fontSize: mscale(24),
    borderColor: colors.primary,
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: mscale(10),
    borderRadius: mscale(6),
  },

  submitText: { color: "white", fontSize: mscale(16) },
  buttonView: {
    backgroundColor: colors.primary,
    width: "100%",
    borderRadius: mscale(100),
    minHeight: hscale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "#ffffff",
    fontFamily: "Inter-Medium",
    fontSize: mscale(16),
    textTransform: "capitalize",
  },
});

export default OtpInput;
