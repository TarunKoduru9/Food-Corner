import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import API from "../../utils/api";

const OtpLoginScreen = ({ navigation }) => {
  const [emailOrMobile, setemailOrMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const requestOtp = async () => {
    if (!emailOrMobile)
      return Alert.alert("Error", "Please enter email or mobile number");

    try {
      await API.post("/auth/send-otp", { emailOrMobile });

      Alert.alert("OTP Sent", "Check your email or mobile for the OTP");
      setStep(2);
    } catch (err) {
      console.error("OTP send error:", err);
      Alert.alert("Error", err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp) return Alert.alert("Error", "Enter the OTP");

    try {
      await API.post("/auth/verify-otp", { emailOrMobile, otp });

      Alert.alert("Success", "Logged in successfully!");
      navigation.replace("Home");
    } catch (err) {
      console.error("OTP verify error:", err);
      Alert.alert("Error", err?.response?.data?.message || "Failed to verify OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Login</Text>
      <TextInput
        placeholder="Email or Mobile Number"
        value={emailOrMobile}
        onChangeText={setemailOrMobile}
        style={styles.input}
      />
      {step === 2 && (
        <TextInput
          placeholder="Enter OTP"
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={step === 1 ? requestOtp : verifyOtp}
      >
        <Text style={styles.buttonText}>
          {step === 1 ? "Send OTP" : "Verify OTP"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpLoginScreen;


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#16203bd5",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
