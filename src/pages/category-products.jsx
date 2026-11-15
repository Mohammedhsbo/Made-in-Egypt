import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import ProductCard from "@/components/ui/ProductCard";
import api from "@/api/axios.base";
import { useSearch } from "@/context/searchContext";
import { useLanguage } from "@/context/language.context";

export default function CategoryProducts() {
  const { id } = useParams();
  const { searchTerm } = useSearch();
  const { t } = useLanguage();
  const categoryQuery = useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const response = await api.get(`/categories/${id}`);
      return response.data.data.category;
    },
  });
  const category = categoryQuery.data;
  const productsQuery = useQuery({
    queryKey: ["category-products", category?.fullSlug],
    queryFn: async () => {
      const response = await api.get("/products", {
        params: { categorySlug: category.fullSlug || category.slug },
      });
      return response.data.data.products;
    },
    enabled: Boolean(category),
  });
  const products = (productsQuery.data || []).filter((product) => {
    if (!searchTerm) return true;
    const title = `${product.title_en || ""} ${product.title_ar || ""}`.toLowerCase();
    return title.includes(searchTerm.toLowerCase());
  });

  if (categoryQuery.isLoading) {
    return <div className="flex min-h-[45vh] items-center justify-center"><Spinner className="h-10 w-10 text-[#26716c]" /></div>;
  }
  if (categoryQuery.isError || !category) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">{t("Category unavailable")}</h1>
        <p className="mt-2 text-slate-500">{t("This category may have been removed or hidden.")}</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#26716c]"><ArrowLeft size={16} /> {t("Back to home")}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#26716c]">
        <ArrowLeft size={16} /> {t("All categories")}
      </Link>

      <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-xl font-semibold text-slate-900">{t("Products")}</h2>
        {!productsQuery.isLoading && !productsQuery.isError && <p className="text-sm text-slate-500">{products.length} {t("items")}</p>}
      </div>

      {productsQuery.isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center"><Spinner className="h-10 w-10 text-[#26716c]" /></div>
      ) : productsQuery.isError ? (
        <p className="rounded-xl border border-rose-100 bg-rose-50 p-5 text-rose-700">{t("Products could not be loaded. Please try again later.")}</p>
      ) : products.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-6">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-16 text-center">
          <h3 className="text-lg font-semibold text-slate-800">{searchTerm ? t("No matching products") : t("No products here yet")}</h3>
          <p className="mt-2 text-sm text-slate-500">{searchTerm ? t("Try another search.") : t("Check back soon for new arrivals.")}</p>
        </div>
      )}
    </div>
  );
}
