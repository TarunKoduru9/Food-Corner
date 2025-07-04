import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../../utils/CartContext";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BASE_URL,
  getCategories,
  logoutUser,
  getAllFoodItems,
} from "../../utils/api";
import { BlurView } from "expo-blur";
const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      await fetchUser();
      await fetchCategories();
      await fetchFoodItems();
    };
    initialize();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user?.name) {
          setUserName(user.name);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.log("Error parsing user:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoodItems = async () => {
    try {
      const res = await getAllFoodItems();
      setFoodItems(res);
    } catch (err) {
      console.error("Error fetching food items:", err);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    setDrawerVisible(false);
    navigation.replace("Login");
  };

  const { updateCartItem } = useContext(CartContext);
  const handleAddToCart = (item) => {
    updateCartItem(item.item_code, 1);
    navigation.navigate("Cartpage");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.logo}>RR Food Corner</Text>
        <TouchableOpacity onPress={() => setDrawerVisible(true)}>
          <Ionicons name="person-circle-outline" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent visible={drawerVisible}>
        <View style={styles.drawer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setDrawerVisible(false)}
          >
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>

          <View style={{ padding: 20 }}>
            <Text style={styles.drawerTitle}>
              {isLoggedIn ? `Welcome ${userName}` : "Welcome"}
            </Text>

            {!isLoggedIn ? (
              <TouchableOpacity
                onPress={() => {
                  setDrawerVisible(false);
                  navigation.navigate("Login");
                }}
              >
                <Text style={styles.loginBtn}>Login</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setDrawerVisible(false);
                    navigation.navigate("Profile");
                  }}
                >
                  <Text style={styles.drawerItem}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.logoutitem}>Logout</Text>
                </TouchableOpacity>
              </>
            )}

            <Text style={styles.drawerItem}>Orders</Text>
            <Text style={styles.drawerItem}>History</Text>
            <Text style={styles.drawerItem}>Terms</Text>
            <Text style={styles.drawerItem}>Feedback</Text>
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.secondheader}>
          <View style={styles.tag}>
            <TouchableOpacity>
              <Text style={styles.headtext}>Delivery</Text>
              <Text style={styles.headtext}>30Mins</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tag}>
            <TouchableOpacity>
              <Text style={styles.headtext}>Takeaway</Text>
              <Text style={styles.headtext}>Our Store</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subtitle}>What are you craving for?</Text>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.categoryContainer}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.category}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("CategoryItems", {
                    categoryId: item.id,
                    categoryName: item.category,
                  })
                }
              >
                <Image
                  source={{ uri: `${BASE_URL}${item.catimage_url}` }}
                  style={styles.image}
                />
                <Text style={styles.label}>{item.category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.subtitle}>What&apos;s New</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.foodScroll}
          contentContainerStyle={{ paddingRight: 20, paddingBottom: 20 }}
        >
          {foodItems
            .filter((item) =>
              ["FC19", "FC37", "FC45", "FC51", "FC58", "FC62", "FC71"].includes(
                item.item_code
              )
            )
            .map((item) => (
              <View key={item.id} style={styles.foodBlock}>
                <Image
                  source={{ uri: `${BASE_URL}${item.image_url}` }}
                  style={styles.foodGridImage}
                  resizeMode="cover"
                />

                <BlurView intensity={40} tint="dark" style={styles.foodcard}>
                  <Text style={styles.foodName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.foodPrice}>₹{item.price}</Text>
                  <Text style={styles.foodSubcontent}>
                    {[item.subcontent] || "Tasty treat"}
                  </Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </BlurView>
              </View>
            ))}
        </ScrollView>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === "web" ? 30 : 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
  },
  logo: { fontSize: 24, fontWeight: "bold" },

  drawer: {
    width: 300,
    height: "100%",
    backgroundColor: "#fff",
    position: "absolute",
    left: 0,
    top: 0,
    elevation: 10,
  },
  closeButton: { alignItems: "flex-end", padding: 10 },
  drawerTitle: { fontSize: 20, marginBottom: 10 },
  loginBtn: { color: "blue", marginBottom: 20 },
  drawerItem: { fontSize: 16, paddingVertical: 8 },
  logoutitem: {
    backgroundColor: "green",
    padding: 5,
    width: 100,
    textAlign: "center",
    color: "white",
    borderRadius: 3,
    marginTop: 10,
  },
  secondheader: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
  },
  tag: {
    backgroundColor: "#333",
    padding: 8,
    width: 140,
    borderRadius: 6,
  },
  headtext: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
  },
  subtitle: {
    margin: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
    gap: 20,
  },
  card: {
    width: 100,
    marginVertical: 10,
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  label: {
    marginTop: 6,
    fontSize: 14,
    textAlign: "center",
  },
  foodScroll: { marginTop: 10 },
  foodBlock: {
    width: screenWidth > 600 ? 400 : screenWidth - 40,
    marginHorizontal: 10,
    position: "relative",
  },
  foodGridImage: {
    width: "100%",
    height: screenWidth > 600 ? 400 : 370,
    borderRadius: 10,
  },
  foodcard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  foodName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  foodPrice: {
    fontSize: 13,
    color: "white",
    marginBottom: 2,
  },
  foodSubcontent: {
    fontSize: 12,
    color: "white",
    marginBottom: 6,
  },
  addButton: {
    backgroundColor: "#ff5a5f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: "white",
    fontSize: 12,
  },
});
