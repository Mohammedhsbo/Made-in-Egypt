import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import SafeImage from "@/components/ui/safe-image";
import { getProductImageUrl } from "@/utils/formatImageUrl";
import { useLanguage } from "@/context/language.context";

export default function ProductCard({ product }) {
  const { t, isArabic } = useLanguage();
  const image = getProductImageUrl(product);

  const rawTitle = isArabic
    ? product?.title_ar || product?.title_en
    : product?.title_en || product?.title_ar;
  const title = t(rawTitle || t("بدون عنوان"));

  const rawDescription = isArabic
    ? product?.description_ar || product?.description_en
    : product?.description_en || product?.description_ar;
  const description = t(rawDescription || "");

  const hasDiscount = product?.priceAfterDiscount > 0 && product?.priceAfterDiscount < product?.basePrice;
  const showSaleLabel = product?.isOnSale ?? hasDiscount;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-[#f1e7d7] bg-gradient-to-b from-white via-[#fffdfb] to-[#f5f1ea] shadow-[0_16px_40px_rgba(26,58,52,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_55px_rgba(26,58,52,0.14)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />

      <Link to={`/productdetails/${product?._id}`} className="relative block overflow-hidden p-3 pb-0">
        <div className="relative overflow-hidden rounded-[24px] bg-[#f2eee9] ring-1 ring-black/5">
          <SafeImage
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />

          {showSaleLabel && (
            <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[#b42318] to-[#e34d3d] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-lg shadow-rose-200/80">
              SALE
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 pt-3">
        <Link to={`/productdetails/${product?._id}`} className="block">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-black leading-snug text-slate-900 transition-colors group-hover:text-[#26716c] sm:min-h-[3.25rem] sm:text-lg">
            {title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
          {description.slice(0, 90) || t("منتج فاخر مختار بعناية.")}
        </p>

        <div className="mt-auto flex flex-col items-stretch gap-3 pt-4">
          <div className="flex min-h-12 flex-col justify-end">
            {hasDiscount ? (
              <>
                <span className="flex w-fit items-baseline gap-1.5 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-2.5 py-1 text-xl font-black leading-none tracking-tight text-[#17665e] shadow-sm sm:text-2xl">
                  {product.priceAfterDiscount}
                  <span className="rounded-md bg-white/80 px-1 py-0.5 text-[9px] font-extrabold tracking-wider text-emerald-800">EGP</span>
                </span>
                <span className="mt-1 text-xs font-medium text-slate-400 line-through">
                  {product.basePrice} EGP
                </span>
              </>
            ) : (
              <span className="flex w-fit items-baseline gap-1.5 rounded-xl border border-[#e8e2d7] bg-gradient-to-r from-[#f7f3ed] to-white px-2.5 py-1 text-xl font-black leading-none tracking-tight text-[#1f2a37] shadow-sm sm:text-2xl">
                {product?.basePrice || 0}
                <span className="rounded-md bg-white/80 px-1 py-0.5 text-[9px] font-extrabold tracking-wider text-slate-500">EGP</span>
              </span>
            )}
          </div>

          <Link to={`/productdetails/${product?._id}`} className="w-full">
            <Button
              size="sm"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#26716c] to-[#1f5a55] px-4 text-sm font-bold text-white shadow-[0_10px_20px_rgba(38,113,108,0.24)] transition-all duration-200 hover:scale-[1.02] hover:from-[#1f5a55] hover:to-[#174943] hover:shadow-[0_16px_26px_rgba(38,113,108,0.3)]"
            >
              <ShoppingBag size={16} />
              {t("عرض المنتج")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}