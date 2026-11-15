import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Tag } from "lucide-react";
import SafeImage from "@/components/ui/safe-image";
import { useLanguage } from "@/context/language.context";


export default function TodaysDealCard({ deals, preview = false }) {
  const { t, isArabic } = useLanguage();
  if (!deals || deals.length === 0) return null;

  const product = deals.find((deal) => deal.isFeatured) || deals[0];
  if (!preview && product.isOfferVisible === false) return null;
  const title = t(isArabic ? product?.title_ar || product?.title_en || "" : product?.title_en || product?.title_ar || "");
  const description = t(isArabic
    ? product?.offerDescription_ar ?? product?.offerDescription_en ?? product?.description_ar ?? product?.description_en ?? ""
    : product?.offerDescription_en ?? product?.offerDescription_ar ?? product?.description_en ?? product?.description_ar ?? "");
  const hasOfferPricing = product?.offerBasePrice !== undefined && product?.offerBasePrice !== null;
  const basePrice = hasOfferPricing ? product.offerBasePrice : product?.basePrice || 0;
  const discountPrice = hasOfferPricing ? product.offerPriceAfterDiscount : product?.priceAfterDiscount;
  const hasDiscount = discountPrice !== null
    && discountPrice !== undefined
    && discountPrice >= 0
    && discountPrice < basePrice;
  const price = hasDiscount ? discountPrice : basePrice;

  return (
    <div className="group relative isolate overflow-hidden rounded-[2rem] border border-white/15 bg-[#102e28] p-5 shadow-[0_28px_80px_rgba(12,38,31,0.24)] sm:p-8 lg:p-12">
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-40 h-[34rem] w-[34rem] rounded-full bg-emerald-300/15 blur-[90px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 left-1/4 h-[26rem] w-[26rem] rounded-full bg-[#c39a62]/10 blur-[90px]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

      <div className="relative z-10 grid items-center gap-9 md:grid-cols-[1.05fr_.95fr] lg:gap-14">
        <div className={`text-white ${isArabic ? "text-right" : "text-left"}`}>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold tracking-wide text-emerald-50 shadow-[inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-xl">
            <Sparkles size={15} className="text-[#e7c58d]" />
            <span>{t("Limited-time offer")}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.8)]" />
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-emerald-200/75">{t("Handpicked for you")}</p>
          <h2 className="max-w-2xl text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-emerald-50/70 sm:text-base">
            {description?.slice(0, 150)}{description?.length > 150 ? "…" : ""}
          </p>

          <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-3">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="mb-1 text-sm font-medium text-emerald-50/50 line-through">{basePrice} {t("EGP")}</span>
              )}
              <span className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {price} <span className="text-base font-medium text-emerald-100/65">{t("EGP")}</span>
              </span>
            </div>
            {hasDiscount && (
              <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-[#e7c58d]/25 bg-[#e7c58d]/10 px-3 py-1.5 text-xs font-bold text-[#f0d7ad]">
                <Tag size={13} />
                {t("Save")} {Math.round((1 - discountPrice / basePrice) * 100)}%
              </span>
            )}
          </div>

          <Link
            to={`/productdetails/${product._id}`}
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-bold text-[#143b32] shadow-[0_12px_30px_rgba(0,0,0,.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200"
          >
            {t("Grab this offer now 🔥")}
            <ArrowUpRight size={17} className={isArabic ? "rotate-[-90deg]" : ""} />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[25rem] md:ms-auto md:me-0">
          <div aria-hidden="true" className="absolute -inset-4 rounded-[2.4rem] border border-white/[0.08] bg-white/[0.025] rotate-3 transition-transform duration-500 group-hover:rotate-1" />
          <div className="relative aspect-[0.92] overflow-hidden rounded-[1.8rem] border border-white/20 bg-white/10 p-2 shadow-[0_28px_70px_rgba(0,0,0,.35)] backdrop-blur-xl">
            <div className="relative h-full overflow-hidden rounded-[1.35rem] bg-[#f2f0e9]">
              <SafeImage
                src={product.imageCover}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#102e28]/30 via-transparent to-white/10" />
            </div>
          </div>
          <div className={`absolute -bottom-4 ${isArabic ? "-left-3 sm:-left-7" : "-right-3 sm:-right-7"} rounded-2xl border border-white/20 bg-[#f8f5ed]/95 px-4 py-3 shadow-xl backdrop-blur-xl`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#668276]">{t("Made with care in Egypt")}</p>
            <p className="mt-0.5 text-sm font-bold text-[#193a32]">{t("A little piece of Egypt,")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
