import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ProductCard from "@/components/ui/ProductCard";
import { Spinner } from "@/components/ui/spinner";
import SafeImage from "@/components/ui/safe-image";
import { useLanguage } from "@/context/language.context";
import { getBrandProductsRequest, getBrandRequest } from "@/services/brand.service";

export default function BrandProducts() {
  const { slug } = useParams();
  const { t, isArabic } = useLanguage();
  const brandQuery = useQuery({
    queryKey: ["brand", slug],
    queryFn: () => getBrandRequest(slug),
  });
  const productsQuery = useQuery({
    queryKey: ["brand-products", slug],
    queryFn: () => getBrandProductsRequest(slug),
  });

  const brand = brandQuery.data?.data?.data?.brand;
  const products = productsQuery.data?.data?.data?.products || [];
  const brandName = isArabic ? brand?.name_ar || brand?.name_en : brand?.name_en || brand?.name_ar;

  if (brandQuery.isLoading || productsQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <Spinner className="h-10 w-10" />
        <p className="text-sm text-slate-500">{t("Loading brand products…")}</p>
      </div>
    );
  }

  if (brandQuery.isError || productsQuery.isError || !brand) {
    return (
      <div className="mx-auto my-12 max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <h1 className="text-2xl font-bold text-slate-900">{t("Brand unavailable")}</h1>
        <p className="mt-2 text-slate-500">{t("This brand may have been removed or hidden.")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-3 py-8 sm:px-5 sm:py-12 lg:px-8 2xl:px-12">
      <section className="mb-8 rounded-[2rem] border border-white/80 bg-gradient-to-br from-[#f7f3ed] via-white to-[#edf4f0] p-6 text-center shadow-[0_18px_55px_rgba(26,58,52,0.08)] sm:p-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">{t("Shop by brand")}</p>
        {brand.logoUrl && (
          <SafeImage
            src={brand.logoUrl}
            alt=""
            className="mx-auto mt-4 h-20 w-20 rounded-2xl border border-slate-200 bg-white p-2 object-contain shadow-sm"
          />
        )}
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{brandName}</h1>
        <p className="mt-2 text-sm text-slate-500">{t("Browse products from this brand.")}</p>
      </section>

      {products.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-6">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">{t("No products from this brand yet.")}</h2>
          <p className="mt-2 text-slate-500">{t("Check back soon for new arrivals.")}</p>
        </div>
      )}
    </div>
  );
}
