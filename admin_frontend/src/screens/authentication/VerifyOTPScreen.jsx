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

const VerifyOTPScreen = ({ route, navigation }) => {
  const { emailOrMobile } = route.params;
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async () => {
    if (!otp) return Alert.alert("Error", "Please enter the OTP");

    try {
      await API.post("/admin/verify-otp", {
        emailOrMobile,
        otp,
      });

      Alert.alert("Success", "OTP verified. Please reset your password.");
      navigation.navigate("ResetPassword", { emailOrMobile });
    } catch (err) {
      console.error("OTP verify error:", err);
      Alert.alert("Error", err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Sent to {emailOrMobile}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifyOTPScreen;


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  subtitle: { fontSize: 16, marginBottom: 24, textAlign: "center", color: "#666" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: "#16203bd5", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
