import React from "react";
import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSearch } from "@/context/searchContext";
import Offers from "../components/offers";

export default function Home() {
  let { data, isLoading, error } = useProducts();
  const { searchTerm } = useSearch();
  const filteredProducts = data?.data?.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
<div>
   <div className="max-w-7xl mx-auto p-4">
      {/* Banner تعريفى */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-8 mb-8 text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-2">مرحبا بك في متجرنا!</h1>
        <p className="text-lg">أفضل المنتجات بأعلى جودة وبأسعار ممتازة</p>
      </div>
     {!isLoading && !error && (
       <Offers deals={data?.data} />
     )}
  {isLoading && (
    <div className="flex min-h-screen justify-center items-center">
      <Spinner className="size-10" />
    </div>
  )}
  {error && (
    <h2 className='flex min-h-screen justify-center items-center text-red-700 text-3xl font-bold'>
     حدث خطأ اثناء تحميل المنتجات
    </h2>
  )}
  {!isLoading && !error && (
    searchTerm === "" ? (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        {data?.data?.map((product) => (
          
          <div
            key={product._id}
            className="border p-4 rounded-lg text-center hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={product.imageCover || product.images[0]}
              alt={product.title}
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="text-lg font-semibold mb-2 text-center">
              {product.title}
            </h3>
            <p className="text-center py-2">
              {product.description.slice(0, 100)}
            </p>
            <p className="text-gray-600 mb-4"> {product.price} EGP </p>

            <Link  to={`/productdetails/${product._id}` } >
              <Button >اعرض المنتج</Button>
            </Link>
          </div>
        ))}
      </div>
    ) : filteredProducts?.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        {filteredProducts?.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={product.imageCover || product.images[0]}
              alt={product.title}
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="text-lg font-semibold mb-2 text-center">
              {product.title}
            </h3>
            <p className="text-center py-2">
              {product.description.slice(0, 100)}
            </p>
            <p className="text-gray-600 mb-4">${product.price}</p>

            <Link to={`/productdetails/${product._id}`}>
              <Button >اعرض المنتج</Button>
            </Link>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex min-h-screen justify-center items-center">
        <h2 className="text-center text-red-500 text-2xl">لا يوجد نتائج</h2>
      </div>
    )
  )}
</div>
</div>

  );
}
