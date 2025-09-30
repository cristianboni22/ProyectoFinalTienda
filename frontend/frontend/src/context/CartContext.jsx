// src/context/CartContext.jsx
import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product, variant, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.variant?.id === variant?.id
      );
      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].cantidad += quantity;
        return newCart;
      }
      return [...prev, { product, variant, cantidad: quantity }];
    });
  };

  const removeFromCart = (productId, variantId) => {
    setCart(prev =>
      prev.filter(
        item => !(item.product.id === productId && item.variant?.id === variantId)
      )
    );
  };

  const updateQuantity = (productId, variantId, cantidad) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.variant?.id === variantId
          ? { ...item, cantidad }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}
