import React from "react";
import Logo from "../assets/logo.png";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogIn, UserPlus, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export default function MobileNav({ navitems }) {
  const { user } = useAuth();
  
  return (
    <Sheet>
      {/* Trigger */}
      <SheetTrigger asChild>
        <button className="p-2 -mr-2 text-gray-700 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg">
          <Menu size={28} />
        </button>
      </SheetTrigger>

      {/* Sheet Content */}
      <SheetContent side="right" className="flex flex-col p-6 w-[80vw] sm:w-[350px]">
        {/* Header for accessibility */}
        <SheetHeader className="text-right">
          <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
          <SheetDescription className="sr-only">أقسام المتجر وحسابك</SheetDescription>
        </SheetHeader>

        {/* Logo */}
        <div className="flex justify-center border-b pb-6 mb-6">
          <img src={Logo} alt="شعار الموقع" className="h-12 object-contain" />
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          {navitems?.map((item, index) => (
            <SheetTrigger asChild key={index}>
              <Link
                to={item.link}
                className="text-gray-800 text-[17px] font-medium hover:text-primary hover:bg-gray-50 rounded-lg p-3 transition-colors text-right"
              >
                {item.name}
              </Link>
            </SheetTrigger>
          ))}
          {user?.role === "admin" && (
            <SheetTrigger asChild>
              <Link
                to="/admin"
                className="text-primary font-bold hover:text-primary/80 hover:bg-primary/5 rounded-lg p-3 transition-colors text-right"
              >
                لوحة التحكم
              </Link>
            </SheetTrigger>
          )}
        </div>

        {/* Auth Section for Mobile */}
        <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-3">
          {!user ? (
            <>
              <SheetTrigger asChild>
                <Link to="/login" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                  <LogIn size={20} />
                  تسجيل الدخول
                </Link>
              </SheetTrigger>
              <SheetTrigger asChild>
                <Link to="/register" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                  <UserPlus size={20} />
                  حساب جديد
                </Link>
              </SheetTrigger>
            </>
          ) : (
             <SheetTrigger asChild>
                <Link to="/profile" className="flex items-center gap-3 w-full py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold transition-colors border border-gray-100">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <User size={20} />
                  </div>
                  الملف الشخصي
                </Link>
              </SheetTrigger>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
