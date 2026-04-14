import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../api/axios.base";

const CartContext = createContext();

export function CartContextProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= GET CART =================
  const getCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.data.cart || []);
    } catch (err) {
      console.log(err);
      toast.error("فشل تحميل السلة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  // ================= ADD TO CART =================
  const addToCart = async (product) => {
    try {
      const res = await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      setCart(res.data.data.cart);
      toast.success("تم إضافة المنتج للسلة");
    } catch (err) {
      console.log(err);
      toast.error("فشل إضافة المنتج");
    }
  };

  // ================= UPDATE QUANTITY =================
  const updateQuantity = async (id, quantity) => {
  try {
    // منع النزول أقل من 1
    const safeQuantity = Math.max(1, quantity);

    const res = await api.put(`/cart/${id}`, {
      quantity: safeQuantity,
    });

    setCart(res.data.data.cart);
  } catch (err) {
    console.log(err);
    toast.error("فشل تحديث الكمية");
  }
};

  // ================= REMOVE =================
  const removeFromCart = async (id) => {
    try {
      const res = await api.delete(`/cart/${id}`);

      setCart(res.data.data.cart);
      toast.success("تم حذف المنتج");
    } catch (err) {
      console.log(err);
      toast.error("فشل الحذف");
    }
  };

  // ================= CLEAR =================
  const clearCart = async () => {
    try {
      await api.delete("/cart");

      setCart([]);
      toast.success("تم تفريغ السلة");
    } catch (err) {
      console.log(err);
      toast.error("فشل تفريغ السلة");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);