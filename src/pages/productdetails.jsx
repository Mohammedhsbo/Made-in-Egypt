import useProductDetails from "@/hooks/useProductDetails";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Relatedproducts from "./relatedproducts";
import {
  Award,
  BadgePercent,
  Info,
  Minus,
  PackageCheck,
  Plus,
  Repeat,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/cartContext";
import Reviews from "./reveiw/reveiw";
import { useAuth } from "../context/auth.context";
import { toast } from "sonner";
import SafeImage from "@/components/ui/safe-image";
import { FALLBACK_IMAGE } from "@/utils/formatImageUrl";
import { useLanguage } from "@/context/language.context";

export default function Productdetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useProductDetails(id);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t, isArabic } = useLanguage();
  const [quantitySelection, setQuantitySelection] = useState({ productId: id, quantity: 1 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const product = data?.data?.product;
  const title = t(isArabic
    ? product?.title_ar || product?.title_en || ""
    : product?.title_en || product?.title_ar || "");
  const description = t(isArabic
    ? product?.description_ar || product?.description_en || ""
    : product?.description_en || product?.description_ar || "");
  const category = t(
    (isArabic
      ? product?.category?.name_ar || product?.category?.name_en
      : product?.category?.name_en || product?.category?.name_ar) || "",
  );
  const productImages = [...new Set([product?.imageCover, ...(product?.images || [])].filter(Boolean))];
  const images = productImages.length ? productImages : [FALLBACK_IMAGE];
  const basePrice = Number(product?.basePrice) || 0;
  const discountedPrice = Number(product?.priceAfterDiscount) || 0;
  const hasDiscount = discountedPrice > 0 && basePrice > 0 && discountedPrice < basePrice;
  const price = hasDiscount ? discountedPrice : basePrice;
  const stockCount = Math.max(0, Number(product?.quantity) || 0);
  const selectedQuantity = quantitySelection.productId === id ? quantitySelection.quantity : 1;
  const quantity = stockCount > 0 ? Math.min(selectedQuantity, stockCount) : 1;
  const isOnSale = product?.isOnSale || hasDiscount;
  const discountPercent = hasDiscount
    ? Math.round(((basePrice - discountedPrice) / basePrice) * 100)
    : 0;
  const formatPrice = (value) => `${Number(value || 0).toLocaleString(isArabic ? "ar-EG" : "en-US")} ${isArabic ? "ج.م" : "EGP"}`;

  const sliderSettings = {
    dots: images.length > 1,
    infinite: images.length > 1,
    speed: 450,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const features = [
    { text: t("شحن سريع للمنزل"), icon: Truck },
    { text: t("أعلى جودة مضمونة"), icon: Award },
    { text: t("استبدال واسترجاع"), icon: Repeat },
  ];

  if (error) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f7f6f1] px-4">
        <div className="max-w-lg rounded-2xl border border-red-200 bg-white px-6 py-5 text-center font-semibold text-red-700 shadow-sm" role="alert">
          {t("حدث خطأ أثناء جلب بيانات المنتج")}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f1]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        {isLoading ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
            <Spinner className="h-12 w-12 text-primary" />
            <p className="font-semibold">{t("جاري تحميل المنتج...")}</p>
          </div>
        ) : product ? (
          <>
            <section className="overflow-hidden rounded-[1.75rem] border border-[#e7e1d8] bg-white shadow-[0_20px_60px_rgba(39,46,36,0.07)] sm:rounded-[2.25rem]">
              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                <div className="min-w-0 p-3 sm:p-6 lg:p-8">
                  <div className="relative overflow-hidden rounded-[1.4rem] border border-[#eee9e0] bg-[radial-gradient(ellipse_at_50%_25%,#ffffff_0%,#f6f4ee_72%)] p-3 sm:rounded-[1.8rem] sm:p-5">
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent" aria-hidden="true" />
                    {isOnSale && (
                      <div className="absolute end-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#a94232] px-3 py-1.5 text-xs font-black text-white shadow-md">
                        <BadgePercent size={14} aria-hidden="true" />
                        {t("خصم")}
                      </div>
                    )}

                    <Slider {...sliderSettings}>
                      {images.map((image, index) => (
                        <div key={`${image}-${index}`} className="outline-none">
                          <div className="flex h-[320px] items-center justify-center px-2 pb-8 pt-10 sm:h-[440px] sm:px-5 sm:pt-12">
                            <SafeImage
                              src={image}
                              alt={title || t("Product")}
                              className="h-full w-full object-contain drop-shadow-[0_18px_18px_rgba(32,38,30,0.10)]"
                            />
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col border-t border-[#eee9e0] p-5 sm:p-8 lg:border-s lg:border-t-0 lg:p-10">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#f2f4ef] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#426451]">
                      {category || t("Products")}
                    </span>
                  </div>

                  <h1 className="text-2xl font-black leading-tight tracking-tight text-[#1b2f29] sm:text-3xl lg:text-[2.15rem]">
                    {title}
                  </h1>

                  <div className="my-6 h-px bg-gradient-to-r from-[#e7e1d8] via-[#e7e1d8] to-transparent" />

                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{t("Price")}</p>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-3xl font-black tracking-tight text-[#1a3a34] sm:text-4xl" dir="ltr">
                          {formatPrice(price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-base font-semibold text-slate-400 line-through" dir="ltr">
                            {formatPrice(basePrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${
                      stockCount > 0
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-rose-200 bg-rose-50 text-rose-700"
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${stockCount > 0 ? "bg-emerald-500" : "bg-rose-500"}`} aria-hidden="true" />
                      {t(stockCount > 0 ? "متوفر" : "غير متوفر")}
                    </span>
                  </div>

                  {hasDiscount && (
                    <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl bg-[#f7f4ed] px-3 py-2 text-sm font-bold text-[#80643e]">
                      <BadgePercent size={17} aria-hidden="true" />
                      {t("وفر")} {discountPercent}%
                    </div>
                  )}

                  <div className="mt-7 rounded-2xl border border-[#ece9e1] bg-[#fbfbf8] p-4 sm:p-5">
                    <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#253d34]">
                      <Info size={17} className="text-[#a17d4d]" aria-hidden="true" />
                      {t("الوصف")}
                    </h2>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-[15px]">
                      {description || t("No product details")}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <div
                      className="inline-flex h-12 items-center justify-between rounded-xl border border-[#e4e6df] bg-white p-1 shadow-sm sm:w-36"
                      role="group"
                      aria-label={t("Quantity")}
                    >
                      <button
                        type="button"
                        aria-label={t("Decrease quantity")}
                        disabled={quantity <= 1}
                        onClick={() => setQuantitySelection({ productId: id, quantity: Math.max(1, quantity - 1) })}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-[#315d51] transition hover:bg-[#eff3ef] disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        <Minus size={16} aria-hidden="true" />
                      </button>
                      <span className="min-w-8 text-center font-black text-slate-800" aria-live="polite">{quantity}</span>
                      <button
                        type="button"
                        aria-label={t("Increase quantity")}
                        disabled={quantity >= stockCount}
                        onClick={() => setQuantitySelection({ productId: id, quantity: Math.min(stockCount, quantity + 1) })}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-[#315d51] transition hover:bg-[#eff3ef] disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        <Plus size={16} aria-hidden="true" />
                      </button>
                    </div>

                    <Button
                      className="h-12 flex-1 gap-2 rounded-xl bg-[#1a3a34] text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(26,58,52,0.18)] transition hover:bg-[#244b42] hover:shadow-[0_10px_22px_rgba(26,58,52,0.22)] disabled:cursor-not-allowed"
                      disabled={stockCount < 1}
                      onClick={() => {
                        if (!user) {
                          toast.info(t("يمكنك التصفح بدون تسجيل، لكن التسجيل يحفظ سلتك"));
                        }
                        addToCart({ ...product, selectedQuantity: quantity });
                      }}
                    >
                      <ShoppingCart size={18} aria-hidden="true" />
                      {t("إضافة للسلة")}
                    </Button>
                  </div>

                  {hasDiscount && (
                    <p className="mt-3 text-center text-xs font-semibold text-[#8d744f] sm:text-start">
                      {t("وفر")} {formatPrice(basePrice - discountedPrice)}
                    </p>
                  )}

                  <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {features.map(({ text, icon }) => (
                      <div
                        key={text}
                        className="flex items-center gap-3 rounded-xl border border-[#ece9e1] bg-white p-3 text-start sm:flex-col sm:items-center sm:text-center sm:p-4"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f1f5f0] text-[#315d51]">
                          {React.createElement(icon, { size: 18, "aria-hidden": true })}
                        </span>
                        <span className="text-xs font-bold leading-5 text-slate-600">{text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t border-dashed border-[#e7e1d8] pt-4 text-xs font-semibold text-slate-500">
                    <PackageCheck size={16} className="text-[#a17d4d]" aria-hidden="true" />
                    {t("Secure and easy shopping")}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-12 border-t border-[#e5e1d8] pt-7 sm:mt-16 sm:pt-9">
              <Relatedproducts />
            </section>

            <section className="mt-8 overflow-hidden rounded-[1.75rem] border border-[#e7e1d8] bg-white p-2 shadow-[0_12px_36px_rgba(39,46,36,0.045)] sm:mt-10 sm:rounded-[2rem] sm:p-5">
              <Reviews />
            </section>
          </>
        ) : (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#315d51] shadow-sm">
              <ShoppingCart size={28} aria-hidden="true" />
            </div>
            <p className="text-lg font-bold text-slate-700">{t("No products found")}</p>
            <Button asChild className="rounded-full bg-[#1a3a34] px-5 font-bold text-white hover:bg-[#244b42]">
              <Link to="/">{t("Back to home")}</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
