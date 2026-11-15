import { useCart } from "../context/cartContext";
import { useAuth } from "../context/auth.context";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ShoppingBag,
  CreditCard,
  MapPin,
  Phone,
  User,
  Mail,
  Navigation,
} from "lucide-react";
import api, { markApiErrorHandled } from "../api/axios.base";
import { useEffect, useState } from "react";
import SafeImage from "@/components/ui/safe-image";
import { getProductImageUrl } from "@/utils/formatImageUrl";
import { useLanguage } from "@/context/language.context";

const checkoutSchema = (t) => yup.object().shape({
  fullName: yup.string().required(t("الاسم بالكامل مطلوب")),
  email: yup
    .string()
    .required(t("البريد الإلكتروني مطلوب"))
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      t("البريد الإلكتروني غير صحيح")
    ),
  phone: yup
    .string()
    .required(t("رقم الهاتف مطلوب"))
    .matches(
      /^(010|011|012|015)[0-9]{8}$/,
      t("يجب أن يكون 11 رقم ويبدأ بـ 010,011,012,015")
    ),
  address: yup.string().required(t("العنوان التفصيلي مطلوب")),
  city: yup.string().required(t("المحافظة/المدينة مطلوبة")),
  paymentMethod: yup.string().required(t("يجب اختيار طريقة دفع")),
  creditCardNumber: yup.string().when("paymentMethod", {
    is: "creditCard",
    then: () =>
      yup
        .string()
        .required(t("رقم البطاقة مطلوب"))
        .matches(/^[0-9]{16}$/, t("يجب أن يكون 16 رقم")),
    otherwise: () => yup.string().notRequired(),
  }),
  cvv: yup.string().when("paymentMethod", {
    is: "creditCard",
    then: () =>
      yup
        .string()
        .required(t("CVV مطلوب"))
        .matches(/^[0-9]{3}$/, t("يجب أن يكون 3 أرقام")),
    otherwise: () => yup.string().notRequired(),
  }),
});

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const items = cart?.items || [];
  const SHIPPING_FEE = items.length > 0 ? 75 : 0;
  const subtotal = Array.isArray(items)
    ? items.reduce((sum, item) => {
        const price =
          item.price ||
          item.product?.priceAfterDiscount ||
          item.product?.basePrice ||
          0;

        return sum + price * (item.quantity || 1);
      }, 0)
    : 0;
  const finalTotal = Math.max(0, subtotal - couponDiscount + SHIPPING_FEE);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?redirect=/checkout", { replace: true });
    }
  }, [authLoading, navigate, user]);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(checkoutSchema(t)),
    defaultValues: { paymentMethod: "cash" },
  });
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error(t("اكتب كود الخصم أولاً"));
      return;
    }

    if (!user) {
      toast.error(t("تطبيق الكوبون متاح بعد تسجيل الدخول"));
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const res = await api.patch("/cart/apply-coupon", {
        code: couponCode.trim(),
      });
      const backendCart = res?.data?.data?.cart;
      const discountedSubtotal =
        backendCart?.totalPriceAfterDiscount ?? backendCart?.totalPrice;
      const nextDiscount =
        typeof discountedSubtotal === "number"
          ? Math.max(0, subtotal - discountedSubtotal)
          : 0;

      setCouponDiscount(nextDiscount);
      toast.success(t("تم تطبيق الكوبون بنجاح"));
    } catch (error) {
      setCouponDiscount(0);
      markApiErrorHandled(error);
      toast.error(error.response?.data?.message || t("كوبون غير صالح"));
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const paymentMethod = watch("paymentMethod");

  // Optional: WhatsApp notification (non-blocking)
//   const sendWhatsApp = (data) => {
//     const itemsText = items
//       .map(
//         (item) =>
//           `${item.product?.title_ar || item.product?.title_en || "منتج"} (x${item.quantity || 1})`
//       )
//       .join(" | ");

//     const message = `
// *طلب جديد* 🛍️

// *الإجمالي:* ${finalTotal} EGP

// *تفاصيل العميل:*
// الاسم: ${data.fullName}
// الهاتف: ${data.phone}
// العنوان: ${data.address} - ${data.city}

// *المنتجات:*
// ${itemsText}
// `;
//     const encoded = encodeURIComponent(message);
//     window.open(`https://wa.me/201014625009?text=${encoded}`, "_blank");
//   };

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error(t("سلة المشتريات فارغة"));
      return;
    }

    try {
      if (!user) return;

      const payload = {
        shippingAddress: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
        },
        paymentMethod: data.paymentMethod === "creditCard" ? "card" : "cash",
        totalPrice: finalTotal,
        items: items.map((item) => ({
          product: item.product?._id || item.product?.id || item.product,
          quantity: item.quantity || 1,
          price:
            item.product?.priceAfterDiscount || item.product?.basePrice || 0,
        })),
      };

      await api.post("/orders", payload);
       
      toast.success(t("تم تأكيد الطلب بنجاح! شكراً لتسوقك معنا."), {
        duration: 5000,
      });

      // Clear cart then navigate
      await clearCart();
      reset();

      // Optional WhatsApp notification (non-blocking)
      // sendWhatsApp(data);

      navigate("/my-orders");
    } catch (error) {
      markApiErrorHandled(error);
      const message =
        error.response?.data?.message || t("عذراً، حدث خطأ أثناء إتمام الطلب.");
      toast.error(message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-[60vh] justify-center items-center text-center p-6">
        <div className="bg-gray-50 p-6 rounded-full mb-6">
          <ShoppingBag size={60} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t("لا توجد منتجات للدفع!")}
        </h2>
        <p className="text-gray-500 mb-8 text-lg">
          {t("سلة مشترياتك فارغة، يرجى إضافة منتجات للمتابعة.")}
        </p>
        <Link to="/">
          <Button size="lg" className="rounded-full px-12 text-lg">
            {t("العودة للتسوق")}
          </Button>
        </Link>
      </div>
    );
  }

  const InputWrapper = ({ icon, error, children }) => {
    const IconComponent = icon;
    return (
      <div className="relative group">
        <div className={`absolute ${isArabic ? "right-4" : "left-4"} top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#26716c]`}>
          <IconComponent size={20} />
        </div>
        {children}
        {error && <p className="text-red-500 text-sm mt-1 px-2">{error}</p>}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-3 py-6 sm:px-5 sm:py-10 lg:px-8 2xl:px-12">
      <header className="mb-7 flex flex-col gap-6 rounded-[2rem] border border-white/80 bg-gradient-to-r from-[#f1f5f0] via-white to-[#f7f2e9] p-5 shadow-[0_16px_44px_rgba(26,58,52,0.07)] sm:mb-9 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#26716c]">{t("Secure checkout")}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{t("إتمام الطلب")}</h1>
          <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">{t("الخطوة الأخيرة للحصول على منتجاتك")}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[t("المعلومات الشخصية"), t("معلومات التوصيل"), t("طريقة الدفع")].map((step, index) => (
            <div key={step} className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-2.5 py-2 text-xs font-bold text-slate-600 shadow-sm sm:px-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eaf2ef] text-[10px] font-black text-[#26716c]">{index + 1}</span>
              <span className="hidden truncate sm:inline">{step}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)] lg:gap-8">
        {/* Checkout Form */}
        <div className="min-w-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Section: Contact Info */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(26,58,52,0.05)] sm:p-7">
              <h3 className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 text-lg font-black text-slate-900 sm:text-xl">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf2ef] text-sm font-black text-[#26716c]">
                  1
                </span>
                {t("المعلومات الشخصية")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputWrapper icon={User} error={errors.fullName?.message}>
                  <input
                    type="text"
                    placeholder={t("الاسم بالكامل")}
                    dir={isArabic ? "rtl" : "ltr"}
                    {...register("fullName")}
                    className={`w-full rounded-xl border bg-slate-50 py-3.5 outline-none transition focus:bg-white focus:ring-4 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"} ${errors.fullName ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-[#26716c] focus:ring-[#26716c]/10"}`}
                  />
                </InputWrapper>
                <InputWrapper icon={Mail} error={errors.email?.message}>
                  <input
                    type="email"
                    placeholder={t("البريد الإلكتروني")}
                    dir="ltr"
                    {...register("email")}
                    className={`w-full rounded-xl border bg-slate-50 py-3.5 outline-none transition focus:bg-white focus:ring-4 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"} ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-[#26716c] focus:ring-[#26716c]/10"}`}
                  />
                </InputWrapper>
                <div className="md:col-span-2">
                  <InputWrapper icon={Phone} error={errors.phone?.message}>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder={t("رقم الهاتف الأساسي")}
                      {...register("phone")}
                      className={`w-full rounded-xl border bg-slate-50 py-3.5 outline-none transition focus:bg-white focus:ring-4 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"} ${errors.phone ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-[#26716c] focus:ring-[#26716c]/10"}`}
                    />
                  </InputWrapper>
                </div>
              </div>
            </div>

            {/* Section: Shipping Info */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(26,58,52,0.05)] sm:p-7">
              <h3 className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 text-lg font-black text-slate-900 sm:text-xl">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf2ef] text-sm font-black text-[#26716c]">
                  2
                </span>
                {t("معلومات التوصيل")}
              </h3>
              <div className="space-y-5">
                <InputWrapper icon={MapPin} error={errors.address?.message}>
                  <input
                    type="text"
                    placeholder={t("العنوان التفصيلي (الشارع، رقم البناية، الخ)")}
                    {...register("address")}
                    className={`w-full rounded-xl border bg-slate-50 py-3.5 outline-none transition focus:bg-white focus:ring-4 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"} ${errors.address ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-[#26716c] focus:ring-[#26716c]/10"}`}
                  />
                </InputWrapper>
                <div className="grid grid-cols-1 gap-5">
                  <InputWrapper icon={Navigation} error={errors.city?.message}>
                    <input
                      type="text"
                      placeholder={t("المدينة / المحافظة")}
                      {...register("city")}
                      className={`w-full rounded-xl border bg-slate-50 py-3.5 outline-none transition focus:bg-white focus:ring-4 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"} ${errors.city ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-[#26716c] focus:ring-[#26716c]/10"}`}
                    />
                  </InputWrapper>
                </div>
              </div>
            </div>

            {/* Section: Payment Method */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(26,58,52,0.05)] sm:p-7">
              <h3 className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 text-lg font-black text-slate-900 sm:text-xl">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf2ef] text-sm font-black text-[#26716c]">
                  3
                </span>
                {t("طريقة الدفع")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${paymentMethod === "cash" ? "border-[#26716c] bg-[#edf5f2] shadow-sm" : "border-slate-200 hover:border-[#26716c]/50"}`}
                >
                  <input
                    type="radio"
                    value="cash"
                    {...register("paymentMethod")}
                    className="h-5 w-5 accent-[#26716c]"
                  />
                  <span className="font-bold text-slate-700">
                    {t("الدفع نقداً عند الاستلام")}
                  </span>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${paymentMethod === "creditCard" ? "border-[#26716c] bg-[#edf5f2] shadow-sm" : "border-slate-200 hover:border-[#26716c]/50"}`}
                >
                  <input
                    type="radio"
                    value="creditCard"
                    {...register("paymentMethod")}
                    className="h-5 w-5 accent-[#26716c]"
                  />
                  <span className="font-bold text-slate-700">
                    {t("الدفع بالبطاقة الائتمانية")}
                  </span>
                </label>
              </div>

              {paymentMethod === "creditCard" && (
                <div className="grid grid-cols-1 gap-5 border-t border-dashed border-slate-200 pt-5 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <InputWrapper
                      icon={CreditCard}
                      error={errors.creditCardNumber?.message}
                    >
                      <input
                        type="text"
                        placeholder={t("رقم البطاقة (16 رقم)")}
                        {...register("creditCardNumber")}
                        className={`w-full rounded-xl border bg-slate-50 py-3.5 pl-12 pr-4 text-left outline-none transition focus:bg-white focus:ring-4 ${errors.creditCardNumber ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-[#26716c] focus:ring-[#26716c]/10"}`}
                        dir="ltr"
                      />
                    </InputWrapper>
                  </div>
                  <div>
                    <InputWrapper
                      icon={CheckCircle2}
                      error={errors.cvv?.message}
                    >
                      <input
                        type="text"
                        placeholder={t("CVV")}
                        {...register("cvv")}
                        className={`w-full rounded-xl border bg-slate-50 py-3.5 pl-12 pr-4 text-left outline-none transition focus:bg-white focus:ring-4 ${errors.cvv ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-[#26716c] focus:ring-[#26716c]/10"}`}
                        dir="ltr"
                      />
                    </InputWrapper>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full rounded-2xl bg-gradient-to-r from-[#1f5a53] to-[#26716c] text-lg font-black text-white shadow-[0_14px_28px_rgba(38,113,108,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(38,113,108,0.28)] sm:h-16 sm:text-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("جاري المعالجة...")}
                </span>
              ) : (
                <>
                  {t("تأكيد الطلب")}
                  <span className="rounded-lg bg-white/15 px-3 py-1">
                    {finalTotal} EGP
                  </span>
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="min-w-0">
          <div className="rounded-[2rem] border border-emerald-900/10 bg-gradient-to-br from-[#173e39] via-[#1f5a53] to-[#26716c] p-5 text-white shadow-[0_24px_55px_rgba(26,58,52,0.2)] sm:p-7 lg:sticky lg:top-28">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#e6c692]">{t("Order overview")}</p>
            <h3 className="mb-6 flex items-center justify-between border-b border-white/15 pb-4 text-xl font-black">
              {t("ملخص الطلب")}
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
                {items.length} {t("منتجات")}
              </span>
            </h3>

            <div className="max-h-[320px] space-y-3 overflow-y-auto pe-1">
              {items.map((item, index) => (
                <div
                  key={item._id || index}
                  className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 shadow-sm"
                >
                  <div className="relative">
                    <SafeImage
                      src={getProductImageUrl(item.product)}
                      alt={t((isArabic ? item.product?.title_ar || item.product?.title_en : item.product?.title_en || item.product?.title_ar) || "")}
                      className="h-16 w-16 rounded-xl border border-white/15 object-cover"
                    />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#e6c692] text-xs font-black text-[#173e39] ring-2 ring-[#1f5a53]">
                      {item.quantity || 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 line-clamp-2 text-sm font-bold leading-tight text-white">
                      {t((isArabic ? item.product?.title_ar || item.product?.title_en : item.product?.title_en || item.product?.title_ar) || "")}
                    </h4>
                    <span className="text-sm font-bold text-[#e6c692]">
                      {(
                        (item.product?.priceAfterDiscount ||
                          item.product?.basePrice ||
                          0) * (item.quantity || 1)
                      ).toFixed(2)}{" "}
                      EGP
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-white/15 pt-5">
              <div className="flex justify-between text-sm font-medium text-white/70">
                <span>{t("المجموع")}</span>
                <span>
                  {
                  subtotal.toFixed(2)
                  } EGP</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-white/70">
                <span>{t("التوصيل")}</span>
                <span className="text-green-600 font-bold">{SHIPPING_FEE}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm font-medium text-emerald-200">
                  <span>{t("خصم الكوبون")}</span>
                  <span>-{couponDiscount.toFixed(2)} EGP</span>
                </div>
              )}
              <div className="mb-4 flex gap-2">
  <input
    type="text"
    placeholder={t("كود الخصم")}
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
    className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/50 focus:border-[#e6c692]"
  />

  <button
    type="button"
    onClick={handleApplyCoupon}
    disabled={isApplyingCoupon}
    className="rounded-xl bg-[#e6c692] px-4 font-bold text-[#173e39] transition hover:bg-[#f0d7a8]"
  >
    {isApplyingCoupon ? t("جاري...") : t("تطبيق")}
  </button>
</div>
              <div className="flex items-center justify-between border-t border-white/15 pt-4">
                <span className="text-base font-bold text-white/90">
                  {t("الإجمالي النهائي")}
                </span>
                <span className="text-3xl font-black text-white">
                  {finalTotal.toFixed(2)}{" "}
                  <span className="text-sm text-white/65">EGP</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
