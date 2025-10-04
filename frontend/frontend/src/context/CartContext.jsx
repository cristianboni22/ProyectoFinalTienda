// src/context/CartContext.jsx
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, variant, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.variant?.id === variant?.id
      );
      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].cantidad = quantity; // reemplaza la cantidad
        return newCart;
      }
      return [...prev, { product, variant, cantidad: quantity }];
    });
  };

  const removeFromCart = (productId, variantId) => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && item.variant?.id === variantId)
    ));
  };

  const updateQuantity = (productId, variantId, cantidad) => {
    setCart(prev => prev.map(item =>
      item.product.id === productId && item.variant?.id === variantId
        ? { ...item, cantidad }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
