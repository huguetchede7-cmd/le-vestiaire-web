import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('client_cart');
    return stored ? JSON.parse(stored) : [];
  });

  const saveItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem('client_cart', JSON.stringify(newItems));
  };

  const addItem = (item) => {
    // Chaque item du panier est unique par sa combinaison variante + personnalisation
    const newItems = [...items, { ...item, cartId: Date.now() + Math.random() }];
    saveItems(newItems);
  };

  const removeItem = (cartId) => {
    saveItems(items.filter((i) => i.cartId !== cartId));
  };

  const updateQuantite = (cartId, quantite) => {
    saveItems(
      items.map((i) => (i.cartId === cartId ? { ...i, quantite } : i))
    );
  };

  const clearCart = () => {
    saveItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.prixUnitaire * item.quantite, 0);
  const nombreArticles = items.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantite, clearCart, total, nombreArticles }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}