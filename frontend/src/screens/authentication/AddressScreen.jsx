import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import API from "../../utils/api"; // axios instance with token

const AddressScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const initialForm = {
    house_block_no: "",
    area_road: "",
    city: "",
    district: "",
    state: "",
    country: "India",
    pincode: "",
  };

  const [form, setForm] = useState(initialForm);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/address");
      setAddresses(res.data);
    } catch (_err) {
      Alert.alert("Error", "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const validateForm = () => {
    const fields = ["house_block_no", "area_road", "city", "district", "state", "country", "pincode"];
    for (const field of fields) {
      if (!form[field].trim()) {
        Alert.alert("Validation Error", `Please enter ${field.replace("_", " ")}`);
        return false;
      }
    }
    return true;
  };

  const saveAddress = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (editingAddressId) {
        await API.put(`/auth/address/${editingAddressId}`, form);
      } else {
        await API.post("/auth/address", form);
      }

      setForm(initialForm);
      setEditingAddressId(null);
      setShowForm(false);
      await fetchAddresses();
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch (_err) {
      Alert.alert("Error", "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this address?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await API.delete(`/auth/address/${id}`);
            await fetchAddresses();
          } catch (_err) {
            Alert.alert("Error", "Failed to delete address");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const startEdit = (address) => {
    setForm(address);
    setEditingAddressId(address.id);
    setShowForm(true);
  };

  const renderForm = () => (
    <View style={styles.form}>
      {Object.keys(initialForm).map((field) => (
        <TextInput
          key={field}
          placeholder={field.replace("_", " ").toUpperCase()}
          style={styles.input}
          value={form[field]}
          onChangeText={(val) => handleInputChange(field, val)}
          keyboardType={field === "pincode" ? "numeric" : "default"}
        />
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={saveAddress}>
        <Text style={styles.saveButtonText}>{editingAddressId ? "Update" : "Save"} Address</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      {loading && (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
      <FlatList
        ref={listRef}
        data={addresses}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Your Addresses</Text>
            {!showForm && (
              <TouchableOpacity style={styles.addButton} onPress={() => { setShowForm(true); setForm(initialForm); setEditingAddressId(null); }}>
                <Text style={styles.addButtonText}>+ Add New Address</Text>
              </TouchableOpacity>
            )}
            {showForm && renderForm()}
            <Text style={styles.savedTitle}>Saved Addresses:</Text>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.addressItem, selectedAddressId === item.id && styles.selectedAddress]}
            onPress={() => setSelectedAddressId(item.id)}
          >
            <Text>{item.house_block_no}, {item.area_road}</Text>
            <Text>{item.city}, {item.district}</Text>
            <Text>{item.state}, {item.country} - {item.pincode}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => startEdit(item)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteAddress(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          selectedAddressId && (
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm and Proceed</Text>
            </TouchableOpacity>
          )
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50 },
  title: { fontSize: 24, fontWeight: "bold" },
  addButton: { marginTop: 10, backgroundColor: "#007bff", padding: 10, borderRadius: 6 },
  addButtonText: { color: "#fff", textAlign: "center" },
  savedTitle: { marginTop: 25, fontSize: 18, fontWeight: "bold" },
  form: { marginTop: 15, backgroundColor: "#f2f2f2", padding: 15, borderRadius: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 6, marginTop: 10 },
  saveButton: { marginTop: 15, backgroundColor: "green", padding: 10, borderRadius: 6 },
  saveButtonText: { color: "#fff", textAlign: "center" },
  addressItem: { padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginTop: 10 },
  selectedAddress: { backgroundColor: "#e6f7ff", borderColor: "#007bff" },
  confirmButton: { marginTop: 20, backgroundColor: "#28a745", padding: 12, borderRadius: 8 },
  confirmButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  editText: { color: "#007bff" },
  deleteText: { color: "red" },
  spinner: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)", justifyContent: "center", alignItems: "center", zIndex: 1
  }
});

export default AddressScreen;
