import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ShoppingCart } from "lucide-react";
import MobileNav from "./mobilenav";
import { useSearch } from "../context/searchContext";
import { useAuth } from "../context/auth.context";

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { user } = useAuth();

  const navitems = [
    { name: "الرئيسية", link: "/" },
    { name: "العطور", link: "/perfumes" },
    { name: "الملابس", link: "/clothes" },
    { name: "الجوارب", link: "/socks" },
    { name: "احذيه", link: "/shoes" },
  ];

  return (
    <div>
      <nav className="justify-between items-center px-5 w-full fixed top-0 left-0 bg-white shadow-md z-10 hidden md:flex">

        {/* Logo */}
        <div>
          <img src={Logo} alt="logo" className="w-[150px]" />
        </div>

        {/* Nav Items */}
        <div className="flex justify-end items-center gap-5">
          {navitems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="text-gray-700 text-lg font-semibold hover:text-blue-600 transition-all duration-150"
            >
              {item.name}
            </Link>
          ))}

          {/* Admin Link */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-gray-700 text-lg font-semibold hover:text-blue-600 transition-all duration-150"
            >
              لوحة التحكم
            </Link>
          )}
        </div>

        {/* Search + Cart */}
        <div className="flex gap-4 items-center">
          <Link to="/cart">
            <ShoppingCart
              size={25}
              className="hover:text-blue-600 transition-all duration-150 cursor-pointer"
            />
          </Link>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن منتجك المفضل"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Auth Section */}
        <div className="flex gap-4 items-center">
          {!user ? (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="text-pink-500 px-4 py-2 text-lg font-semibold hover:text-pink-600"
              >
                تسجيل الدخول
              </Link>

              <Link
                to="/register"
                className="bg-pink-500 px-4 py-2 rounded-full text-lg font-semibold text-white hover:bg-pink-600"
              >
                إنشاء حساب
              </Link>
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              <Link
                to="/profile"
                className="text-pink-500 px-4 py-2 text-lg font-semibold hover:text-pink-600"
              >
                الملف الشخصي
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile */}
      <MobileNav />
    </div>
  );
}