import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const updateCartItem = (item_code, delta) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item_code === item_code);
      if (existing) {
        const updated = prev
          .map((ci) =>
            ci.item_code === item_code
              ? { ...ci, quantity: ci.quantity + delta }
              : ci
          )
          .filter((ci) => ci.quantity > 0);
        return updated;
      } else if (delta > 0) {
        return [...prev, { item_code, quantity: delta }];
      }
      return prev;
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, updateCartItem, appliedCoupon, setAppliedCoupon }}
    >
      {children}
    </CartContext.Provider>
  );
};
