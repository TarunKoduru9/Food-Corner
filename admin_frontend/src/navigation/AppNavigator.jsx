import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/authentication/LoginScreen";
import ForgotPasswordScreen from "../screens/authentication/ForgorPasswordScreen";
import ResetPasswordScreen from "../screens/authentication/ResetPasswordScreen";
import VerifyOTPScreen from "../screens/authentication/VerifyOTPScreen";
import Dashboard from "../screens/pages/DashboardScreen";
import CategoriesScreen from "../screens/pages/CategoriesScreen";
import AdminPanelLayout from "../screens/pages/AdminPanelLayout";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyOTP"
        component={VerifyOTPScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Panel"
        component={AdminPanelLayout}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
