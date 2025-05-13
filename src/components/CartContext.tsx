// context/CartAndSpinnerContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { FaSpinner, FaCheckCircle, FaTimes, FaExclamationCircle } from "react-icons/fa";

// ------------------ Spinner Context Types & Setup ------------------

type SpinnerType = "loading" | "success" | "error" | "info";

type SpinnerState = {
  visible: boolean;
  type: SpinnerType;
  message: string;
};

type SpinnerContextType = {
  showSpinner: (type: SpinnerType, message: string) => void;
  hideSpinner: () => void;
};

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

// ------------------ Cart Context Types & Setup ------------------

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
  addToCart: (
    product: Product,
    selectedVariation?: { color: string; price: number },
    quantity?: number,
  ) => void;
    addToCartFromHome: (product: Product) => void; // ✅ Added this
  removeFromCart: (
    productId: number,
    selectedVariation?: { color: string; price: number }
  ) => void;
  clearCart: () => void;
  updateQuantity: (
    productId: number,
    amount: number,
    selectedVariation?: { color: string; price: number }
  ) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// ------------------ Provider: Cart + Spinner Together ------------------

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [spinner, setSpinner] = useState<SpinnerState>({
    visible: false,
    type: "info",
    message: "",
  });

  const showSpinner = (type: SpinnerType, message: string) => {
    setSpinner({ visible: true, type, message });
    setTimeout(() => setSpinner(s => ({ ...s, visible: false })), 500);
  };

  const hideSpinner = () => setSpinner(s => ({ ...s, visible: false }));

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
        showSpinner("info", "Updated quantity in cart");
        return prev.map(item =>
          item.product.id === product.id &&
          item.selectedVariation?.color === selectedVariation?.color &&
          item.selectedVariation?.price === selectedVariation?.price
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        showSpinner("success", "Added to cart");
        return [...prev, { product, quantity, selectedVariation }];
      }
    });
  };

  const addToCartFromHome = (product: Product) => {
  const defaultVariation = { color: "black", price: product.price };

  addToCart(product, defaultVariation, 1);
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
    showSpinner("error", "Removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
    showSpinner("info", "Cart cleared");
  };

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
    // showSpinner("info", "Updated quantity");
  };

  return (
    <SpinnerContext.Provider value={{ showSpinner, hideSpinner }}>
      <CartContext.Provider
        value={{
          cartItems,
          addToCart,
          addToCartFromHome,
          removeFromCart,
          clearCart,
          updateQuantity,
        }}
      >
        {children}
        {spinner.visible && <SpinnerMessage type={spinner.type} message={spinner.message} />}
      </CartContext.Provider>
    </SpinnerContext.Provider>
  );
};

// ------------------ Spinner Message Component ------------------

const iconMap = {
  loading: <FaSpinner className="animate-spin text-blue-500" />,
  success: <FaCheckCircle className="text-green-500" />,
  error: <FaTimes className="text-red-500" />,
  info: <FaExclamationCircle className="text-yellow-500" />,
};

const bgIcon = {
  loading: "bg-blue-100",
  success: "bg-green-100",
  error: "bg-red-100",
  info: "bg-yellow-100"
};

const bgBorder = {
  loading: "border-blue-500",
  success: "border-green-500",
  error: "border-red-500",
  info: "border-yellow-500"
};

const SpinnerMessage = ({ type, message }: { type: SpinnerType; message: string }) => (
  <div className="fixed top-4 right-4 z-[9999]">
    <div className ={`flex items-center space-x-2 border ${bgIcon[type]} ${bgBorder[type]} rounded-md shadow-lg px-4 py-2 lg:w-[250px]`}>
      {iconMap[type]}
      <span className="text-gray-800 text-sm flex-1">{message}</span>
    </div>
  </div>
);

// ------------------ Custom Hooks ------------------

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within AppProvider");
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSpinner = () => {
  const context = useContext(SpinnerContext);
  if (!context) throw new Error("useSpinner must be used within AppProvider");
  return context;
};
