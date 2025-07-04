import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../../utils/CartContext";
import { COUPONS } from "../../utils/coupons";

const CouponScreen = ({ route }) => {
  const { subtotal } = route.params;
  const { setAppliedCoupon } = useContext(CartContext);
  const navigation = useNavigation();

  return (
    <View>
      <FlatList
        data={Object.entries(COUPONS)}
        keyExtractor={([code]) => code}
        renderItem={({ item: [code, coupon] }) => {
          const isEligible = subtotal >= coupon.minAmount;
          return (
            <TouchableOpacity
              style={[styles.card, { opacity: isEligible ? 1 : 0.5 }]}
              disabled={!isEligible}
              onPress={() => {
                setAppliedCoupon({ code, ...coupon });
                navigation.goBack();
              }}
            >
              <Text style={styles.code}>{code}</Text>
              <Text style={styles.details}>
                Save ₹{coupon.discount} on orders over ₹{coupon.minAmount}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  code: {
    fontWeight: "bold",
    fontSize: 16,
  },
  details: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default CouponScreen;
