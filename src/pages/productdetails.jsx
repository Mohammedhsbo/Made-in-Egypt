import useProductDetails from "@/hooks/useProductDetails";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import RelatedProducts from "./relatedproducts";
import { toast } from "sonner";
import SafeImage from "@/components/ui/safe-image";
import { FALLBACK_IMAGE } from "@/utils/formatImageUrl";
import { useLanguage } from "@/context/language.context";
import api from "@/api/axios.base";
import Breadcrumbs from "@/components/breadcrumbs";
import {
  BookOpen,
  Box,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  Layers,
  ListChecks,
  Maximize2,
  MessageCircle,
  Package,
  Share2,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";

export default function Productdetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useProductDetails(id);
  const { t, isArabic } = useLanguage();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setActiveImageIndex(0);
  }
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedSku, setCopiedSku] = useState(false);
  const [whatsapp, setWhatsapp] = useState(null);

  useEffect(() => {
    api
      .get("/settings/whatsapp")
      .then((res) => setWhatsapp(res.data.data.settings))
      .catch(() => setWhatsapp(null));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const product = data?.data?.product;

  const title = t(
    isArabic
      ? product?.title_ar || product?.title_en || ""
      : product?.title_en || product?.title_ar || "",
  );

  const description = t(
    isArabic
      ? product?.description_ar || product?.description_en || ""
      : product?.description_en || product?.description_ar || "",
  );

  const category = t(
    (isArabic
      ? product?.category?.name_ar || product?.category?.name_en
      : product?.category?.name_en || product?.category?.name_ar) || "",
  );

  const supplierName =
    product?.supplier?.name ||
    (isArabic
      ? product?.brand?.name_ar || product?.brand?.name_en
      : product?.brand?.name_en || product?.brand?.name_ar) ||
    t("Made in Egypt Supplier");

  const productImages = useMemo(() => {
    return [...new Set([product?.imageCover, ...(product?.images || [])].filter(Boolean))];
  }, [product?.imageCover, product?.images]);

  const images = productImages.length ? productImages : [FALLBACK_IMAGE];
  const activeImage = images[activeImageIndex] || images[0];

  const packagingUnit =
    product?.packagingUnit ||
    (/kg|kilogram/i.test(product?.unitOfMeasurement || "") ? "kg" : "carton");

  const measureUnit =
    packagingUnit === "kg"
      ? t("kg")
      : packagingUnit === "carton"
        ? t("Cartons")
        : t("Units");

  const formatMeasure = useCallback(
    (value) =>
      `${Number(value || 0).toLocaleString(isArabic ? "ar-EG" : "en-US")} ${measureUnit}`,
    [isArabic, measureUnit],
  );

  const formatDate = useCallback(
    (value) => {
      if (!value) return t("Not specified");
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    [isArabic, t],
  );

  // Gallery Navigation
  const prevImage = useCallback(
    (e) => {
      e?.stopPropagation();
      setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    },
    [images.length],
  );

  const nextImage = useCallback(
    (e) => {
      e?.stopPropagation();
      setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    },
    [images.length],
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") isArabic ? nextImage() : prevImage();
      if (e.key === "ArrowRight") isArabic ? prevImage() : nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, isArabic, nextImage, prevImage]);

  const copyName = async () => {
    try {
      await navigator.clipboard.writeText(title);
      setCopiedTitle(true);
      toast.success(t("تم نسخ اسم المنتج"));
      setTimeout(() => setCopiedTitle(false), 2000);
    } catch (err) {
      void err;
      toast.error(t("تعذر نسخ اسم المنتج"));
    }
  };

  const copySku = async () => {
    const code = product?.sku || product?._id;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedSku(true);
      toast.success(t("تم نسخ الرمز"));
      setTimeout(() => setCopiedSku(false), 2000);
    } catch (err) {
      void err;
      toast.error(t("تعذر نسخ الرمز"));
    }
  };

  const shareProduct = async () => {
    const shareData = {
      title,
      text: description || title,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        void err;
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(isArabic ? "تم نسخ رابط المنتج" : "Product link copied to clipboard");
      } catch (err) {
        void err;
        toast.error(isArabic ? "تعذر نسخ الرابط" : "Failed to copy link");
      }
    }
  };

  const openWhatsApp = () => {
    if (!whatsapp?.enabled || !whatsapp.internationalPhone) return;
    const details = [
      `• ${t("Product name")}: ${title}`,
      `• ${t("Product ID")}: ${product?._id}`,
      category ? `• ${t("Category")}: ${category}` : null,
      supplierName ? `• ${t("Factory Name")}: ${supplierName}` : null,
      product?.sku ? `• ${t("UPC / SKU")}: ${product.sku}` : null,
      product?.moq != null ? `• ${t("MOQ")}: ${formatMeasure(product.moq)}` : null,
      product?.packagingDetails ? `• ${t("Packaging Details")}: ${product.packagingDetails}` : null,
      `• ${t("Product link")}: ${window.location.origin}/productdetails/${product?._id}`,
    ].filter(Boolean);

    const introduction =
      whatsapp.defaultMessage?.trim() ||
      t("Hello, I would like to know the wholesale price and availability for this product.");
    const message = `${introduction}\n\n📦 ${t("Product details")}:\n${details.join(
      "\n",
    )}\n\n${t("Please send the current wholesale price and availability.")}`;
    window.open(
      `https://wa.me/${whatsapp.internationalPhone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  // Single specifications table rows matching requested layout
  const tableRows = useMemo(() => {
    if (!product) return [];
    const flc20Label =
      packagingUnit === "kg"
        ? "Flc Quantity 20 FT (KG)"
        : packagingUnit === "units" || packagingUnit === "unit"
          ? "Flc Quantity 20 FT (Units)"
          : "Flc Quantity 20 FT (Carton)";

    const flc40Label =
      packagingUnit === "kg"
        ? "Flc Quantity 40 FT HC (KG)"
        : packagingUnit === "units" || packagingUnit === "unit"
          ? "Flc Quantity 40 FT HC (Units)"
          : "Flc Quantity 40 FT HC (Carton)";

    const priceValue =
      product.wholesalePrice != null
        ? product.wholesalePrice
        : product.basePrice != null
          ? product.basePrice
          : 0;

    return [
      ["Main Upc", product.sku || title || "-"],
      ["Factory Name", supplierName || "-"],
      ["Category Name", category || "-"],
      [
        flc20Label,
        product.flcQuantity20ft != null
          ? (typeof product.flcQuantity20ft === "number"
              ? product.flcQuantity20ft.toLocaleString(isArabic ? "ar-EG" : "en-US")
              : String(product.flcQuantity20ft))
          : 0,
      ],
      [
        flc40Label,
        product.flcQuantity40ftHc != null
          ? (typeof product.flcQuantity40ftHc === "number"
              ? product.flcQuantity40ftHc.toLocaleString(isArabic ? "ar-EG" : "en-US")
              : String(product.flcQuantity40ftHc))
          : 0,
      ],
      [
        "Lead Time Min Days",
        product.leadTimeMinDays != null
          ? (typeof product.leadTimeMinDays === "number"
              ? product.leadTimeMinDays.toLocaleString(isArabic ? "ar-EG" : "en-US")
              : String(product.leadTimeMinDays))
          : 0,
      ],
      [
        "Lead Time Max Days",
        product.leadTimeMaxDays != null
          ? (typeof product.leadTimeMaxDays === "number"
              ? product.leadTimeMaxDays.toLocaleString(isArabic ? "ar-EG" : "en-US")
              : String(product.leadTimeMaxDays))
          : 0,
      ],
      ["Price Last Updated", formatDate(product.priceLastUpdated || product.updatedAt)],
      [
        "Last Known Price",
        typeof priceValue === "number"
          ? priceValue.toLocaleString(isArabic ? "ar-EG" : "en-US")
          : String(priceValue),
      ],
    ];
  }, [product, title, supplierName, category, packagingUnit, isArabic, formatDate]);

  const breadcrumbItems = useMemo(() => {
    const items = [{ label: "Home", to: "/" }];
    if (category) {
      items.push({
        label: category,
        to: product?.category?._id ? `/categories/${product.category._id}` : "/#shop-by-category",
      });
    }
    items.push({ label: title || t("Product details") });
    return items;
  }, [category, product, title, t]);

  if (error) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#fbfaf7] px-4 py-12">
        <div
          className="max-w-md w-full rounded-3xl border border-red-200/80 bg-white p-6 sm:p-8 text-center shadow-lg shadow-red-900/5"
          role="alert"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4">
            <X size={28} />
          </div>
          <h2 className="text-lg font-black text-slate-900 mb-2">
            {t("حدث خطأ أثناء جلب بيانات المنتج")}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {isArabic
              ? "تعذر تحميل تفاصيل المنتج. يرجى التحقق من الاتصال بالإنترنت وإعادة المحاولة."
              : "Unable to load product information. Please check your connection and try again."}
          </p>
          <Button
            asChild
            className="w-full rounded-2xl bg-[#1a3a34] py-3 font-bold text-white hover:bg-[#254f46]"
          >
            <Link to="/">{t("Back to home")}</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#fbfaf7] px-4 text-slate-500">
        <div className="relative flex items-center justify-center">
          <Spinner className="h-14 w-14 text-[#1a3a34]" />
        </div>
        <p className="font-bold text-base text-slate-700 animate-pulse">
          {t("جاري تحميل المنتج...")}
        </p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#fbfaf7] px-4 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-[#1a3a34] shadow-md border border-[#e8e2d4]">
          <Package size={36} />
        </div>
        <h2 className="text-2xl font-black text-slate-800">{t("No products found")}</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          {isArabic
            ? "لم نتمكن من العثور على هذا المنتج، قد يكون تم حذفه أو غير متوفر حاليًا."
            : "We could not find this product. It may have been removed or is currently unavailable."}
        </p>
        <Button
          asChild
          className="mt-2 rounded-full bg-[#1a3a34] px-7 py-3 font-bold text-white hover:bg-[#244b42]"
        >
          <Link to="/">{t("Back to home")}</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] pb-28 md:pb-16 text-slate-800" dir={isArabic ? "rtl" : "ltr"}>
      {/* Top Header & Breadcrumbs */}
      <div className="border-b border-[#ece8dd] bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={shareProduct}
              aria-label={t("Share")}
              title={isArabic ? "مشاركة المنتج" : "Share product"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#1a3a34] hover:text-[#1a3a34] hover:bg-slate-50 shadow-xs"
            >
              <Share2 size={16} />
            </button>
            <button
              type="button"
              onClick={copyName}
              aria-label={t("Copy Name")}
              title={isArabic ? "نسخ اسم المنتج" : "Copy product name"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#1a3a34] hover:text-[#1a3a34] hover:bg-slate-50 shadow-xs"
            >
              {copiedTitle ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Main Showcase Hero Section: Split 2-Column Desktop, 1-Column Mobile */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12 items-start">
          {/* Left Column: Product Gallery */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-3">
            {/* Main Image Frame */}
            <div className="relative aspect-square w-full rounded-3xl border border-[#e8e2d4] bg-white p-4 sm:p-6 shadow-sm flex items-center justify-center overflow-hidden group">
              {/* Egyptian Origin Tag */}
              <div className="absolute top-4 start-4 z-10 flex items-center gap-1.5 rounded-full bg-[#1a3a34] px-3 py-1 text-xs font-black text-[#f6f1eb] shadow-md border border-[#c39a62]/30">
                <span className="text-sm">🇪🇬</span>
                <span>{isArabic ? "صنع في مصر" : "Made in Egypt"}</span>
              </div>

              {/* Lightbox Trigger Button */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={isArabic ? "تكبير الصورة" : "Enlarge image"}
                title={isArabic ? "تكبير الصورة" : "Zoom image"}
                className="absolute top-4 end-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-slate-700 shadow-md border border-slate-200 transition hover:bg-white hover:text-[#1a3a34] hover:scale-105"
              >
                <Maximize2 size={16} />
              </button>

              {/* Active Image */}
              <div
                className="h-full w-full flex items-center justify-center cursor-zoom-in select-none"
                onClick={() => setLightboxOpen(true)}
              >
                <SafeImage
                  src={activeImage}
                  alt={title || t("Product")}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Navigation Chevrons if multi-image */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={isArabic ? nextImage : prevImage}
                    aria-label={isArabic ? "الصورة السابقة" : "Previous image"}
                    className="absolute start-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-slate-700 shadow-md border border-slate-200 opacity-90 transition hover:bg-white hover:opacity-100 hover:scale-110 active:scale-95"
                  >
                    <ChevronLeft size={20} className={isArabic ? "rotate-180" : ""} />
                  </button>
                  <button
                    type="button"
                    onClick={isArabic ? prevImage : nextImage}
                    aria-label={isArabic ? "الصورة التالية" : "Next image"}
                    className="absolute end-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-slate-700 shadow-md border border-slate-200 opacity-90 transition hover:bg-white hover:opacity-100 hover:scale-110 active:scale-95"
                  >
                    <ChevronRight size={20} className={isArabic ? "rotate-180" : ""} />
                  </button>

                  {/* Counter Badge */}
                  <div className="absolute bottom-3 end-3 z-10 rounded-full bg-slate-900/75 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip (if multiple images) */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto py-1 px-0.5 no-scrollbar">
                {images.map((img, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl border-2 bg-white p-1 transition-all overflow-hidden ${
                        isActive
                          ? "border-[#1a3a34] ring-2 ring-[#1a3a34]/30 shadow-md scale-95"
                          : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <SafeImage
                        src={img}
                        alt={`${title} - ${idx + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right Column: Product Info & Commerce Actions */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5">
            {/* Factory & Category Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
                {category && (
                  <Link
                    to={product?.category?._id ? `/categories/${product.category._id}` : "#"}
                    className="inline-flex items-center gap-1 rounded-full bg-[#1a3a34]/10 px-3 py-1 text-[#1a3a34] hover:bg-[#1a3a34]/15 transition font-black"
                  >
                    <Layers size={13} />
                    <span>{category}</span>
                  </Link>
                )}

                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  <Building2 size={13} className="text-[#c39a62]" />
                  <span>{supplierName}</span>
                </div>
              </div>

              {/* SKU & HS Code chips */}
              <div className="flex items-center gap-1.5 text-xs">
                {product?.sku && (
                  <button
                    type="button"
                    onClick={copySku}
                    title={isArabic ? "نسخ كود المنتج" : "Copy SKU"}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900 transition"
                  >
                    <span>SKU: {product.sku}</span>
                    {copiedSku ? (
                      <Check size={12} className="text-emerald-600" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                )}
                {product?.hsCode && (
                  <span className="inline-flex items-center rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900 border border-amber-200/60">
                    HS: {product.hsCode}
                  </span>
                )}
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h1
                className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug"
                dir="auto"
              >
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3">
                  {description}
                </p>
              )}
            </div>

            {/* Wholesale Pricing Banner */}
            <div className="rounded-3xl border border-[#c39a62]/30 bg-gradient-to-br from-white via-[#faf8f4] to-[#f4ede0] p-5 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#91733e]">
                    {isArabic ? "أسعار الجملة والتصدير" : "Wholesale & Export Pricing"}
                  </span>
                  <div className="mt-1 flex items-baseline gap-2">
                    {product.wholesalePrice != null && product.wholesalePrice > 0 ? (
                      <>
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          {Number(product.wholesalePrice).toLocaleString(
                            isArabic ? "ar-EG" : "en-US",
                          )}
                        </span>
                        <span className="text-sm font-bold text-slate-600">
                          {isArabic ? "ج.م / " : "EGP / "}
                          {measureUnit}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl sm:text-2xl font-black text-[#1a3a34]">
                        {isArabic ? "الأسعار متاحة عند الطلب" : "Price on Request (RFQ)"}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {isArabic
                      ? "خصومات وكميات إضافية متوفرة للشحنات الكاملة FLC 20FT / 40FT HC"
                      : "Volume discounts available for container orders (FLC 20FT / 40FT HC)"}
                  </p>
                </div>

                <div className="text-start sm:text-end shrink-0">
                  <span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-600 border border-[#e8e2d4] shadow-2xs">
                    {t("Price Last Updated")}:{" "}
                    {formatDate(product.priceLastUpdated || product.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Product actions */}
            <div className="flex w-4/5 flex-wrap items-center gap-3 pt-1">
              {whatsapp?.enabled && whatsapp.internationalPhone && (
                <Button
                  type="button"
                  onClick={openWhatsApp}
                  className="h-12 min-w-[168px] flex-1 gap-2 rounded-xl border border-[#bda875] bg-gradient-to-br from-[#285344] to-[#14342c] px-5 text-sm font-black text-white shadow-lg shadow-[#193b34]/20 transition hover:-translate-y-0.5 hover:from-[#356653] hover:to-[#1a4035] hover:shadow-xl active:translate-y-0"
                >
                  <MessageCircle size={18} className="shrink-0" />
                  <span>{t("Contact seller")}</span>
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("product-specifications")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="h-12 min-w-[132px] flex-1 rounded-xl border border-[#e2d7be] bg-gradient-to-br from-white to-[#f7f3e9] px-4 text-xs font-extrabold text-[#234238] shadow-sm transition hover:-translate-y-0.5 hover:border-[#bda875] hover:shadow-md active:translate-y-0"
              >
                <ListChecks size={15} />
                <span>{t("Specifications")}</span>
              </Button>

              {product?.datasheetUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 min-w-[132px] flex-1 rounded-xl border border-[#e2d7be] bg-gradient-to-br from-white to-[#f7f3e9] px-4 text-xs font-extrabold text-[#234238] shadow-sm transition hover:-translate-y-0.5 hover:border-[#bda875] hover:shadow-md active:translate-y-0"
                >
                  <a href={product.datasheetUrl} target="_blank" rel="noreferrer">
                    <FileText size={15} />
                    <span>{t("Datasheet")}</span>
                    <ExternalLink size={12} className="opacity-60" />
                  </a>
                </Button>
              )}

              {product?.catalogUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 min-w-[132px] flex-1 rounded-xl border border-[#e2d7be] bg-gradient-to-br from-white to-[#f7f3e9] px-4 text-xs font-extrabold text-[#234238] shadow-sm transition hover:-translate-y-0.5 hover:border-[#bda875] hover:shadow-md active:translate-y-0"
                >
                  <a href={product.catalogUrl} target="_blank" rel="noreferrer">
                    <BookOpen size={15} />
                    <span>{t("Catalog")}</span>
                    <ExternalLink size={12} className="opacity-60" />
                  </a>
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={copyName}
                className="h-12 min-w-[132px] flex-1 rounded-xl border border-[#e2d7be] bg-gradient-to-br from-white to-[#f7f3e9] px-4 text-xs font-extrabold text-[#234238] shadow-sm transition hover:-translate-y-0.5 hover:border-[#bda875] hover:shadow-md active:translate-y-0"
              >
                {copiedTitle ? (
                  <Check size={15} className="text-emerald-600" />
                ) : (
                  <Copy size={15} />
                )}
                <span>{copiedTitle ? t("تم نسخ اسم المنتج") : t("Copy Name")}</span>
              </Button>
            </div>

            {/* B2B Trust Highlights Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e8e2d4] bg-white p-3 text-center shadow-2xs">
                <ShieldCheck size={20} className="text-[#c39a62] mb-1" />
                <span className="text-[11px] font-black text-slate-800 leading-tight">
                  {isArabic ? "مصنع معتمد" : "Verified Factory"}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {isArabic ? "فحص الجودة" : "Quality Inspected"}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e8e2d4] bg-white p-3 text-center shadow-2xs">
                <Truck size={20} className="text-[#1a3a34] mb-1" />
                <span className="text-[11px] font-black text-slate-800 leading-tight">
                  {isArabic ? "جاهز للتصدير" : "Export Ready"}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {isArabic ? "حاويات FLC" : "FLC Containers"}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e8e2d4] bg-white p-3 text-center shadow-2xs">
                <Package size={20} className="text-[#c39a62] mb-1" />
                <span className="text-[11px] font-black text-slate-800 leading-tight">
                  {isArabic ? "سعر الجملة" : "Wholesale Rates"}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {isArabic ? "مباشرة من المصنع" : "Direct Manufacturer"}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e8e2d4] bg-white p-3 text-center shadow-2xs">
                <Globe size={20} className="text-[#1a3a34] mb-1" />
                <span className="text-[11px] font-black text-slate-800 leading-tight">
                  {isArabic ? "شحن دولي" : "Global Shipping"}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {isArabic ? "جمارك وتخليص" : "Customs Compliant"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Specifications Single Table Section */}
        <section
          id="product-specifications"
          className="mt-12 sm:mt-16 rounded-3xl border border-[#e8e2d4] bg-white shadow-sm overflow-hidden"
          aria-labelledby="product-specifications-title"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-start">
              <tbody className="divide-y divide-slate-100">
                {tableRows.map(([name, value], idx) => (
                  <tr
                    key={name}
                    className={`transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-[#fcfbf9]"
                    } hover:bg-slate-50`}
                  >
                    <th
                      scope="row"
                      className="px-4 py-4 sm:px-8 text-right text-sm sm:text-base font-bold text-slate-700 w-1/2 sm:w-2/5"
                    >
                      {t(name)}
                    </th>
                    <td
                      className="px-4 py-4 sm:px-8 text-right text-sm sm:text-base font-black text-slate-900 break-words"
                      dir="auto"
                    >
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Related Products Section */}
        <section className="mt-14 sm:mt-20 lg:mt-0 lg:-mx-8">
          <RelatedProducts />
        </section>
      </div>

      {/* Floating Mobile Action Bar (Fixed at bottom on phones < md) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-4 py-2.5 flex items-center justify-between gap-3 md:hidden">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-0.5">
            <SafeImage src={activeImage} alt={title} className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-slate-900 truncate leading-tight">{title}</p>
            <p className="text-[11px] font-bold text-[#1a3a34] leading-tight">
              {product.moq != null ? `${t("MOQ")}: ${formatMeasure(product.moq)}` : measureUnit}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {whatsapp?.enabled && whatsapp.internationalPhone && (
            <button
              type="button"
              onClick={openWhatsApp}
              aria-label={t("Contact seller")}
              className="flex h-11 items-center gap-2 rounded-2xl bg-[#25D366] text-white font-black text-xs px-4 shadow-md transition active:scale-95"
            >
              <MessageCircle size={18} />
              <span>{t("Contact seller")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox Modal (Fullscreen Zoom Preview) */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Header Bar */}
          <div
            className="absolute top-4 inset-x-4 flex items-center justify-between z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs">
              {activeImageIndex + 1} / {images.length}
            </span>

            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label={t("Close")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white hover:text-black transition backdrop-blur-xs"
            >
              <X size={20} />
            </button>
          </div>

          {/* Large Image Container */}
          <div
            className="relative flex max-h-[85vh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage
              src={activeImage}
              alt={title}
              className="max-h-[80vh] max-w-[85vw] object-contain select-none"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={isArabic ? nextImage : prevImage}
                  aria-label={isArabic ? "الصورة السابقة" : "Previous image"}
                  className="absolute start-0 -translate-x-3 sm:-translate-x-12 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white hover:text-black transition backdrop-blur-xs shadow-lg"
                >
                  <ChevronLeft size={24} className={isArabic ? "rotate-180" : ""} />
                </button>
                <button
                  type="button"
                  onClick={isArabic ? prevImage : nextImage}
                  aria-label={isArabic ? "الصورة التالية" : "Next image"}
                  className="absolute end-0 translate-x-3 sm:translate-x-12 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white hover:text-black transition backdrop-blur-xs shadow-lg"
                >
                  <ChevronRight size={24} className={isArabic ? "rotate-180" : ""} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
