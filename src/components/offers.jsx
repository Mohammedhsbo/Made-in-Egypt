import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TodaysDealCard({ deals }) {
  if (!deals || deals.length === 0) return null;

  const product = deals[0];

  return (
    <div className="relative bg-gradient-to-r from-blue-100 via-teal-100 to-green-100 rounded-2xl p-8 mb-10 overflow-hidden shadow-lg">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* النص */}
        <div className="text-gray-800 space-y-4">
          <span className="bg-teal-200 text-teal-800 font-semibold px-4 py-1 rounded-full text-sm inline-block">
            عرض لفترة محدودة
          </span>

          <h2 className="text-3xl font-extrabold leading-tight">
            {product.title}
          </h2>

          <p className="text-gray-700 text-base">
            {product.description?.slice(0, 120)}...
          </p>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-teal-800">
              {product.price} EGP
            </span>
            <span className="line-through opacity-60">
              {product.price + 200} EGP
            </span>
          </div>

          <Link to={`/productdetails/${product._id}`}>
            <Button className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg rounded-full shadow-md">
            الحق العرض الآن🔥 
            </Button>
          </Link>
        </div>

        {/* الصورة */}
        <div className="flex justify-center">
          <img
            src={product.imageCover || product.images?.[0]}
            alt={product.title}
            className="w-72 h-72 object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
}
