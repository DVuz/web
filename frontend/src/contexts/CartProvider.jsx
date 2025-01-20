import React, { createContext, useContext, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user?.accessToken) {
      setCartItems([]);
      setCartCount(0);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        'https://192.168.0.102:3000/api/carts/user',
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setCartItems(data.cartItems);
        setCartCount(data.cartItems.length);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user?.accessToken) {
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      const response = await fetch('https://192.168.0.102:3000/api/carts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity,
          user_id: user.decodedToken.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCart(); // Refresh cart data
        return { success: true, message: 'Item added to cart' };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { success: false, message: 'Failed to add item to cart' };
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return { success: false, message: 'Invalid quantity' };

    try {
      const response = await fetch(
        `https://192.168.0.102:3000/api/carts/${cartId}/quantity`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (response.ok) {
        await fetchCart(); // Refresh cart data
        return { success: true, message: 'Quantity updated' };
      }
      return { success: false, message: 'Failed to update quantity' };
    } catch (error) {
      console.error('Failed to update quantity:', error);
      return { success: false, message: 'Failed to update quantity' };
    }
  };

  const removeItem = async (cartId) => {
    try {
      const response = await fetch(
        `https://192.168.0.102:3000/api/carts/${cartId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      if (response.ok) {
        await fetchCart(); // Refresh cart data
        return { success: true, message: 'Item removed from cart' };
      }
      return { success: false, message: 'Failed to remove item' };
    } catch (error) {
      console.error('Failed to remove item:', error);
      return { success: false, message: 'Failed to remove item' };
    }
  };

  // Fetch cart data when user auth status changes
  useEffect(() => {
    fetchCart();
  }, [user]);

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
