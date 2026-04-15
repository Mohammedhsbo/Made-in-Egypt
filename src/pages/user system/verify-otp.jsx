import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { verifyOtpSchema } from "../../../utils/schmea.validation";
import { verifyOtpRequest } from "@/services/auth.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { KeyRound, Lock, Mail } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const emailFromQuery = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(verifyOtpSchema),
    defaultValues: {
      email: emailFromQuery,
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await verifyOtpRequest({
        email: data.email,
        otp: data.otp,
        newPassword: data.password,
      });

      toast.success("تم تغيير كلمة المرور بنجاح");

      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "رمز غير صالح أو منتهي");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border p-8 shadow-xl">
        <h1 className="text-2xl font-black text-center mb-2">
          إعادة تعيين كلمة المرور
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          أدخل OTP وكلمة المرور الجديدة
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              {...register("email")}
              placeholder="البريد الإلكتروني"
              className="w-full rounded-xl border bg-gray-50 py-3 pr-11 pl-3"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}

          {/* OTP */}
          <div className="relative">
            <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              {...register("otp")}
              placeholder="رمز التحقق OTP"
              className="w-full rounded-xl border bg-gray-50 py-3 pr-11 pl-3"
            />
          </div>
          {errors.otp && (
            <p className="text-xs text-red-500">{errors.otp.message}</p>
          )}

          {/* NEW PASSWORD */}
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              {...register("password")}
              placeholder="كلمة المرور الجديدة"
              className="w-full rounded-xl border bg-gray-50 py-3 pr-11 pl-3"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="تأكيد كلمة المرور"
              className="w-full rounded-xl border bg-gray-50 py-3 pr-11 pl-3"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}

          <Button type="submit" className="w-full py-6" disabled={loading}>
            {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </Button>
        </form>

        <Link
          to="/forgot-password"
          className="mt-5 block text-center text-sm text-primary font-semibold"
        >
          إعادة إرسال OTP
        </Link>
      </div>
    </div>
  );
}