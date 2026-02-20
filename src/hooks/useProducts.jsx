import React from 'react'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export default function useProducts() {
    async function getProducts(){
      let {data}= await axios.get("https://ecommerce.routemisr.com/api/v1/products");
      return data;
    }
    let response=useQuery({
      queryKey: ['products'],
      queryFn: getProducts,
      staleTime:5000,
      retry:4,
    })
  return response;
}
