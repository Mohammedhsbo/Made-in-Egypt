import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ShoppingCart, Search, User } from "lucide-react";
import MobileNav from "./mobilenav";
import { useSearch } from "../context/searchContext";
import { useAuth } from "../context/auth.context";
import { useCart } from "../context/cartContext";
import { Button } from "@/components/ui/button";
import { MAIN_NAV_ITEMS } from "@/constants/navigation";


export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { user } = useAuth();
  const { cart } = useCart();
  
 const cartItemsCount = cart?.items?.reduce(
  (acc, item) => acc + item.quantity,
  0
) || 0;

  return (
    <header className="fixed top-0 left-0 z-[var(--z-header)] w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-[70px] lg:h-[120px] flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Mobile Nav Toggle */}
        <div className="lg:hidden flex flex-1 items-center">
           <MobileNav navitems={MAIN_NAV_ITEMS} />
        </div>

        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center justify-center lg:justify-start flex-1 lg:flex-none">
          <img src={Logo} alt="logo" className="h-[56px] lg:h-[78px] object-contain py-2" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {MAIN_NAV_ITEMS.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="text-gray-700 font-medium hover:text-primary transition-colors text-[17px] relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-primary font-bold hover:text-primary/80 transition-colors text-[17px] bg-primary/10 px-3 py-1 rounded-md"
            >
              لوحة التحكم
            </Link>
          )}
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md relative group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن منتجك المفضل..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-5 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-white transition-all text-gray-800"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
        </div>

        {/* Actions (Cart & Auth) */}
        <div className="flex items-center gap-3 lg:gap-5 shrink-0 justify-end flex-1 lg:flex-none">
          <div className="hidden sm:flex items-center gap-2 border-l border-gray-200 pl-3 lg:pl-5 ml-1 lg:ml-2">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="font-semibold text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors">
                    دخول
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="font-semibold rounded-full shadow-sm hover:shadow text-white bg-primary transition-all">
                    حساب جديد
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-full transition-colors border border-transparent hover:border-gray-100">
                <div className="h-9 w-9 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
                </div>
                <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate hidden xl:block">
                  {user?.name?.split(" ")[0]}
                </span>
              </Link>
            )}
          </div>

          <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-full transition-colors flex items-center justify-center">
            <ShoppingCart size={26} className="text-gray-700" />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 lg:top-[-2px] lg:right-[-2px] bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                {cartItemsCount > 99 ? "99+" : cartItemsCount}
              </span>
            )}
          </Link>
          
        </div>
      </div>

      {/* Mobile Search - shown below header on mobile */}
      <div className="lg:hidden px-4 pb-3 bg-white/95 transition-all">
         <div className="relative group shadow-sm rounded-full overflow-hidden">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن منتجك المفضل..."
            className="w-full bg-gray-50 border border-gray-200 pl-5 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-[15px]"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 focus-within:text-primary" size={18} />
        </div>
      </div>
    </header>
  );
}