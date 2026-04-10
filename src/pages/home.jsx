import React from "react";
import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSearch } from "@/context/searchContext";
import Offers from "../components/offers";
import ProductCard from "../components/ui/ProductCard";
import { ArrowLeft } from "lucide-react";

export default function Home() {
  const { data, isLoading, error } = useProducts();
  const { searchTerm } = useSearch();

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

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white w-full overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-6 text-right">
            <h1 className="text-4xl lg:text-6xl font-black leading-tight">
              اكتشف الجودة مع
              <span className="text-yellow-500 block mt-2">
                متجرنا المميز
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-300 max-w-lg">
              أفضل المنتجات بأعلى جودة وبأسعار تنافسية
            </p>

            <Link to="/clothes">
              <Button className="h-14 px-8 text-lg font-bold rounded-full flex items-center gap-2">
                تسوق الآن
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="hidden lg:flex justify-center">
            <img
              src="/logo.png"
              alt="featured"
              className="w-[70%] opacity-90"
            />
          </div>

        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col min-h-[40vh] justify-center items-center gap-4">
            <Spinner className="w-12 h-12" />
            <p>جاري تحميل المنتجات...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex min-h-[40vh] justify-center items-center">
            <p className="text-red-500 font-bold">
              حدث خطأ أثناء تحميل المنتجات
            </p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && (
          <>
            {/* Offers */}
            {searchTerm === "" && (
              <Offers deals={products} />
            )}

            {/* Title */}
            <div className="mt-8 mb-4 flex items-center justify-between">
              <h2 className="text-3xl font-black">
                {searchTerm === "" ? "وصل حديثاً" : "نتائج البحث"}
              </h2>
            </div>

            {/* Products */}
            {searchTerm === "" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold">
                  لا توجد نتائج
                </h3>
                <p className="text-gray-500 mt-2">
                  جرب كلمة بحث مختلفة
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}