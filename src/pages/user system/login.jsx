import React, { useState } from "react";
import { loginSchema } from "../../../utils/schmea.validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../api/axios.base";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Lock, LogIn, Store } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("token", res.data.token);
     
      toast.success(res.data.message || "تم تسجيل الدخول بنجاح!");
       

      window.location.href = "/";
    } catch (err) {
      if (err.response?.status === 401) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        setError("حدث خطأ أثناء تسجيل الدخول");
        toast.error("حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-gray-100">
        
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
             <Store size={36} />
          </div>
          <h2 className="mt-2 text-3xl font-black text-gray-900">
            أهلاً بك مجدداً
          </h2>
          <p className="mt-3 text-sm text-gray-500 font-medium">
            سجل دخولك لمتابعة التسوق وإدارة طلباتك
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Email */}
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Mail size={20} />
              </div>
              <input
                placeholder="البريد الإلكتروني"
                {...register("email")}
                className={`block w-full pr-12 pl-4 py-3.5 bg-gray-50 border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                dir="auto"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 px-2">{errors.email.message}</p>}

            {/* Password */}
            <div className="relative group">
               <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                placeholder="كلمة المرور"
                {...register("password")}
                className={`block w-full pr-12 pl-4 py-3.5 bg-gray-50 border ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                dir="ltr"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 px-2">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                نسيت كلمة المرور؟
              </a>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-3 text-sm text-center font-semibold">
              {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-6 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 shadow-lg transition-all disabled:opacity-70 gap-3"
            >
              {loading ? (
                 "جاري التحقق..."
              ) : (
                <>
                  <LogIn size={22} className="group-hover:-translate-x-1 transition-transform" />
                  تسجيل الدخول
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">ليس لديك حساب؟</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-primary font-bold text-lg hover:underline transition-all">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
