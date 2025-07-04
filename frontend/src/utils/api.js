import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "http://192.168.29.74:5000";

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchMe = () => API.get("/auth/me").then((res) => res.data);

export const updateField = (field, value) =>
  API.patch("/auth/update", { [field]: value }).then((res) => res.data);

export const getAllFoodItems = () =>
  API.get("/auth/").then((res) => {
    if (Array.isArray(res.data)) {
      return res.data;
    } else {
      console.error("Unexpected food data format:", res.data);
      return [];
    }
  });
export const getItemsByCategory = (categoryId) =>
  API.get(`/auth/category/${categoryId}/items`).then((res) => res.data);

export const getCategories = () =>
  API.get("/auth/categories").then((res) => res.data);

export const logoutUser = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};

export default API;
