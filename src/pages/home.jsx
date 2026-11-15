import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import useProducts from "../hooks/useProducts";
import { Spinner } from "@/components/ui/spinner";
import { useSearch } from "@/context/searchContext";
import Offers from "../components/offers";
import ProductCard from "../components/ui/ProductCard";
import SafeImage from "@/components/ui/safe-image";
import api from "@/api/axios.base";
import { getAllCategoriesRequest } from "@/services/category.service";
import { getAllBrandsRequest } from "@/services/brand.service";
import { formatImageUrl } from "@/utils/formatImageUrl";
import { useLanguage } from "@/context/language.context";

export default function Home() {
  const { data, isLoading, error } = useProducts();
  const { searchTerm } = useSearch();
  const { t, isArabic } = useLanguage();
  const { data: featuredProductResponse } = useQuery({
    queryKey: ["featured-product"],
    queryFn: async () => {
      const response = await api.get("/products", { params: { isFeatured: true, limit: 1 } });
      return response.data;
    },
  });
  const { data: categoryResponse, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategoriesRequest,
  });
  const { data: brandResponse, isLoading: brandsLoading, isError: brandsError } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrandsRequest,
  });
  const categories = categoryResponse?.data?.data?.categories || [];
  const brands = brandResponse?.data?.data?.brands || [];
  const featuredProduct = featuredProductResponse?.data?.products?.[0];

  // ✅ حماية البيانات من الـ undefined
  const products = data?.data?.products || [];

  // ✅ البحث الآمن (يدعم عربي + إنجليزي)
  const filteredProducts = products.filter((product) => {
    const title =
      product.title_en ||
      product.title_ar ||
      "";

    return title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-screen-2xl space-y-6 px-3 py-6 sm:space-y-10 sm:px-5 sm:py-10 lg:space-y-12 lg:px-8 2xl:px-12">
        <section id="shop-by-category" className="scroll-mt-36 rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-[0_18px_55px_rgba(26,58,52,0.07)] backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">{t("Find your favorites")}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{t("Shop by category")}</h2>
            </div>
          </div>
          {categoriesLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 4 }, (_, index) => <div key={index} className="aspect-[0.82] animate-pulse rounded-2xl bg-slate-100" />)}
            </div>
          ) : categoriesError ? (
            <p className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{t("Categories could not be loaded. Please try again later.")}</p>
          ) : categories.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/categories/${category._id}`}
                  className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#c39a62]/50 hover:shadow-xl"
                >
                  <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-[#f7f3ed] via-white to-[#edf4f0] p-3 sm:p-5">
                    {category.icon ? (
                      <img src={formatImageUrl(category.icon)} alt={t((isArabic ? category.name_ar || category.name_en : category.name_en || category.name_ar) || "")} loading="lazy" decoding="async" className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
                    ) : (
                      <ImageIcon aria-hidden="true" size={40} strokeWidth={1.2} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex min-h-14 items-center justify-center bg-gradient-to-r from-[#faf8f4] to-[#f0f5f2] px-3 py-3 text-center">
                    <span className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors group-hover:text-[var(--primary)] sm:text-base">
                      {t((isArabic ? category.name_ar || category.name_en : category.name_en || category.name_ar) || "")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">{t("No categories are available right now.")}</p>
          )}
        </section>

        <section id="shop-by-brand" className="scroll-mt-36 rounded-[2rem] border border-white/80 bg-white/75 p-3 shadow-[0_18px_55px_rgba(26,58,52,0.07)] backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">{t("Discover trusted labels")}</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{t("Shop by brand")}</h2>
          </div>
          {brandsLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded-3xl bg-slate-100" />)}
            </div>
          ) : brandsError ? (
            <p className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{t("Brands could not be loaded. Please try again later.")}</p>
          ) : brands.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {brands.map((brand) => {
                const brandName = isArabic ? brand.name_ar || brand.name_en : brand.name_en || brand.name_ar;
                return (
                  <Link
                    key={brand._id}
                    to={`/brands/${encodeURIComponent(brand.slug)}`}
                    className="group flex min-h-24 items-center gap-3 rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white to-[#f3f6f2] p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#c39a62]/50 hover:shadow-lg sm:gap-4 sm:p-4"
                  >
                    {brand.logoUrl ? (
                      <SafeImage
                        src={brand.logoUrl}
                        alt=""
                        loading="lazy"
                        className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-1.5 shadow-sm sm:h-14 sm:w-14"
                      />
                    ) : (
                      <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[#54836f] text-sm font-black uppercase text-white shadow-md sm:h-14 sm:w-14">
                        {(brand.name_en || brand.name_ar || "?").trim().slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-[var(--primary)] sm:text-base">{brandName}</span>
                    </span>
                    <ArrowRight aria-hidden="true" size={16} className="ms-auto shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--primary)]" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">{t("No brands are available right now.")}</p>
          )}
        </section>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-[2rem] border border-slate-200/70 bg-white/75 p-8 shadow-sm">
            <Spinner className="w-12 h-12" />
            <p>{t("Loading products…")}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex min-h-[40vh] items-center justify-center rounded-[2rem] border border-rose-100 bg-white/80 p-8 shadow-sm">
            <p className="font-bold text-red-500">{t("Products could not be loaded.")}</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && (
          <>
            {/* Offers */}
            {searchTerm === "" && <Offers deals={featuredProduct ? [featuredProduct] : []} />}

            {/* Title */}
            <section className="rounded-[2rem] border border-white/80 bg-white/75 p-3 shadow-[0_18px_55px_rgba(26,58,52,0.07)] backdrop-blur-xl sm:p-6 lg:p-8">
              <div className="mb-6 border-b border-slate-200/80 pb-5">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  {searchTerm === "" ? t("New arrivals") : t("Search results")}
                </h2>
                <div aria-hidden="true" className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#c39a62]" />
              </div>

              {searchTerm === "" ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl bg-gradient-to-br from-[#f8f5ef] to-[#eff5f1] px-6 py-20 text-center">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {t("No results found")}
                  </h3>
                  <p className="mt-2 text-slate-500">
                    {t("Try a different search term.")}
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}