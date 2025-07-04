import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import CategoriesScreen from "./CategoriesScreen";
import DashboardScreen from "./DashboardScreen";

const AdminPanelLayout = () => {
  const [activeScreen, setActiveScreen] = useState("Dashboard");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  const renderScreen = () => {
    switch (activeScreen) {
      case "Dashboard":
        return <DashboardScreen />;
      case "Categories":
        return <CategoriesScreen />;
      // Add more cases...
      default:
        return <Text>Page not found</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      {isSidebarVisible && (
        <View style={styles.sidebar}>
          <ScrollView>
            <Text style={styles.heading}>Admin Panel</Text>
            <MenuButton title="Dashboard" onPress={() => { setActiveScreen("Dashboard"); toggleSidebar(); }} active={activeScreen === "Dashboard"} />
            <MenuButton title="Manage Categories" onPress={() => { setActiveScreen("Categories"); toggleSidebar(); }} active={activeScreen === "Categories"} />
            <MenuButton title="Food Items" onPress={() => { setActiveScreen("FoodItems"); toggleSidebar(); }} active={activeScreen === "FoodItems"} />
            <MenuButton title="Orders" onPress={() => { setActiveScreen("Orders"); toggleSidebar(); }} active={activeScreen === "Orders"} />
            <MenuButton title="Users" onPress={() => { setActiveScreen("Users"); toggleSidebar(); }} active={activeScreen === "Users"} />
            <MenuButton title="Admin Logs" onPress={() => { setActiveScreen("AdminLogs"); toggleSidebar(); }} active={activeScreen === "AdminLogs"} />
            <MenuButton title="Profile" onPress={() => { setActiveScreen("Profile"); toggleSidebar(); }} active={activeScreen === "Profile"} />
            <MenuButton title="Logout" onPress={() => {}} active={false} />
          </ScrollView>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        {/* Toggle Button */}
        <TouchableOpacity onPress={toggleSidebar} style={styles.toggleBtn}>
          <Text style={styles.toggleIcon}>{isSidebarVisible ? "✕" : "☰"}</Text>
        </TouchableOpacity>

        {renderScreen()}
      </View>
    </View>
  );
};

const MenuButton = ({ title, onPress, active }) => (
  <TouchableOpacity onPress={onPress} style={[styles.menuItem, active && styles.activeItem]}>
    <Text style={[styles.menuText, active && styles.activeText]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
  },
  sidebar: {
    width: 220,
    backgroundColor: "#333",
    padding: 10,
    height: "100%",
    zIndex: 2,
    position: "absolute",
    left: 0,
    top: 0,
  },
  heading: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  activeItem: {
    backgroundColor: "#555",
  },
  menuText: {
    color: "#ccc",
    fontSize: 16,
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
    marginLeft: 0,
  },
  toggleBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 5,
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  toggleIcon: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default AdminPanelLayout;
