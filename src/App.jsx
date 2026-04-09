import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cart from "./pages/cart";
import Home from "./pages/home";
import Checkout from "./pages/checkout";
import Clothes from "./pages/clothes";
import NotFound from "./pages/not-found";
import Shoes from "./pages/shoes";
import Perfumes from "./pages/perfumes";
import ProductDetails from "./pages/productdetails";
import Socks from "./pages/socks";
import Layout from "./layout";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./context/queryClient";
import { SearchContextProvider } from "./context/searchContext";
import { CartContextProvider } from "./context/cartContext";
import { Toaster } from "@/components/ui/sonner";
import Admin from "./pages/admin/dashboard";
import Orders from "./pages/admin/order";
import AdminLayout from "./pages/admin/layout";
import Register from "./pages/user system/register";
import Login from "./pages/user system/login";
import Profile from "./pages/user system/profile";
import { AuthProvider } from "./context/auth.context";
import AdminRoute from "./pages/admin/adminRoute";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "cart", element: <Cart /> },
        { path: "checkout", element: <Checkout /> },
        { path: "clothes", element: <Clothes /> },
        { path: "shoes", element: <Shoes /> },
        { path: "perfumes", element: <Perfumes /> },
        { path: "productdetails/:id", element: <ProductDetails /> },
        { path: "socks", element: <Socks /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "profile", element: <Profile /> },
        {
          path: "/admin",
          element: (
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          ),

          children: [
            { index: true, element: <Admin /> },
            { path: "orders", element: <Orders /> },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <AuthProvider>
      <CartContextProvider>
        <SearchContextProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster />
          </QueryClientProvider>
        </SearchContextProvider>
      </CartContextProvider>
    </AuthProvider>
  );
}
