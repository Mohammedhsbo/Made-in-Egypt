import React from "react";
import { useParams } from "react-router-dom";

import ProductCard from "../components/ui/ProductCard";
import useRelatedProducts from "../hooks/useRelatedproducts";

export default function RelatedProducts() {
  const { id } = useParams();
  const { data, loading } = useRelatedProducts(id);

  if (loading) return <p>Loading...</p>;
  if (!data?.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">منتجات مشابهة</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}