import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { verifyEmailSchema } from "../../../utils/schmea.validation";
import { verifyEmailRequest, resendVerifyEmailRequest } from "@/services/auth.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { KeyRound, Mail, UserCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/auth.context";
import { meRequest } from "@/services/auth.service";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const emailFromQuery = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(verifyEmailSchema),
    defaultValues: {
      email: emailFromQuery,
      otp: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await verifyEmailRequest({
        email: data.email,
        otp: data.otp,
      });

      localStorage.setItem("token", res.data.token);

      try {
        const meRes = await meRequest();
        login(meRes?.data?.data?.user || null);
      } catch (meErr) {
        console.log("Get me after verification failed:", meErr);
        // Fallback: use user from verification response if available
        if (res.data.data?.user) {
          login(res.data.data.user);
        }
      }

      toast.success("تم تفعيل الحساب بنجاح!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "رمز غير صالح أو منتهي");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailFromQuery) {
      toast.error("البريد الإلكتروني مفقود");
      return;
    }
    setResending(true);
    try {
      await resendVerifyEmailRequest({ email: emailFromQuery });
      toast.success("تم إعادة إرسال رمز التحقق");
    } catch (err) {
      toast.error(err?.response?.data?.message || "فشل إعادة الإرسال");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
             <UserCheck size={36} />
          </div>
          <h1 className="text-2xl font-black text-center mb-2">
            تأكيد البريد الإلكتروني
          </h1>
          <p className="text-sm text-gray-500 text-center">
            أدخل رمز التحقق المرسل إلى بريدك الإلكتروني
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              {...register("email")}
              placeholder="البريد الإلكتروني"
              className="w-full rounded-xl border bg-gray-50 py-3 pr-11 pl-3 text-right"
              readOnly={!!emailFromQuery}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 text-right">{errors.email.message}</p>
          )}

          {/* OTP */}
          <div className="relative">
            <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              {...register("otp")}
              placeholder="رمز التحقق (6 أرقام)"
              className="w-full rounded-xl border bg-gray-50 py-3 pr-11 pl-3 text-center"
              maxLength={6}
            />
          </div>
          {errors.otp && (
            <p className="text-xs text-red-500 text-right">{errors.otp.message}</p>
          )}

          <Button type="submit" className="w-full py-6 text-lg font-bold" disabled={loading}>
            {loading ? "جاري التحقق..." : "تحقق الآن"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm font-medium">
          <span className="text-gray-500">لم يصلك الرمز؟ </span>
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-primary hover:underline disabled:opacity-50"
          >
            {resending ? "جاري الإرسال..." : "إعادة إرسال الرمز"}
          </button>
        </div>

        <Link
          to="/login"
          className="mt-4 block text-center text-xs text-gray-400 hover:text-primary transition-colors"
        >
          العودة لتسجيل الدخول
        </Link>
      </div>
    </div>
  );
}
