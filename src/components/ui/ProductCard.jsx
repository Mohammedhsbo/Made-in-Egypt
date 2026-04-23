import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SafeImage from "@/components/ui/safe-image";
import { getProductImageUrl } from "@/utils/formatImageUrl";


export default function ProductCard({ product }) {
  const image = getProductImageUrl(product);


  const title =
    product?.title_ar ||
    product?.title_en ||
    "بدون عنوان";

  const description =
    product?.description_ar ||
    product?.description_en ||
    "";

  return (
    <div className="group relative border border-gray-100 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">

      {/* Image */}
      <Link
        to={`/productdetails/${product?._id}`}
        className="block relative aspect-square overflow-hidden bg-gray-50"
      >
        <SafeImage
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Sale Badge */}
        {product?.priceAfterDiscount > 0 && product?.priceAfterDiscount < product?.basePrice && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] uppercase font-black px-2 py-1 rounded-full shadow-lg z-10">
            خصم
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">

        <Link to={`/productdetails/${product?._id}`}>
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2 hover:text-black transition">
            {title}
          </h3>
        </Link>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {description.slice(0, 90)}
        </p>

        {/* Bottom */}
        <div className="mt-auto flex items-center justify-between">

          <div className="flex flex-col">
            {product?.priceAfterDiscount > 0 && product?.priceAfterDiscount < product?.basePrice ? (
              <>
                <p className="text-xl font-bold text-red-600">
                  {product.priceAfterDiscount}{" "}
                  <span className="text-sm font-normal">EGP</span>
                </p>
                <p className="text-sm text-gray-400 line-through">
                  {product.basePrice} EGP
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-gray-900">
                {product?.basePrice || 0}{" "}
                <span className="text-sm font-normal text-gray-500">
                  EGP
                </span>
              </p>
            )}
          </div>

          <Link to={`/productdetails/${product?._id}`}>
            <Button
              size="sm"
              className="rounded-full bg-black text-white hover:bg-gray-800 transition"
            >
              عرض المنتج
            </Button>
          </Link>

        </div>
      </div>
    </div>
  );
}