import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string[];
  Variation?: {
    color: string;
    price: number;
  }[];
};

type CartItem = {
  product: Product;
  quantity: number;
  selectedVariation?: {
    color: string;
    price: number;
  };
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, selectedVariation?: { color: string; price: number }, quantity?: number) => void;
  removeFromCart: (productId: number, selectedVariation?: { color: string; price: number }) => void;
  clearCart: () => void;
  updateQuantity: (productId: number, amount: number, selectedVariation?: { color: string; price: number }) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (
    product: Product,
    selectedVariation?: { color: string; price: number },
    quantity: number = 1
  ) => {
    setCartItems(prev => {
      const existingItem = prev.find(
        item =>
          item.product.id === product.id &&
          item.selectedVariation?.color === selectedVariation?.color &&
          item.selectedVariation?.price === selectedVariation?.price
      );

      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id &&
          item.selectedVariation?.color === selectedVariation?.color &&
          item.selectedVariation?.price === selectedVariation?.price
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity, selectedVariation }];
      }
    });
  };

  const removeFromCart = (
    productId: number,
    selectedVariation?: { color: string; price: number }
  ) => {
    setCartItems(prev =>
      prev.filter(
        item =>
          !(
            item.product.id === productId &&
            item.selectedVariation?.color === selectedVariation?.color
          )
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const updateQuantity = (
    productId: number,
    amount: number,
    selectedVariation?: { color: string; price: number }
  ) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.product.id === productId &&
          item.selectedVariation?.color === selectedVariation?.color
            ? { ...item, quantity: Math.max(1, item.quantity + amount) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
