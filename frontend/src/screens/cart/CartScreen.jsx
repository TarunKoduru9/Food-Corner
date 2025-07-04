import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL, getAllFoodItems, fetchMe } from "../../utils/api";
import { CartContext } from "../../utils/CartContext";
import { Ionicons } from "@expo/vector-icons";

const CartScreen = () => {
  const navigation = useNavigation();
  const { cart, updateCartItem, appliedCoupon } = useContext(CartContext);

  const [foodItems, setFoodItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getAllFoodItems().then(setFoodItems).catch(console.error);
    fetchMe()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const rawCartDetails = cart
    .map((ci) => {
      const item = foodItems.find((f) => f.item_code === ci.item_code);
      return item ? { ...item, quantity: ci.quantity } : null;
    })
    .filter(Boolean);

  const subtotal = rawCartDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isCouponValid = appliedCoupon && subtotal >= appliedCoupon.minAmount;

  const cartDetails = rawCartDetails.map((item) => {
    const itemTotal = item.price * item.quantity;
    const itemDiscount =
      isCouponValid && subtotal > 0
        ? (itemTotal / subtotal) * appliedCoupon.discount
        : 0;
    const discountedTotal = itemTotal - itemDiscount;
    const discountedUnitPrice = discountedTotal / item.quantity;

    return {
      ...item,
      discountedUnitPrice: parseFloat(discountedUnitPrice.toFixed(2)),
      discountedTotal: parseFloat(discountedTotal.toFixed(2)),
    };
  });

  const finalSubtotal = cartDetails.reduce(
    (sum, item) => sum + item.discountedTotal,
    0
  );

  const delivery = 40;
  const tax = +(finalSubtotal * 0.0925).toFixed(2);
  const total = (finalSubtotal + delivery + tax).toFixed(2);

  const lastCategory =
    cartDetails.length > 0
      ? cartDetails[cartDetails.length - 1].category
      : null;

  const exploreItems = foodItems.filter(
    (item) =>
      item.category === lastCategory &&
      !cart.find((ci) => ci.item_code === item.item_code)
  );

  const handleQtyChange = (item_code, delta, item) => {
    const currentItem = cart.find((ci) => ci.item_code === item_code);
    const currentQty = currentItem?.quantity || 0;

    updateCartItem(item_code, delta);

    if (delta === -1 && currentQty === 1 && cart.length === 1) {
      navigation.replace("CategoryItems", {
        categoryId: item.category_id,
        categoryName: item.category,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 10, flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {cartDetails.length} item(s) in Cart
        </Text>
        <Text style={styles.headerPrice}>You Pay: ₹{total}</Text>
      </View>

      {/* Cart Items */}
      <View>
        {cartDetails.map((item, idx) => (
          <View key={idx} style={styles.cartCard}>
            <Image
              source={{ uri: `${BASE_URL}${item.image_url}` }}
              style={styles.cartImage}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  onPress={() =>
                    handleQtyChange(item.item_code, -1, item)
                  }
                  style={styles.qtyBtn}
                >
                  <Text>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateCartItem(item.item_code, +1)}
                  style={styles.qtyBtn}
                >
                  <Text>+</Text>
                </TouchableOpacity>
                <Text style={styles.price}>
                  ₹{item.discountedTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Explore Section */}
      {exploreItems.length > 0 && (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore More</Text>
          </View>
          <FlatList
            data={exploreItems}
            horizontal
            keyExtractor={(i) => i.item_code}
            renderItem={({ item }) => (
              <View style={styles.exploreCard}>
                <Image
                  source={{ uri: `${BASE_URL}${item.image_url}` }}
                  style={styles.exploreImage}
                  resizeMode="cover"
                />
                <Text style={styles.exploreName}>{item.name}</Text>
                <Text style={styles.explorePrice}>₹{item.price}</Text>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => updateCartItem(item.item_code, 1)}
                >
                  <Text style={styles.addBtnText}>ADD</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {/* Coupon Section */}
      <View>
        <TouchableOpacity
          style={styles.couponBox}
          onPress={() => navigation.navigate("Coupons", { subtotal })}
        >
          <Text style={styles.couponText}>
            {isCouponValid
              ? `${appliedCoupon.code} Applied - ₹${appliedCoupon.discount} OFF`
              : "Apply Coupon"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Order Summary */}
      <View style={styles.orderStatusBox}>
        <View style={styles.orderadjust}>
          <Text style={styles.orderLabel}>Subtotal</Text>
          <Text style={styles.orderValue}>₹{finalSubtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.orderadjust}>
          <Text style={styles.orderLabel}>Discount</Text>
          <Text style={styles.orderValue}>
            − ₹{isCouponValid ? appliedCoupon.discount.toFixed(2) : "0.00"}
          </Text>
        </View>
        <View style={styles.orderadjust}>
          <Text style={styles.orderLabel}>Delivery Charges</Text>
          <Text style={styles.orderValue}>+ ₹{delivery.toFixed(2)}</Text>
        </View>
        <View style={styles.orderadjust}>
          <Text style={styles.orderLabel}>Taxes & Fees</Text>
          <Text style={styles.orderValue}>+ ₹{tax}</Text>
        </View>
        <View style={styles.orderTotal}>
          <Text style={styles.orderTotalLabel}>Total</Text>
          <Text style={styles.orderTotalValue}>₹{total}</Text>
        </View>
      </View>

      {/* Checkout/Login Button */}
      <View>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => {
            if (user) {
              navigation.navigate("Location");
            } else {
              navigation.navigate("Login");
            }
          }}
        >
          <Text style={styles.bottomButtonText}>
            {user ? "Set Location & Add Address" : "Login to place order"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { backgroundColor: "#f2f2f2", flex: 1 },
  header: {
    backgroundColor: "#16203bd5",
    padding: 8,
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  headerPrice: { color: "#fff", fontSize: 14 },
  editBtn: { color: "#fff", textDecorationLine: "underline" },

  cartCard: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
  },
  cartImage: { width: 80, height: 80, borderRadius: 8 },
  name: { fontWeight: "bold", fontSize: 16 },
  subcontent: { color: "#777", marginVertical: 4 },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  qtyBtn: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qtyText: { marginHorizontal: 10 },
  price: { fontWeight: "bold" },

  sectionHeader: { paddingHorizontal: 10, marginTop: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },

  exploreCard: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    width: 150,
  },
  exploreImage: { width: "100%", height: 90, borderRadius: 8 },
  exploreName: { marginTop: 5, fontWeight: "bold" },
  explorePrice: { color: "#555", marginBottom: 5 },
  addBtn: {
    backgroundColor: "#16203bd5",
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "bold" },

  couponBox: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  couponText: { fontWeight: "bold", color: "#007bff" },

  orderStatusBox: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  orderadjust: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderLabel: { fontSize: 14, color: "#555" },
  orderValue: { fontSize: 14, color: "#000", textAlign: "right" },
  orderTotal: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  orderTotalLabel: { fontSize: 16, fontWeight: "bold" },
  orderTotalValue: { fontSize: 16, fontWeight: "bold", color: "#d30000" },

  bottomButton: {
    backgroundColor: "#16203bd5",
    margin: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  bottomButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
