import React, { useEffect, useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/api";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin({ onLogin }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "117862545152-e23mnc998pmg3tqqr0u8gad16u20acn2.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@rrfoodcorner/frontend",
    scopes: ["profile", "email"],
  });

  const fetchGoogleUserInfo = useCallback(async (accessToken) => {
    try {
      // Get user info from Google
      const userInfo = await API.get("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { email, name } = userInfo.data;

      // Authenticate with your backend
      const res = await API.post("/auth/google", { email, name });
      const { token, user } = res.data;

      // Save token and user info securely
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      if (onLogin) onLogin({ token, user });
    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);
      Alert.alert("Login failed", "Unable to login with Google.");
    }
  }, [onLogin]);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetchGoogleUserInfo(authentication.accessToken);
    }
  }, [response, fetchGoogleUserInfo]);

  return (
    <Button
      title="Login with Google"
      onPress={() => promptAsync()}
      disabled={!request}
    />
  );
}
