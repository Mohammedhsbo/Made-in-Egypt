import React from "react";
import { Link } from "react-router-dom";
import SafeImage from "@/components/ui/safe-image";
import { getProductImageUrl } from "@/utils/formatImageUrl";
import { useLanguage } from "@/context/language.context";

export default function ProductCard({ product }) {
  const { t, isArabic } = useLanguage();
  const title = t(isArabic
    ? product?.title_ar || product?.title_en
    : product?.title_en || product?.title_ar);
  const categoryName = t(isArabic
    ? product?.category?.name_ar || product?.category?.name_en
    : product?.category?.name_en || product?.category?.name_ar);
  const sellerName = product?.supplier?.name
    || (isArabic
      ? product?.brand?.name_ar || product?.brand?.name_en
      : product?.brand?.name_en || product?.brand?.name_ar);

  return (
    <Link to={`/productdetails/${product?._id}`} className="sodu-product-card">
      <div className="sodu-product-image">
        <SafeImage
          src={getProductImageUrl(product)}
          alt={title}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="sodu-product-body">
        <p className="sodu-product-meta">
          {categoryName || t("Products")}
        </p>
        <h3 className="sodu-product-name">{title || t("Untitled")}</h3>
        {sellerName && (
          <p className="sodu-product-seller">
            {t("Sold by")}: {sellerName}
          </p>
        )}
        <span className="sodu-product-cta">{t("View details")}</span>
      </div>
    </Link>
  );
}
