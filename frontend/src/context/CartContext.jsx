import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState('normal');

  useEffect(() => {
    const saved = localStorage.getItem('reptro_cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reptro_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, variant, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product._id && item.variant === variant.size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, {
        productId: product._id,
        name: product.name,
        image: product.image,
        variant: variant.size,
        price: variant.price,
        originalPrice: variant.originalPrice,
        quantity,
        shopOwner: product.shopOwner
      }];
    });
  };

  const removeFromCart = (productId, variant) => {
    setCartItems(prev => prev.filter(
      item => !(item.productId === productId && item.variant === variant)
    ));
  };

  const updateQuantity = (productId, variant, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCartItems(prev => prev.map(item =>
      item.productId === productId && item.variant === variant
        ? { ...item, quantity }
        : item
    ));
  };

  const getItemQuantity = (productId, variant) => {
    const item = cartItems.find(
      i => i.productId === productId && i.variant === variant
    );
    return item ? item.quantity : 0;
  };

  const getTotalItems = () => cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const getSubtotal = () => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('reptro_cart');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getItemQuantity,
      getTotalItems,
      getSubtotal,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      deliveryType,
      setDeliveryType
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);