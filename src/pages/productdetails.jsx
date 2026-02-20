import useProductDetails from "@/hooks/useProductDetails";
import React from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Relatedproducts from "./relatedproducts";
import { Award, Repeat, Truck } from "lucide-react";
import { useCart } from "@/context/cartContext";


export default function Productdetails() {
  const features = [
    { text: "شحن سريع للمنزل", icon: <Truck size={30} /> },
  { text: "أعلى جودة", icon: <Award size={30} /> },
  { text: "استبدال سهل", icon: <Repeat size={30} /> },
  ];
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const { id } = useParams();
  const { data, isLoading, error } = useProductDetails(id);
const {addToCart}=useCart();
  if (error)
    return (
      <p className="flex min-h-screen justify-center items-center text-red-700 text-3xl font-bold">
        حدث خطأ أثناء جلب بيانات المنتج.
      </p>
    );

  return (
    <div className="px-6">
      {isLoading && (
        <div className="flex min-h-screen justify-center items-center">
          <Spinner className="size-10" />
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col  justify-center items-center md:flex-row gap-15 mt-5  ">
          <div className="w-1/2 md:w-1/4">
            <Slider {...settings}>
              {data?.data?.images?.map((image, index) => (
                <div key={index} className="px-2">
                  {" "}
                  {/* optional padding */}
                  <img
                    src={image}
                    alt={`Image ${index}`}
                    className="w-full  rounded-lg"
                  />
                </div>
              ))}
            </Slider>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <h1 className="text-2xl font-bold">{data?.data?.title}</h1>
            <p className="text-gray-600">{data?.data?.description}</p>
            <h2 className="text-xl font-semibold">{data?.data?.price} EGP</h2>
            <p className="text-sm text-gray-500">
              {data?.data?.category?.name}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
  {features.map((feature, index) => (
    <div
      key={index}
      className="flex flex-col items-center bg-gray-300 rounded-lg text-gray-800 p-4 min-w-[120px] flex-1 md:flex-auto"
    >
      {feature.icon}
      <p className="text-center mt-2">{feature.text}</p>
    </div>
  ))}
</div>

            <Button className="w-full" onClick={() => addToCart(data?.data)}>اضافة للسلة</Button>
          </div>
        </div>
      )}

      <Relatedproducts />
    </div>
  );
}
