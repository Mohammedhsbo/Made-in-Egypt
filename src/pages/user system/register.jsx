import React from "react";
import api from "./../../api/axios.base";
import { toast } from "sonner";
import {  useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../../utils/schmea.validation";
import { Link } from "react-router-dom";

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

      toast.success(res.data.message || "تم إنشاء الحساب بنجاح!");
      reset();
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
    <div dir="rtl" className="text-center mt-5">
      <h1 className="text-[30px] font-bold text-pink-500">انضم إلينا</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[420px] mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-5 border border-gray-100 text-right"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          أهلاً بك في متجرنا
        </h2>

        {/* الاسم */}
        <div>
          <input
            placeholder="الاسم بالكامل"
            {...register("name")}
            className="w-full px-4  bg-gray-500/20 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
        </div>

        {/* الإيميل */}
        <div>
          <input
            placeholder="البريد الإلكتروني"
            {...register("email")}
            className="w-full px-4 py-3  bg-gray-500/20 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        </div>

        {/* كلمة المرور */}
        <div>
          <input
            type="password"
            placeholder="كلمة المرور"
            {...register("password")}
            className="w-full px-4 py-3  bg-gray-500/20 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-red-500 text-sm mt-1">
            {errors.password?.message}
          </p>
        </div>

        {/* تأكيد كلمة المرور */}
        <div>
          <input
            type="password"
            placeholder="تأكيد كلمة المرور"
            {...register("confirmPassword")}
            className="w-full px-4 py-3 rounded-lg border bg-gray-500/20 border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword?.message}
          </p>
        </div>

        {/* زر التسجيل */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        </button>

        {/* رسالة الخطأ */}
        {error && (
          <p className="text-red-500 text-center text-sm font-medium">
            {error.includes("البريد الإلكتروني مستخدم بالفعل")
              ? "البريد الإلكتروني مستخدم بالفعل، يرجى استخدام بريد آخر."
              : "حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى."}
          </p>
        )}

        {/* تسجيل الدخول */}
        <p className="text-sm text-center text-gray-500">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-black font-medium hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </form>
    </div>
  );
}
