import { useQuery } from '@tanstack/react-query';

import React from 'react'
import api from '../api/axios.base';

export default function useProductDetails(productId) {
    async function getProductDetails()
    {
        let {data}= await api.get(`/products/${productId}`);
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
