import { Button } from '@/components/ui/button';
import useProducts from '@/hooks/useProducts';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

export default function Relatedproducts() {
  const { data } = useProducts();
  const { id } = useParams();
  
  const gotoup = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  
  const currentProduct = data?.data?.find((p) => p._id === id);

  // جلب المنتجات المشابهة
  const relatedProducts = data?.data?.filter(
    (p) =>
      p.category?._id === currentProduct?.category?._id && p._id !== currentProduct?._id
  );

  return (
    <div className='mt-20'>
      <h1 className='text-3xl font-bold text-center'>المنتجات المشابهة</h1>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-6'>
        {relatedProducts?.map((p) => (
          <div key={p._id} className='border p-4 rounded-lg text-center'>
            <img src={p.images[0]} alt={p.title} className='w-full h-40 object-cover rounded' />
            <p className='mt-2 font-semibold'>{p.title}</p>
            <p className='text-gray-600'>{p.price} EGP</p>
            <p className='text-gray-600'> {p.category.name}</p>
            <Button asChild variant='default' className='mt-2 w-full' onClick={gotoup}>
                <Link to={`/productdetails/${p._id}`}> اعرض المنتج</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
