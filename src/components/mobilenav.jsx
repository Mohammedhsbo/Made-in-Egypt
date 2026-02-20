import React from "react";
import Logo from "../assets/logo.png";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function mobilenav() {
  const navitems = [
    { name: "الرئيسية", link: "/" },
    { name: "العطور", link: "/perfumes" },
    { name: "الملابس", link: "/clothes" },
    { name: "الجوارب", link: "/socks" },
    { name: "احذيه", link: "/shoes" },
  ];
  return (
    <nav className="flex justify-between items-center px-5 w-full fixed top-0 left-0 bg-white shadow-md z-10 md:hidden">
      <Sheet className="flex flex-col justify-center items-center">
        {/* Trigger */}
        <SheetTrigger asChild>
          <button>
            <Menu
              size={25}
              className="hover:text-blue-600 transition-all duration-150 cursor-pointer"
            />
          </button>
        </SheetTrigger>

        {/* Sheet Content */}
        <SheetContent side="right" className="flex flex-col items-center">
          {/* Header for accessibility */}
          <SheetHeader>
            <SheetTitle>
              {/* Title visible only to screen readers */}
              <span className="sr-only">القائمة الرئيسية</span>
            </SheetTitle>
            <SheetDescription>
              <span className="sr-only">اختر القسم الذي ترغب في تصفحه</span>
            </SheetDescription>
          </SheetHeader>

          {/* Logo */}
          <div >
            <img src={Logo} alt="شعار الموقع" className="w-[200px]" />
          </div>

          {/* Links */}
          <div className="mt-10 flex flex-col items-center gap-5 w-full">
            {navitems.map((item, index) => (
              <SheetTrigger asChild key={index}>
                <Link
                  to={item.link}
                  className="text-gray-700 text-lg font-semibold hover:text-blue-600 transition-all duration-150 py-3 border-b w-full text-center"
                >
                  {item.name}
                </Link>
              </SheetTrigger>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <div>
        <img src={Logo} alt="logo image" className="w-[150px]   " />
      </div>
      <div className="flex gap-4 items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="ابحث عن منتجك المفضل"
            className="w-[20px] h-8 border border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
        <ShoppingCart
          size={25}
          className=" hover:text-blue-600 transition-all duration-150 cursor-pointer"
        />
      </div>
    </nav>
  );
}
