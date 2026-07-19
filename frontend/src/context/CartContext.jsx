import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'library_borrow_cart';

const readCart = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(stored)
      ? stored.map((item) => ({ ...item, action: item.action || 'BORROW' }))
      : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (book, action) => {
      if (!book || book.availableCopies <= 0) return false;
      if (items.some((item) => item.id === book.id && item.action === action)) return false;

      setItems((current) => [
        ...current,
        {
          id: book.id,
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl,
          availableCopies: book.availableCopies,
          price: book.price,
          action,
        },
      ]);
      return true;
    },
    [items],
  );

  const addBook = useCallback((book) => addItem(book, 'BORROW'), [addItem]);
  const addPurchase = useCallback((book) => addItem(book, 'BUY'), [addItem]);

  const removeBook = useCallback((bookId, action) => {
    setItems((current) => current.filter((item) => !(item.id === bookId && (!action || item.action === action))));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (bookId, action = 'BORROW') => items.some((item) => item.id === bookId && item.action === action),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      addBook,
      addPurchase,
      removeBook,
      clearCart,
      isInCart,
    }),
    [addBook, addPurchase, clearCart, isInCart, items, removeBook],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
