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
import MyOrders from "./pages/user system/userorders";
import { AuthProvider } from "./context/auth.context";
import AdminRoute from "./pages/admin/adminRoute";
import CreateProduct from "./pages/admin/createproduct";
import CreateCategory from "./pages/admin/createcategory";
import Mangenecategory from "./pages/admin/magnecategory";
import EditCategory from "./pages/admin/editcategory";
import Allcuppons from "./pages/admin/allcuppons";
import Creaatecuppons from "./pages/admin/createcuppon";
import Editcoupons from "./pages/admin/editcoupons";



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
        { path: "my-orders", element: <MyOrders /> },
        {
          path: "/admin",
          element: (
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          ),

          children: [
            { index: true, element: <Admin /> },
            { path: "createproduct", element: <CreateProduct /> },
            {
              path: "editproduct/:id",
              element: <CreateProduct />,
            },
            { path: "managecategories", element: < Mangenecategory/> },
            {path: "editcategory/:id", element: <EditCategory /> },
            {path:"createcategory", element: <CreateCategory />},
            { path: "orders", element: <Orders /> },
            {path:"create-cuppons", element: <Creaatecuppons />},
            {
              path: "allcuppons",
              element: <Allcuppons />,
            }
            ,
            {
              path: "edit-cuppons/:id",
              element: <Editcoupons />,
            }
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
