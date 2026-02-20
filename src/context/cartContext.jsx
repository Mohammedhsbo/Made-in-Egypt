import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
const CartContext = createContext();

export function CartContextProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);

      if (exist) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
    if (cart) {
      toast.success("تم اضافة المنتج الى السلة");
    } else {
      toast.error("لم يتم اضافة المنتج الى السلة");
    }
  };
  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: quantity < 0 ? 0 : quantity }
          : item,
      ),
    );
  };
  const removeFromCart = (id) => {
    setCart([...cart.filter((item) => item.id !== id)]);
  };
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);
