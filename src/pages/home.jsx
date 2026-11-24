import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Image as ImageIcon, Search } from "lucide-react";
import useProducts from "../hooks/useProducts";
import { Spinner } from "@/components/ui/spinner";
import { useSearch } from "@/context/searchContext";
import ProductCard from "../components/ui/ProductCard";
import SafeImage from "@/components/ui/safe-image";
import { getAllCategoriesRequest } from "@/services/category.service";
import { getAllBrandsRequest } from "@/services/brand.service";
import { formatImageUrl } from "@/utils/formatImageUrl";
import { useLanguage } from "@/context/language.context";

export default function Home() {
  const { data, isLoading, error } = useProducts();
  const { searchTerm, setSearchTerm } = useSearch();
  const { t, isArabic } = useLanguage();
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
  // ✅ حماية البيانات من الـ undefined
  const products = data?.data?.products || [];

  // ✅ البحث الآمن (يدعم عربي + إنجليزي)
  const filteredProducts = products.filter((product) => {
    const haystack = [
      product.title_en,
      product.title_ar,
      product.description_en,
      product.description_ar,
    ].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(searchTerm.trim().toLowerCase());
  });

  return (
    <div className="w-full bg-white">
      <div className="sodu-catalogue-wrap">
        <div className="sodu-search">
          <Search size={20} aria-hidden="true" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("Search products...")}
            aria-label={t("Search products...")}
          />
        </div>
        <section id="shop-by-category" className="sodu-home-section">
          <h2 className="sodu-section-title">{t("Shop by category")}</h2>
          {categoriesLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 4 }, (_, index) => <div key={index} className="aspect-[0.82] animate-pulse rounded-2xl bg-slate-100" />)}
            </div>
          ) : categoriesError ? (
            <p className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{t("Categories could not be loaded. Please try again later.")}</p>
          ) : categories.length ? (
            <div className="sodu-category-grid">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/categories/${category._id}`}
                  className="sodu-category-card"
                >
                  <div className="sodu-category-image">
                    {category.icon ? (
                      <img src={formatImageUrl(category.icon)} alt={t((isArabic ? category.name_ar || category.name_en : category.name_en || category.name_ar) || "")} loading="lazy" decoding="async" className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
                    ) : (
                      <ImageIcon aria-hidden="true" size={40} strokeWidth={1.2} className="text-slate-300" />
                    )}
                  </div>
                  <div className="sodu-category-name">
                    <span>
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

        <section id="shop-by-brand" className="sodu-home-section">
          <h2 className="sodu-section-title">{t("Shop by brand")}</h2>
          {brandsLoading ? (
            <div className="sodu-brand-row">
              {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded-3xl bg-slate-100" />)}
            </div>
          ) : brandsError ? (
            <p className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{t("Brands could not be loaded. Please try again later.")}</p>
          ) : brands.length ? (
            <div className="sodu-brand-row">
              {brands.map((brand) => {
                const brandName = isArabic ? brand.name_ar || brand.name_en : brand.name_en || brand.name_ar;
                return (
                  <Link
                    key={brand._id}
                    to={`/brands/${encodeURIComponent(brand.slug)}`}
                    className="sodu-brand-card"
                  >
                    {brand.logoUrl ? (
                      <SafeImage
                        src={brand.logoUrl}
                        alt=""
                        loading="lazy"
                        className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-1.5 shadow-sm sm:h-14 sm:w-14"
                      />
                    ) : (
                      <span aria-hidden="true" className="sodu-brand-fallback">
                        {(brand.name_en || brand.name_ar || "?").trim().slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className="sodu-brand-name">{brandName}</span>
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
            {/* Title */}
            <section className="sodu-home-section">
              <div>
                <h2 className="sodu-section-title">
                  {searchTerm === "" ? t("New arrivals") : t("Search results")}
                </h2>
              </div>

              {searchTerm === "" ? (
                <div className="sodu-product-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="sodu-product-grid">
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