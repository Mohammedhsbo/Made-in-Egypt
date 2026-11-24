import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import Clothes from "./pages/clothes";
import NotFound from "./pages/not-found";
import Shoes from "./pages/shoes";
import Perfumes from "./pages/perfumes";
import ProductDetails from "./pages/productdetails";
import Socks from "./pages/socks";
import Layout from "./layout";
import CategoryProducts from "./pages/category-products";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./context/queryClient";
import { SearchContextProvider } from "./context/searchContext";
import { Toaster } from "@/components/ui/sonner";
import Admin from "./pages/admin/dashboard";
import Orders, { OrderDetailsPage } from "./pages/admin/order";
import AdminLayout from "./pages/admin/layout";
import Register from "./pages/user system/register";
import Login from "./pages/user system/login";
import ForgotPassword from "./pages/user system/forgot-password";
import VerifyOtp from "./pages/user system/verify-otp";
import VerifyEmail from "./pages/user system/verify-email";
import Profile from "./pages/user system/profile";
import MyOrders, { MyOrderDetailsPage } from "./pages/user system/userorders";
import { AuthProvider } from "./context/auth.context";
import AdminRoute from "./pages/admin/adminRoute";
import CreateProduct from "./pages/admin/createproduct";
import CreateCategory from "./pages/admin/createcategory";
import Mangenecategory from "./pages/admin/magnecategory";
import EditCategory from "./pages/admin/editcategory";
import Allcuppons from "./pages/admin/allcuppons";
import Creaatecuppons from "./pages/admin/createcuppon";
import Editcoupons from "./pages/admin/editcoupons";
import BrandsPage from "./pages/admin/managebrands";
import BrandFormPage from "./pages/admin/brand-form";
import HomepageOfferPage from "./pages/admin/homepage-offer";
import BrandProducts from "./pages/brand-products";
import { LanguageProvider } from "./context/language.context";
import WhatsAppSettings from "./pages/admin/whatsapp-settings";
import CustomerServicePage from "./pages/customer-service-page";



export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "clothes", element: <Clothes /> },
        { path: "shoes", element: <Shoes /> },
        { path: "perfumes", element: <Perfumes /> },
        { path: "productdetails/:id", element: <ProductDetails /> },
        { path: "socks", element: <Socks /> },
        { path: "categories/:id", element: <CategoryProducts /> },
        { path: "brands/:slug", element: <BrandProducts /> },
        { path: "customer-service/:page", element: <CustomerServicePage /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "verify-otp", element: <VerifyOtp /> },
        { path: "verify-email", element: <VerifyEmail /> },
        { path: "profile", element: <Profile /> },
        { path: "my-orders", element: <MyOrders /> },
        { path: "my-orders/:id", element: <MyOrderDetailsPage /> },
        {
          path: "/admin",
          element: (
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          ),

          children: [
            { index: true, element: <Admin /> },
            { path: "offer", element: <HomepageOfferPage /> },
            { path: "createproduct", element: <CreateProduct /> },
            {
              path: "editproduct/:id",
              element: <CreateProduct />,
            },
            { path: "managecategories", element: < Mangenecategory/> },
            { path: "managebrands", element: <BrandsPage /> },
            { path: "managebrands/create", element: <BrandFormPage /> },
            { path: "managebrands/:id/edit", element: <BrandFormPage /> },
            {path: "editcategory/:id", element: <EditCategory /> },
            {path:"createcategory", element: <CreateCategory />},
            { path: "orders", element: <Orders /> },
            { path: "orders/:id", element: <OrderDetailsPage /> },
            { path: "settings/whatsapp", element: <WhatsAppSettings /> },
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
    <LanguageProvider>
      <AuthProvider>
          <SearchContextProvider>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
              <Toaster />
            </QueryClientProvider>
          </SearchContextProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
