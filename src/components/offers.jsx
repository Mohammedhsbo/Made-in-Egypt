import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TodaysDealCard({ deals }) {
  if (!deals || deals.length === 0) return null;

  // Let's pick a random product for the deal, or just the first one
  const product = deals[0];
  const title = product?.title_ar || product?.title_en || "";
  const description = product?.description_ar || product?.description_en || "";
  const price = product?.priceAfterDiscount || product?.basePrice || 0;

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  return (
    <div className="relative bg-slate-900 rounded-[2rem] p-8 md:p-12 mb-16 overflow-hidden shadow-2xl">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-br from-primary/30 to-blue-600/30 rounded-full blur-[80px] -mt-20 -mr-20 pointer-events-none"></div>

      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* النص */}
        <div className="text-white space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-4 py-1.5 rounded-full text-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            عرض لفترة محدودة
          </div>

          <h2 className="text-4xl md:text-5xl font-black leading-tight text-white">
            {title}
          </h2>

          <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
            {description?.slice(0, 150)}{description?.length > 150 ? '...' : ''}
          </p>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex flex-col">
              <span className="text-slate-400 text-sm font-medium mb-1 line-through">
                {(price * 1.3).toFixed(2)} EGP
              </span>
              <span className="text-4xl font-black text-white">
                {price} <span className="text-xl font-medium text-slate-300">EGP</span>
              </span>
            </div>
            
            <div className="bg-red-500/20 text-red-400 font-bold px-3 py-1 rounded-lg border border-red-500/30">
               وفر 30%
            </div>
          </div>

          <div className="pt-4">
            <Link to={`/productdetails/${product._id}`}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14 text-lg font-bold rounded-full shadow-lg shadow-primary/25 transition-all">
                اغتنم العرض الآن 🔥
              </Button>
            </Link>
          </div>
        </div>

        {/* الصورة */}
        <div className="flex justify-center md:justify-end relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl z-10 pointer-events-none hidden md:block"></div>
          <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px] bg-white rounded-3xl shadow-xl overflow-hidden group-hover:-translate-y-2 transition-transform duration-500 border border-white/10">
            <img
              src={getImageUrl(product.imageCover) || getImageUrl(product.images?.[0])}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
