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

const ForgotPasswordScreen = ({ navigation }) => {
  const [emailOrMobile, setemailOrMobile] = useState("");

  const handleSendOTP = async () => {
    if (!emailOrMobile) {
      return Alert.alert("Error", "Please enter your email or mobile");
    }

    try {
       API.post("/admin/send-otp", {
        emailOrMobile,
      });

      Alert.alert("Success", "OTP sent to your email");
      navigation.navigate("VerifyOTP", { emailOrMobile });
    } catch (err) {
      console.error("OTP error:", err);
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email or mobile"
        value={emailOrMobile}
        onChangeText={setemailOrMobile}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: "#16203bd5", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
