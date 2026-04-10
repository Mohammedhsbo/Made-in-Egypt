import React from "react";
import api from "./../../api/axios.base";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../../utils/schmea.validation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, UserPlus, Store } from "lucide-react";

export default function Register() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success(res.data.message || "تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.");
      reset();
      window.location.href = "/login";
    } catch (err) {
      if (err.response?.status === 500) {
        toast.error("البريد الإلكتروني مستخدم بالفعل، يرجى استخدام بريد آخر.");
        setError("البريد الإلكتروني مستخدم بالفعل، يرجى استخدام بريد آخر.");
      } else {
        toast.error("حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى.");
        setError("حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى.");
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
             <UserPlus size={36} />
          </div>
          <h2 className="mt-2 text-3xl font-black text-gray-900">
            إنشاء حساب جديد
          </h2>
          <p className="mt-3 text-sm text-gray-500 font-medium">
            انضم إلينا الآن واستمتع بأفضل عروض التسوق
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            
            {/* Name */}
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <User size={20} />
              </div>
              <input
                placeholder="الاسم بالكامل"
                {...register("name")}
                className={`block w-full pr-12 pl-4 py-3.5 bg-gray-50 border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                dir="auto"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 px-2">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Mail size={20} />
              </div>
              <input
                placeholder="البريد الإلكتروني"
                {...register("email")}
                className={`block w-full pr-12 pl-4 py-3.5 bg-gray-50 border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                dir="ltr"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 px-2">{errors.email.message}</p>}
            </div>

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
              {errors.password && <p className="text-red-500 text-xs mt-1 px-2">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                placeholder="تأكيد كلمة المرور"
                {...register("confirmPassword")}
                className={`block w-full pr-12 pl-4 py-3.5 bg-gray-50 border ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                dir="ltr"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 px-2">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-3 text-sm text-center font-semibold">
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-6 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-70 gap-3"
            >
              {loading ? (
                 "جاري الإنشاء..."
              ) : (
                <>
                  <UserPlus size={22} className="group-hover:-translate-x-1 transition-transform" />
                  إنشاء حساب
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
              <span className="px-4 bg-white text-gray-500 font-medium">لديك حساب بالفعل؟</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-slate-900 font-bold text-lg hover:underline transition-all">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
