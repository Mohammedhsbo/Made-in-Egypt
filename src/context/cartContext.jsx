import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../api/axios.base";
import { useAuth } from "./auth.context";

const CartContext = createContext();
const GUEST_CART_STORAGE_KEY = "guest_cart";

function parseGuestCart() {
  try {
    const stored = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!stored) return { items: [] };

    const parsed = JSON.parse(stored);
    return {
      items: Array.isArray(parsed?.items) ? parsed.items : [],
    };
  } catch {
    return { items: [] };
  }
}

function saveGuestCart(cart) {
  localStorage.setItem(
    GUEST_CART_STORAGE_KEY,
    JSON.stringify({
      items: Array.isArray(cart?.items) ? cart.items : [],
    })
  );
}

function getProductIdFromItem(item) {
  return item?.product?._id || item?.product?.id || item?.productId;
}

export function CartContextProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isLoggedIn = Boolean(user && localStorage.getItem("token"));

  const mergeGuestCartIntoServerCart = useCallback(async () => {
    if (!isLoggedIn) return;

    const guestCart = parseGuestCart();
    if (!guestCart.items.length) return;

    try {
      const serverRes = await api.get("/cart");
      const serverCart = serverRes.data?.data?.cart || { items: [] };
      const serverItems = Array.isArray(serverCart.items) ? serverCart.items : [];

      const serverMap = new Map(
        serverItems.map((item) => [
          getProductIdFromItem(item),
          { cartItemId: item._id, quantity: item.quantity || 1 },
        ])
      );

      for (const guestItem of guestCart.items) {
        const productId = getProductIdFromItem(guestItem);
        if (!productId) continue;

        const guestQuantity = Math.max(1, guestItem.quantity || 1);
        const existing = serverMap.get(productId);

        try {
          if (existing?.cartItemId) {
            await api.put(`/cart/${existing.cartItemId}`, {
              quantity: existing.quantity + guestQuantity,
            });
          } else {
            await api.post("/cart", { productId, quantity: guestQuantity });
          }
        } catch (err) {
          // Skip invalid/expired products while keeping merge robust.
          console.log("Merge guest cart item failed:", err);
        }
      }

      saveGuestCart({ items: [] });
    } catch (err) {
      console.log("Merge guest cart failed:", err);
    }
  }, [isLoggedIn]);

  // ================= GET CART =================
  const getCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCart(parseGuestCart());
      setLoading(false);
      return;
    }

    try {
      await mergeGuestCartIntoServerCart();
      const res = await api.get("/cart");
      setCart(res.data.data.cart || { items: [] });
    } catch (err) {
      console.log(err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, mergeGuestCartIntoServerCart]);

  useEffect(() => {
    setLoading(true);
    getCart();
  }, [getCart]);

  // ================= ADD TO CART =================
  const addToCart = async (product) => {
    const requestedQuantity = Math.max(1, product?.selectedQuantity || 1);

    if (!isLoggedIn) {
      const current = parseGuestCart();
      const existingIndex = current.items.findIndex(
        (item) => (item.product?._id || item.product?.id) === product?._id
      );

      let nextItems = [...current.items];
      if (existingIndex !== -1) {
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: (nextItems[existingIndex].quantity || 1) + requestedQuantity,
        };
      } else {
        const price = product?.priceAfterDiscount || product?.basePrice || 0;
        nextItems.push({
          _id: `${product?._id}-${Date.now()}`,
          product,
          quantity: requestedQuantity,
          price,
        });
      }

      const nextCart = { ...current, items: nextItems };
      setCart(nextCart);
      saveGuestCart(nextCart);
      toast.success("تم إضافة المنتج للسلة");
      return;
    }

    try {
      const res = await api.post("/cart", {
        productId: product._id,
        quantity: requestedQuantity,
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
    // منع النزول أقل من 1
    const safeQuantity = Math.max(1, quantity);

    if (!isLoggedIn) {
      const current = parseGuestCart();
      const nextItems = current.items.map((item) =>
        item._id === id ? { ...item, quantity: safeQuantity } : item
      );

      const nextCart = { ...current, items: nextItems };
      setCart(nextCart);
      saveGuestCart(nextCart);
      return;
    }

    try {
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
    if (!isLoggedIn) {
      const current = parseGuestCart();
      const nextCart = {
        ...current,
        items: current.items.filter((item) => item._id !== id),
      };
      setCart(nextCart);
      saveGuestCart(nextCart);
      toast.success("تم حذف المنتج");
      return;
    }

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
    if (!isLoggedIn) {
      const emptyCart = { items: [] };
      setCart(emptyCart);
      saveGuestCart(emptyCart);
      toast.success("تم تفريغ السلة");
      return;
    }

    try {
      await api.delete("/cart");

      setCart({ items: [] });
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