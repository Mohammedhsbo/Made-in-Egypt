import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }) {
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      // Extract file ID from various Google Drive URL formats
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
    return url;
  };

  const image = getImageUrl(product?.imageCover) || getImageUrl(product?.images?.[0]);

  const title =
    product?.title_en ||
    product?.title_ar ||
    "بدون عنوان";

  const description =
    product?.description_en ||
    product?.description_ar ||
    "";

  return (
    <div className="group relative border border-gray-100 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">

      {/* Image */}
      <Link
        to={`/productdetails/${product?._id}`}
        className="block relative aspect-square overflow-hidden bg-gray-50"
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
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

          <p className="text-xl font-bold text-gray-900">
            {product?.basePrice || 0}{" "}
            <span className="text-sm font-normal text-gray-500">
              EGP
            </span>
          </p>

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