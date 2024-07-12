// CartContext.js
import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartLength, setCartLength] = useState(0);

  return (
    <CartContext.Provider value={{ cartLength, setCartLength }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
