import React, { useState } from "react";
import { loginSchema } from "../../../utils/schmea.validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../api/axios.base";
import { toast } from "sonner";


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
    <div dir="rtl" className="text-center mt-5">
      <h1 className="text-[30px] font-bold text-pink-500">تسجيل الدخول</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[420px] mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-5 border border-gray-100 text-right"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          أهلاً بك مرة أخرى
        </h2>

        {/* Email */}
        <div>
          <input
            placeholder="البريد الإلكتروني"
            {...register("email")}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="كلمة المرور"
            {...register("password")}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-red-500 text-sm mt-1">
            {errors.password?.message}
          </p>
        </div>

        {/* زر */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center text-sm font-medium">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
