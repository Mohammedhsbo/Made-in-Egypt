import useProductDetails from "@/hooks/useProductDetails";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Relatedproducts from "./relatedproducts";
import { Award, Repeat, Truck, ShoppingCart, Info } from "lucide-react";
import { useCart } from "@/context/cartContext";
import Reviews from "./reveiw/reveiw";
import { useAuth } from "../context/auth.context";
import { toast } from "sonner";

export default function Productdetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useProductDetails(id);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] justify-center items-center">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 font-bold">
          حدث خطأ أثناء جلب بيانات المنتج
        </div>
      </div>
    );
  }

  const product = data?.data?.product;

  if (!isLoading && !product) return null;

  // ===================== NORMALIZE DATA =====================
  const title = product?.title_en || product?.title_ar || "";
  const description = product?.description_en || product?.description_ar || "";
  const price = product?.priceAfterDiscount || product?.basePrice || 0;

  const category =
    product?.category?.name_en || product?.category?.name_ar || "";

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match)
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  const images =
    product?.images?.length > 0
      ? product.images.map(getImageUrl)
      : product?.imageCover
        ? [getImageUrl(product.imageCover)]
        : [];

  // ===================== SLIDER SETTINGS =====================
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const features = [
    {
      text: "شحن سريع للمنزل",
      icon: <Truck size={26} className="text-blue-500" />,
    },
    {
      text: "أعلى جودة مضمونة",
      icon: <Award size={26} className="text-yellow-500" />,
    },
    {
      text: "استبدال واسترجاع",
      icon: <Repeat size={26} className="text-green-500" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* LOADING */}
      {isLoading && (
        <div className="flex flex-col min-h-[60vh] justify-center items-center gap-4">
          <Spinner className="w-12 h-12 text-primary" />
          <p>جاري تحميل المنتج...</p>
        </div>
      )}

      {/* PRODUCT */}
      {!isLoading && product && (
        <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* IMAGE */}
            <div className="w-full lg:w-5/12">
              <div className="bg-gray-50 rounded-3xl p-6 border relative">
                <span className="absolute top-4 right-4 bg-white px-3 py-1 text-xs rounded-full shadow">
                  {category}
                </span>

                <Slider {...sliderSettings}>
                  {images.map((img, i) => (
                    <div key={i}>
                      <img
                        src={img}
                        alt="product"
                        className="w-full h-[400px] object-contain"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>

            {/* INFO */}
            <div className="w-full lg:w-7/12 flex flex-col gap-6">
              <h1 className="text-3xl font-black">{title}</h1>

              <div className="flex items-center gap-4">
                <h2 className="text-4xl font-black text-primary">
                  {price} EGP
                </h2>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-xl text-sm">
                  متوفر
                </span>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-bold">
                  <Info size={18} /> الوصف
                </h3>
                <p className="text-gray-600 mt-2">{description}</p>
              </div>

              {/* QUANTITY */}
              <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4">
                <div className="flex items-center border rounded-full bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2"
                  >
                    -
                  </button>

                  <span className="px-4 font-bold">{quantity}</span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2"
                  >
                    +
                  </button>
                </div>

                {/* {!user ? (
                  <Link
                    to="/login"
                    className="bg-primary text-white px-4 py-2 rounded-full"
                  >
                    سجل الدخول للحصول على المنتج
                  </Link>
                ) : ( */}
                <Button
                  className="flex-1 flex gap-2"
                  onClick={() => {
                    if (!user) {
                      toast.info(
                        "يمكنك التصفح بدون تسجيل، لكن التسجيل يحفظ سلتك",
                      );
                    }
                    addToCart({
                      ...product,
                      selectedQuantity: quantity,
                    });
                  }}
                >
                  <ShoppingCart size={18} />
                  إضافة للسلة
                </Button>
              </div>

              {/* FEATURES */}
              <div className="grid grid-cols-3 gap-4">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-4 rounded-2xl text-center"
                  >
                    {f.icon}
                    <p className="text-sm mt-2">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RELATED */}
      <div className="mt-20">
        <Relatedproducts />
      </div>
      {/* REVIEWS */}
      <div className="mt-20">
        <Reviews />
      </div>
    </div>
  );
}
