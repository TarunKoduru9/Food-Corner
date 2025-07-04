import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.29.74:5000";

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (_err) {
      Alert.alert("Error", "Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();

      setImage({
        blob,
        uri: manipulatedImage.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });
    }
  };

  const resetForm = () => {
    setName("");
    setImage(null);
    setIsEdit(false);
    setEditingId(null);
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert("Validation", "Category name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);

    if (image?.blob) {
      formData.append("image", {
        uri: image.uri,
        name: image.name,
        type: image.type,
      });
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${BASE_URL}/admin/categories/${editingId}`
        : `${BASE_URL}/admin/categories`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Upload failed");
      }

      Alert.alert("Success", isEdit ? "Updated" : "Created");
      fetchCategories();
      resetForm();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const openEditModal = (item) => {
    setName(item.name);
    setImage({
      uri: BASE_URL + item.catimage_url,
      blob: null,
      name: "existing.jpg",
      type: "image/jpeg",
    });
    setEditingId(item.id);
    setIsEdit(true);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Alert.alert("Confirm", "Delete this category?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!res.ok) throw new Error("Delete failed");

            Alert.alert("Deleted", "Category deleted.");
            fetchCategories();
          } catch (err) {
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: BASE_URL + item.catimage_url }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
        <Text style={styles.btnText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
        <Text style={[styles.btnText, { color: "red" }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Categories</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
        <Text style={styles.addText}>+ Add Category</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{isEdit ? "Edit" : "Add"} Category</Text>
            <TextInput
              placeholder="Category Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TouchableOpacity onPress={pickImage} style={styles.pickBtn}>
              <Text style={styles.pickText}>{image ? "Change Image" : "Pick Image"}</Text>
            </TouchableOpacity>
            {image?.uri && <Image source={{ uri: image.uri }} style={styles.preview} />}
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={resetForm} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoriesScreen;

// styles same as before
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  list: { paddingBottom: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
  },
  image: { width: 50, height: 50, marginRight: 10, borderRadius: 5 },
  name: { flex: 1, fontSize: 16 },
  editBtn: { marginRight: 10 },
  deleteBtn: {},
  btnText: { color: "blue" },
  addBtn: {
    backgroundColor: "#0a84ff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  addText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  pickBtn: {
    backgroundColor: "#eee",
    padding: 10,
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 10,
  },
  pickText: { color: "#333" },
  preview: { width: 100, height: 100, resizeMode: "cover", marginBottom: 10 },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveBtn: {
    backgroundColor: "#0a84ff",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
  },
  saveText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  cancelText: { textAlign: "center", fontWeight: "bold" },
});
