import React from 'react'

import { useQuery } from '@tanstack/react-query';
import api from './../api/axios.base';

export default function useProducts() {
    async function getProducts(){
      let {data}= await api.get('/products');
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
