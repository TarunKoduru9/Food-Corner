import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { fetchMe, updateField } from "../../../utils/api";

const ProfileScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [editMode, setEditMode] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchMe();

        const userData = {
          name: data.name ?? "",
          email: data.email ?? "",
          mobile: data.mobile ? String(data.mobile) : "",
          password: "",
        };
        setFormData(userData);
        setOriginalData(userData);
      } catch (err) {
        console.error("Fetch error:", err);
        Alert.alert("Error", "Please login again.");
        navigation.replace("Login");
      }
    };

    loadUser();
  }, []);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleEdit = (field) =>
    setEditMode((prev) => ({ ...prev, [field]: true }));

  const handleCancel = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: originalData[field] ?? "",
    }));
    setEditMode((prev) => ({ ...prev, [field]: false }));
  };

  const handleUpdate = async (field) => {
    setLoading(true);
    try {
      const result = await updateField(field, formData[field]);
      Alert.alert("Success", result.message || "Updated");
      setOriginalData((prev) => ({ ...prev, [field]: formData[field] }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
    } catch (err) {
      console.error("Update error:", err);
      Alert.alert("Failed", err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, field, secure = false) => (
    <View style={styles.inputWrapper} key={field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={String(formData[field] ?? "")}
        onChangeText={(val) => handleChange(field, val)}
        secureTextEntry={secure}
        editable={editMode[field]}
        style={styles.input}
      />
      {!editMode[field] ? (
        <TouchableOpacity onPress={() => toggleEdit(field)} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => handleUpdate(field)}
            style={styles.updateButton}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Updating..." : "Update"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCancel(field)} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      {renderField("Full Name", "name")}
      {renderField("Email", "email")}
      {renderField("Mobile", "mobile")}
      {renderField("Password", "password", true)}
      {loading && <ActivityIndicator size="small" color="#000" />}
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff", flexGrow: 1 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  inputWrapper: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  label: { fontSize: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  editButton: {
    marginTop: 8,
    backgroundColor: "#2980b9",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  updateButton: {
    flex: 1,
    backgroundColor: "#16203bd5",
    padding: 10,
    borderRadius: 6,
    marginRight: 5,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 6,
    marginLeft: 5,
    alignItems: "center",
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
