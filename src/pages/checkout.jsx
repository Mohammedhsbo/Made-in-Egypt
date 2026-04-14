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
import api from "../api/axios.base";

const checkoutSchema = yup.object().shape({
  fullName: yup.string().required("الاسم بالكامل مطلوب"),
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "البريد الإلكتروني غير صحيح"
    ),
  phone: yup
    .string()
    .required("رقم الهاتف مطلوب")
    .matches(
      /^(010|011|012|015)[0-9]{8}$/,
      "يجب أن يكون 11 رقم ويبدأ بـ 010,011,012,015"
    ),
  address: yup.string().required("العنوان التفصيلي مطلوب"),
  city: yup.string().required("المحافظة/المدينة مطلوبة"),
  postalCode: yup.string().required("الرمز البريدي مطلوب (يمكن ادخال 00000)"),
  paymentMethod: yup.string().required("يجب اختيار طريقة دفع"),
  creditCardNumber: yup.string().when("paymentMethod", {
    is: "creditCard",
    then: () =>
      yup
        .string()
        .required("رقم البطاقة مطلوب")
        .matches(/^[0-9]{16}$/, "يجب أن يكون 16 رقم"),
    otherwise: () => yup.string().notRequired(),
  }),
  cvv: yup.string().when("paymentMethod", {
    is: "creditCard",
    then: () =>
      yup
        .string()
        .required("CVV مطلوب")
        .matches(/^[0-9]{3}$/, "يجب أن يكون 3 أرقام"),
    otherwise: () => yup.string().notRequired(),
  }),
});

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Cart from backend is an object { items: [...], ... }
  const items = cart?.items || [];

  const total = cart?.total || items.reduce(
    (sum, item) =>
      sum +
      (item.product?.priceAfterDiscount || item.product?.basePrice || 0) *
        (item.quantity || 1),
    0
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: { paymentMethod: "cash" },
  });

  const paymentMethod = watch("paymentMethod");

  // Optional: WhatsApp notification (non-blocking)
  const sendWhatsApp = (data) => {
    const itemsText = items
      .map(
        (item) =>
          `${item.product?.title_ar || item.product?.title_en || "منتج"} (x${item.quantity || 1})`
      )
      .join(" | ");

    const message = `
*طلب جديد* 🛍️

*الإجمالي:* ${total} EGP

*تفاصيل العميل:*
الاسم: ${data.fullName}
الهاتف: ${data.phone}
العنوان: ${data.address} - ${data.city}

*المنتجات:*
${itemsText}
`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/201014625009?text=${encoded}`, "_blank");
  };

  const onSubmit = async (data) => {
    // Guard: user must be logged in
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً لإتمام الطلب");
      navigate("/login");
      return;
    }

    if (items.length === 0) return;

    try {
      const payload = {
        shippingAddress: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
        },
        paymentMethod: data.paymentMethod === "creditCard" ? "card" : "cash",
        totalPrice: total,
        items: items.map((item) => ({
          product: item.product?._id || item.product?.id || item.product,
          quantity: item.quantity || 1,
          price:
            item.product?.priceAfterDiscount || item.product?.basePrice || 0,
        })),
      };

      await api.post("/orders", payload);
       
      toast.success("تم تأكيد الطلب بنجاح! شكراً لتسوقك معنا.", {
        duration: 5000,
      });

      // Clear cart then navigate
      await clearCart();
      reset();

      // Optional WhatsApp notification (non-blocking)
      sendWhatsApp(data);

      navigate("/my-orders");
    } catch (error) {
      const message =
        error.response?.data?.message || "عذراً، حدث خطأ أثناء إتمام الطلب.";
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
          لا توجد منتجات للدفع!
        </h2>
        <p className="text-gray-500 mb-8 text-lg">
          سلة مشترياتك فارغة، يرجى إضافة منتجات للمتابعة.
        </p>
        <Link to="/">
          <Button size="lg" className="rounded-full px-12 text-lg">
            العودة للتسوق
          </Button>
        </Link>
      </div>
    );
  }

  const InputWrapper = ({ icon: Icon, error, children }) => (
    <div className="relative group">
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10">
        <Icon size={20} />
      </div>
      {children}
      {error && <p className="text-red-500 text-sm mt-1 px-2">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          إتمام الطلب
        </h2>
        <p className="text-muted-foreground mt-2 font-medium">
          الخطوة الأخيرة للحصول على منتجاتك
        </p>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section: Contact Info */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                المعلومات الشخصية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputWrapper icon={User} error={errors.fullName?.message}>
                  <input
                    type="text"
                    placeholder="الاسم بالكامل"
                    {...register("fullName")}
                    className={`w-full bg-gray-50 border ${errors.fullName ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-primary"} rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                  />
                </InputWrapper>
                <InputWrapper icon={Mail} error={errors.email?.message}>
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    {...register("email")}
                    className={`w-full bg-gray-50 border ${errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-primary"} rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                  />
                </InputWrapper>
                <div className="md:col-span-2">
                  <InputWrapper icon={Phone} error={errors.phone?.message}>
                    <input
                      type="tel"
                      dir="rtl"
                      placeholder="رقم الهاتف الأساسي"
                      {...register("phone")}
                      className={`w-full bg-gray-50 border ${errors.phone ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-primary"} rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                    />
                  </InputWrapper>
                </div>
              </div>
            </div>

            {/* Section: Shipping Info */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                معلومات التوصيل
              </h3>
              <div className="space-y-5">
                <InputWrapper icon={MapPin} error={errors.address?.message}>
                  <input
                    type="text"
                    placeholder="العنوان التفصيلي (الشارع، رقم البناية، الخ)"
                    {...register("address")}
                    className={`w-full bg-gray-50 border ${errors.address ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-primary"} rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                  />
                </InputWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputWrapper icon={Navigation} error={errors.city?.message}>
                    <input
                      type="text"
                      placeholder="المدينة / المحافظة"
                      {...register("city")}
                      className={`w-full bg-gray-50 border ${errors.city ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-primary"} rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                    />
                  </InputWrapper>
                  <InputWrapper
                    icon={CreditCard}
                    error={errors.postalCode?.message}
                  >
                    <input
                      type="text"
                      placeholder="الرمز البريدي"
                      {...register("postalCode")}
                      className={`w-full bg-gray-50 border ${errors.postalCode ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-primary"} rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                    />
                  </InputWrapper>
                </div>
              </div>
            </div>

            {/* Section: Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  3
                </span>
                طريقة الدفع
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <label
                  className={`cursor-pointer border-2 rounded-2xl p-4 flex items-center gap-3 transition-all ${paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"}`}
                >
                  <input
                    type="radio"
                    value="cash"
                    {...register("paymentMethod")}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="font-bold text-gray-700">
                    الدفع نقداً عند الاستلام
                  </span>
                </label>
                <label
                  className={`cursor-pointer border-2 rounded-2xl p-4 flex items-center gap-3 transition-all opacity-70 ${paymentMethod === "creditCard" ? "border-primary bg-primary/5 opacity-100" : "border-gray-200 hover:border-primary/50"}`}
                >
                  <input
                    type="radio"
                    value="creditCard"
                    {...register("paymentMethod")}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="font-bold text-gray-700">
                    الدفع بالبطاقة الائتمانية
                  </span>
                </label>
              </div>

              {paymentMethod === "creditCard" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-dashed">
                  <div className="md:col-span-2">
                    <InputWrapper
                      icon={CreditCard}
                      error={errors.creditCardNumber?.message}
                    >
                      <input
                        type="text"
                        placeholder="رقم البطاقة (16 رقم)"
                        {...register("creditCardNumber")}
                        className={`w-full bg-gray-50 border ${errors.creditCardNumber ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-primary"} rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:bg-white transition-all text-left`}
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
                        placeholder="CVV"
                        {...register("cvv")}
                        className={`w-full bg-gray-50 border ${errors.cvv ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-primary"} rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:bg-white transition-all text-left`}
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
              className="w-full h-16 rounded-2xl text-xl font-bold bg-slate-900 hover:bg-slate-800 shadow-xl text-white transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري المعالجة...
                </span>
              ) : (
                <>
                  تأكيد الطلب
                  <span className="mr-2 px-3 py-1 bg-white/20 rounded-lg">
                    {total} EGP
                  </span>
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 sticky top-28">
            <h3 className="text-xl font-bold mb-6 pb-4 border-b border-gray-200 flex items-center justify-between">
              ملخص الطلب
              <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                {items.length} منتجات
              </span>
            </h3>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm relative"
                >
                  <div className="relative">
                    <img
                      src={
                        item.product?.imageCover || item.product?.images?.[0]
                      }
                      alt={item.product?.title_ar || item.product?.title_en}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-50"
                    />
                    <span className="absolute -top-2 -right-2 bg-slate-800 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ring-2 ring-white">
                      {item.quantity || 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-800 leading-tight mb-1 line-clamp-2">
                      {item.product?.title_ar || item.product?.title_en}
                    </h4>
                    <span className="text-primary font-bold text-sm">
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

            <div className="mt-8 space-y-3 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>المجموع</span>
                <span>{total.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>التوصيل</span>
                <span className="text-green-600 font-bold">مجاناً</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-slate-800">
                  الإجمالي النهائي
                </span>
                <span className="text-3xl font-black text-primary">
                  {total.toFixed(2)}{" "}
                  <span className="text-sm">EGP</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
