import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'

export default function useProductDetails(productId) {
    async function getProductDetails()
    {
        let {data}= await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${productId}`);
        return data;
    }
    let response=useQuery({
        queryKey: ['product-details',productId],
        queryFn: getProductDetails,
        staleTime:5000,
        retry:4,
        enabled:!!productId,
        
        

    })
  return response
}
