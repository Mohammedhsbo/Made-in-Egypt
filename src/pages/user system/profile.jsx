import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import api from "../../api/axios.base";
import { Button } from "@/components/ui/button";
import { User, LogOut, Mail, Clock, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data.user);
      } catch (err) {
        console.log(err);
        setError("فشل تحميل بيانات المستخدم، يرجى تسجيل الدخول مجدداً");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-[60vh] justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-500 font-semibold text-lg">جاري تحميل بيانات حسابك...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] justify-center items-center p-6">
        <div className="bg-red-50 text-red-600 px-8 py-6 rounded-2xl border border-red-100 font-bold text-center max-w-md shadow-sm">
          {error}
          <div className="mt-6">
            <Button onClick={handleLogout} variant="destructive" className="w-full rounded-xl">
              تسجيل الخروج والعودة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 md:p-8">
      
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Cover Background */}
        <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-800 w-full relative">
           <div className="absolute -bottom-12 right-8 flex items-center gap-4">
              <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-lg flex-shrink-0">
                 <div className="w-full h-full bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-4xl">
                   {user?.name?.charAt(0)?.toUpperCase() || <User size={40} />}
                 </div>
              </div>
           </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-100 pb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">{user?.name}</h2>
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Mail size={16} />
                <span dir="ltr">{user?.email}</span>
              </div>
            </div>
           <div className="flex items-center gap-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 rounded-xl h-12 px-6 gap-2 font-bold shadow-sm"
              >
                <LogOut size={18} />
                تسجيل الخروج
              </Button>
              <Button
                asChild
                variant="default"
                className=" border-primary hover:bg-primary/60 rounded-xl h-12 px-6 gap-2 font-bold shadow-sm"
              >
                <Link to="/my-orders">
                  <ShoppingBag size={18} />
                  تتبع الأوردرات
                </Link>
              </Button>
              
           </div>
          </div>

          {/* User Details Grid */}
          <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
            <User size={22} className="text-primary" />
            بيانات الحساب الأساسية
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-sm text-gray-500">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold mb-1">الاسم بالكامل</p>
                <p className="font-bold text-gray-800 text-lg">{user?.name}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-sm text-gray-500">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold mb-1">البريد الإلكتروني</p>
                <p className="font-bold text-gray-800 text-lg" dir="ltr">{user?.email}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-sm text-gray-500">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold mb-1">تاريخ الانضمام</p>
                <p className="font-bold text-gray-800 text-lg">
                   {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : 'عضو مسجل'}
                </p>
              </div>
            </div>

            <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-sm text-primary">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-sm text-primary font-semibold mb-1">حالة الحساب</p>
                <p className="font-bold text-slate-800 text-lg">نشط وجاهز للتسوق</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}