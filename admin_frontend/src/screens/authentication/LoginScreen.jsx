import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../utils/api";

const LoginScreen = ({ navigation }) => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrMobile || !password) {
      alert("Please enter email/mobile and password");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/admin/login", {
        emailOrMobile,
        password,
      });

      const { token, user } = response.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      alert("Login successful!");
      navigation.replace("Panel");
    } catch (err) {
      console.error("Login error:", err);
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        navigation.replace("Panel");
      }
    };
    checkLoggedIn();
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>RR Food Corner</Text>

      <Image
        source={require("../../../assets/images/coverimage.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.admintitle}>Admin&apos;s Only</Text>
      <TextInput
        placeholder="Email or Mobile"
        autoFocus
        style={styles.input}
        value={emailOrMobile}
        onChangeText={setEmailOrMobile}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => navigation.navigate("signup")}>
          <View style={styles.signupview}>
            <Text>Create an Account</Text>
            <Text style={styles.linkText}>Signup</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
    color: "#16203bd5",
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  admintitle: {
    padding:10,
    fontSize:15,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#16203bd5",
    padding: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
  },
  signupview: {
    flexDirection: "row",
    gap: 15,
  },
  linkText: {
    color: "black",
    textDecorationLine: "underline",
  },
});
