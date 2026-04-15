import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "../../../utils/schmea.validation";
import { forgotPasswordRequest } from "@/services/auth.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      // backend sends OTP
      await forgotPasswordRequest({ email });

      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");

      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-8 shadow-xl">
        <h1 className="text-2xl font-black text-center mb-2">
          استعادة كلمة المرور
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          أدخل بريدك الإلكتروني لإرسال رمز التحقق
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              {...register("email")}
              className="w-full rounded-xl border bg-gray-50 py-3 pr-11 pl-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}

          <Button type="submit" className="w-full py-6" disabled={loading}>
            {loading ? "جاري الإرسال..." : "إرسال OTP"}
          </Button>
        </form>

        <Link
          to="/login"
          className="mt-5 block text-center text-sm text-primary font-semibold"
        >
          العودة لتسجيل الدخول
        </Link>
      </div>
    </div>
  );
}