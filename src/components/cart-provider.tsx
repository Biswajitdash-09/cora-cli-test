"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { CART_STORAGE_KEY, getCartCount, getCartSubtotal, parseStoredCart, type CartItem, type Product } from "@/lib/product-types";

type CartContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function getStoredCartItems() {
  if (typeof window === "undefined") {
    return [];
  }

  const parsedCart = parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));

  if (parsedCart === null) {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }

  return parsedCart;
}

function CartProviderState({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(getStoredCartItems);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== CART_STORAGE_KEY) {
        return;
      }

      setCartItems(getStoredCartItems());
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const cartCount = useMemo(() => getCartCount(cartItems), [cartItems]);
  const cartTotal = useMemo(() => getCartSubtotal(cartItems), [cartItems]);

  const value = useMemo(
    () => ({ cartItems, cartCount, cartTotal, addToCart, updateQuantity, clearCart }),
    [cartItems, cartCount, cartTotal, addToCart, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function CartProvider({ children }: { children: ReactNode }) {
  return <CartProviderState>{children}</CartProviderState>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
