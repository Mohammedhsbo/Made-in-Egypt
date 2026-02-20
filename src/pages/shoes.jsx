import { Button } from '@/components/ui/button';
import { useSearch } from '@/context/searchContext';
import useProducts from '@/hooks/useProducts';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Shoes() {
  const { searchTerm } = useSearch();
  const { data, isLoading, error } = useProducts();
const products = data?.data || [];
  const filteredProducts = products.filter(product =>
    product.subcategory?.some(sub => sub.name === "Cameras & Accessories")
  );

  const displayedProducts = filteredProducts?.filter((p) =>
    p.title.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  // تحديد المنتجات اللي هتظهر
  const productsToShow = searchTerm === "" ? filteredProducts : displayedProducts;

  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <h2 className="flex min-h-screen justify-center items-center text-red-700 text-3xl font-bold">
        حدث خطأ اثناء تحميل المنتجات
      </h2>
    );
  }

  if (!productsToShow || productsToShow.length === 0) {
    return (
      <p className="flex min-h-screen justify-center items-center text-red-700 text-3xl font-bold">
        لا يوجد منتجات
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
      {productsToShow.map((product) => (
        <div key={product._id} className="border p-4 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="w-full h-40 object-cover rounded mb-2"
          />
          <p className="mt-2 font-semibold">{product.title}</p>
          <p className="text-gray-600 text-sm">{product.description.slice(0, 100)}</p>
          <p className="text-gray-600 font-bold">{product.price} EGP</p>
          <Link to={`/productdetails/${product._id}`}>
          <Button className="mt-4">اعرض المنتج</Button>
          </Link>
          
        </div>
      ))}
    </div>
  );
}