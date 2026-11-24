import React from "react";
import { useParams } from "react-router-dom";

import ProductCard from "../components/ui/ProductCard";
import useRelatedProducts from "../hooks/useRelatedproducts";
import { useLanguage } from "@/context/language.context";

export default function RelatedProducts() {
  const { t } = useLanguage();
  const { id } = useParams();
  const { data, loading } = useRelatedProducts(id);

  if (loading) return <p>{t("Loading...")}</p>;
  if (!data?.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">{t("منتجات مشابهة")}</h2>

      <div className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-6">
        {data.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}