import React from 'react';
import useProducts from '@/hooks/useProducts';
import { useSearch } from '@/context/searchContext';
import { Spinner } from '@/components/ui/spinner';
import ProductCard from '../components/ui/ProductCard';

export default function Socks() {
  const { data, isLoading, error } = useProducts();
  const { searchTerm } = useSearch();

  const products = data?.data?.products || [];

  const filteredProducts = products.filter(product => {
    const catName = product.category?.name_en || product.category?.name_ar || "";
    return catName.toLowerCase().includes("sock") || catName.includes("جورب") || catName.includes("جوارب");
  });

  const displayedProducts = filteredProducts.filter(product => {
    const title = product.title_ar || product.title_en || "";
    return title.toLowerCase().includes(searchTerm?.toLowerCase() || "");
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-black text-slate-800">الجوارب</h1>
        <p className="text-muted-foreground mt-2">تشكيلة واسعة من الجوارب لكافة الأعمار والاستخدامات</p>
      </div>

      {isLoading && (
        <div className="flex flex-col min-h-[40vh] justify-center items-center gap-4">
          <Spinner className="w-12 h-12 text-primary" />
          <p className="text-muted-foreground font-medium text-lg">جاري التحميل...</p>
        </div>
      )}

      {error && (
        <div className="flex min-h-[40vh] justify-center items-center">
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 font-bold text-center">
            حدث خطأ أثناء تحميل المنتجات.
          </div>
        </div>
      )}

      {!isLoading && !error && displayedProducts.length === 0 && (
        <div className="flex flex-col min-h-[30vh] justify-center items-center gap-4 py-12">
          <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mb-4 text-4xl">
            🧦
          </div>
          <h3 className="text-2xl font-bold text-gray-700">لا يوجد منتجات</h3>
          <p className="text-gray-500">عذراً، لا يوجد منتجات متاحة في هذا القسم حالياً.</p>
        </div>
      )}

      {!isLoading && !error && displayedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayedProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}