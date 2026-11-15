import React, { useState } from "react";
import { loginSchema } from "../../../utils/schmea.validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Lock, LogIn, Store, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/auth.context";
import { loginRequest, meRequest } from "@/services/auth.service";
import { markApiErrorHandled } from "@/api/axios.base";
import { useLanguage } from "@/context/language.context";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { t, isArabic } = useLanguage();

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
      const res = await loginRequest({
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("token", res.data.token);

      try {
        const meRes = await meRequest();
        login(meRes?.data?.data?.user || null);
      } catch (meErr) {
        markApiErrorHandled(meErr);
        console.log("Get me after login failed:", meErr);
      }

      toast.success(res.data.message || t("تم تسجيل الدخول بنجاح!"));
      const redirect = searchParams.get("redirect");
      navigate(redirect || "/", { replace: true });
    } catch (err) {
      markApiErrorHandled(err);
      if (err.response?.status === 401) {
        setError(t("البريد الإلكتروني أو كلمة المرور غير صحيحة"));
        toast.error(t("البريد الإلكتروني أو كلمة المرور غير صحيحة"));
      } else if (err.response?.status === 403) {
        setError(t("يرجى تفعيل بريدك الإلكتروني أولاً"));
        toast.info(t("يرجى تفعيل بريدك الإلكتروني أولاً، جاري توجيهك..."));
        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
        }, 2000);
      } else {
        setError(t("حدث خطأ أثناء تسجيل الدخول"));
        toast.error(t("حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-[#f7f5f0] via-[#f8faf8] to-[#eef4f1] px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_30px_90px_rgba(26,58,52,0.14)] md:min-h-[610px] md:grid-cols-2">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#153d38] via-[#1f5a53] to-[#26716c] p-10 text-white md:flex lg:p-14">
          <div aria-hidden="true" className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full border border-white/10" />
          <Link to="/" className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-[#e6c692]"><Store size={24} /></span>
            <span className="text-sm font-black tracking-[0.18em]">{t("MADE IN EGYPT")}</span>
          </Link>
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e6c692]">{t("Welcome back")}</p>
            <h2 className="mt-4 text-4xl font-black leading-tight lg:text-5xl">{t("أهلاً بك مجدداً")}</h2>
            <p className="mt-5 max-w-sm leading-7 text-white/75">{t("سجل دخولك لمتابعة التسوق وإدارة طلباتك")}</p>
            <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <ShieldCheck className="shrink-0 text-[#e6c692]" size={22} />
              <span className="text-sm font-semibold text-white/90">{t("Secure and easy shopping")}</span>
            </div>
          </div>
          <p className="relative text-xs text-white/50">{t("انضم إلينا الآن واستمتع بأفضل عروض التسوق")}</p>
        </aside>

        <section className="flex items-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#26716c] md:hidden">
              <Store size={16} /> {t("MADE IN EGYPT")}
            </Link>
            <div className="mb-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf2ef] text-[#26716c] shadow-inner">
                <LogIn size={26} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">{t("تسجيل الدخول")}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">{t("سجل دخولك لمتابعة التسوق وإدارة طلباتك")}</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="login-email">{t("البريد الإلكتروني")}</label>
                <div className="group relative">
                  <Mail className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#26716c] ${isArabic ? "right-4" : "left-4"}`} size={19} />
                  <input
                    id="login-email"
                    type="email"
                    placeholder={t("البريد الإلكتروني")}
                    {...register("email")}
                    className={`block w-full rounded-xl border bg-slate-50 py-3.5 text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"} ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-[#26716c] focus:ring-[#26716c]/10"}`}
                    dir="ltr"
                  />
                </div>
                {errors.email && <p className="mt-1 px-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="login-password">{t("كلمة المرور")}</label>
                <div className="group relative">
                  <Lock className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#26716c] ${isArabic ? "right-4" : "left-4"}`} size={19} />
                  <input
                    id="login-password"
                    type="password"
                    placeholder={t("كلمة المرور")}
                    {...register("password")}
                    className={`block w-full rounded-xl border bg-slate-50 py-3.5 text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"} ${errors.password ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-[#26716c] focus:ring-[#26716c]/10"}`}
                    dir="ltr"
                  />
                </div>
                {errors.password && <p className="mt-1 px-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div className={`flex ${isArabic ? "justify-start" : "justify-end"}`}>
                <Link to="/forgot-password" className="text-sm font-bold text-[#26716c] transition hover:text-[#174943]">
                  {t("نسيت كلمة المرور؟")}
                </Link>
              </div>

              {error && <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-3 text-center text-sm font-semibold text-red-700">{error}</div>}

              <Button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#1f5a53] to-[#26716c] py-6 text-base font-bold text-white shadow-[0_12px_24px_rgba(38,113,108,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(38,113,108,0.28)] disabled:opacity-70"
              >
                {loading ? t("جاري التحقق...") : <><LogIn size={20} className="transition-transform group-hover:translate-x-0.5" />{t("تسجيل الدخول")}</>}
              </Button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <span className="text-sm text-slate-500">{t("ليس لديك حساب؟")} </span>
              <Link to="/register" className="font-bold text-[#26716c] transition hover:text-[#174943]">{t("إنشاء حساب جديد")}</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
