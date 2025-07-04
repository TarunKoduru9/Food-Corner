import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/authentication/LoginScreen";
import SignupScreen from "../screens/authentication/SignupScreen";
import ForgotPasswordScreen from "../screens/authentication/ForgorPasswordScreen";
import ResetPasswordScreen from "../screens/authentication/ResetPasswordScreen";
import VerifyOTPScreen from "../screens/authentication/VerifyOTPScreen";
import OtpLoginScreen from "../screens/authentication/OtpLoginScreen";

import HomeScreen from "../screens/tabs/HomeScreen";
import ProfileScreen from "../screens/tabs/navmenulist/ProfileScreen";
import CategoryScreen from "../screens/Category/CategoryScreen";
import CartScreen from "../screens/cart/CartScreen";
import CouponScreen from "../screens/cart/CouponScreen";
import AddressScreen from "../screens/authentication/AddressScreen";

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
        name="signup"
        component={SignupScreen}
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
        name="OtpLogin"
        component={OtpLoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryItems"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cartpage"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Coupons"
        component={CouponScreen}
        options={{ title: "Available Coupons" }}
      />
      <Stack.Screen
        name="Location"
        component={AddressScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
