import React from "react";
import api, { markApiErrorHandled } from "./../../api/axios.base";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../../utils/schmea.validation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, UserPlus, Store, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/language.context";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { t, isArabic } = useLanguage();

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

      toast.success(res.data.message || t("تم إنشاء الحساب بنجاح! يرجى تأكيد بريدك الإلكتروني."));
      reset();
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      markApiErrorHandled(err);
      if (err.response?.status === 500) {
        toast.error(t("البريد الإلكتروني مستخدم بالفعل، يرجى استخدام بريد آخر."));
        setError(t("البريد الإلكتروني مستخدم بالفعل، يرجى استخدام بريد آخر."));
      } else {
        toast.error(t("حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى."));
        setError(t("حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-[#f7f5f0] via-[#f8faf8] to-[#eef4f1] px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_30px_90px_rgba(26,58,52,0.14)] md:min-h-[680px] md:grid-cols-2">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#153d38] via-[#1f5a53] to-[#26716c] p-10 text-white md:flex lg:p-14">
          <div aria-hidden="true" className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full border border-white/10" />
          <Link to="/" className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-[#e6c692]"><Store size={24} /></span>
            <span className="text-sm font-black tracking-[0.18em]">{t("MADE IN EGYPT")}</span>
          </Link>
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e6c692]">{t("Store catalog")}</p>
            <h2 className="mt-4 text-4xl font-black leading-tight lg:text-5xl">{t("انضم إلينا الآن واستمتع بأفضل عروض التسوق")}</h2>
            <p className="mt-5 max-w-sm leading-7 text-white/75">{t("Discover products from local brands")}</p>
            <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <ShieldCheck className="shrink-0 text-[#e6c692]" size={22} />
              <span className="text-sm font-semibold text-white/90">{t("Secure and easy shopping")}</span>
            </div>
          </div>
          <p className="relative text-xs text-white/50">{t("MADE IN EGYPT")}</p>
        </aside>

        <section className="flex items-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#26716c] md:hidden">
              <Store size={16} /> {t("MADE IN EGYPT")}
            </Link>
            <div className="mb-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf2ef] text-[#26716c] shadow-inner">
                <UserPlus size={26} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">{t("إنشاء حساب جديد")}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">{t("انضم إلينا الآن واستمتع بأفضل عروض التسوق")}</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="register-name">{t("الاسم بالكامل")}</label>
                  <div className="group relative">
                    <User className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#26716c] ${isArabic ? "right-4" : "left-4"}`} size={19} />
                    <input
                      id="register-name"
                      placeholder={t("الاسم بالكامل")}
                      {...register("name")}
                      className={`block w-full rounded-xl border bg-slate-50 py-3.5 text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"} ${errors.name ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-[#26716c] focus:ring-[#26716c]/10"}`}
                      dir="auto"
                    />
                  </div>
                  {errors.name && <p className="mt-1 px-1 text-xs text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="register-email">{t("البريد الإلكتروني")}</label>
                  <div className="group relative">
                    <Mail className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#26716c] ${isArabic ? "right-4" : "left-4"}`} size={19} />
                    <input
                      id="register-email"
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
                  <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="register-password">{t("كلمة المرور")}</label>
                  <div className="group relative">
                    <Lock className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#26716c] ${isArabic ? "right-4" : "left-4"}`} size={19} />
                    <input
                      id="register-password"
                      type="password"
                      placeholder={t("كلمة المرور")}
                      {...register("password")}
                      className={`block w-full rounded-xl border bg-slate-50 py-3.5 text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"} ${errors.password ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-[#26716c] focus:ring-[#26716c]/10"}`}
                      dir="ltr"
                    />
                  </div>
                  {errors.password && <p className="mt-1 px-1 text-xs text-red-600">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="register-confirm-password">{t("تأكيد كلمة المرور")}</label>
                  <div className="group relative">
                    <Lock className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#26716c] ${isArabic ? "right-4" : "left-4"}`} size={19} />
                    <input
                      id="register-confirm-password"
                      type="password"
                      placeholder={t("تأكيد كلمة المرور")}
                      {...register("confirmPassword")}
                      className={`block w-full rounded-xl border bg-slate-50 py-3.5 text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"} ${errors.confirmPassword ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-[#26716c] focus:ring-[#26716c]/10"}`}
                      dir="ltr"
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 px-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              {error && <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-3 text-center text-sm font-semibold text-red-700">{error}</div>}

              <Button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#1f5a53] to-[#26716c] py-6 text-base font-bold text-white shadow-[0_12px_24px_rgba(38,113,108,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(38,113,108,0.28)] disabled:opacity-70"
              >
                {loading ? t("جاري الإنشاء...") : <><UserPlus size={20} className="transition-transform group-hover:translate-x-0.5" />{t("إنشاء حساب")}</>}
              </Button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <span className="text-sm text-slate-500">{t("لديك حساب بالفعل؟")} </span>
              <Link to="/login" className="font-bold text-[#26716c] transition hover:text-[#174943]">{t("تسجيل الدخول")}</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
