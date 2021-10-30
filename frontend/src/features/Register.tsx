import React from "react";

import {Product, useAllProductsQuery} from '../types';

export const Register: React.FC = () => {
  const { data, error, loading } = useAllProductsQuery({variables:{active: true}});
  if(error) {
    console.log('🔥', error)
    return null;
  }
  if(loading) {
    return <div>...</div>
  }
  return (<div>{data?.allProducts.map((product: Product) => {
    return <div key={product.id}>{product.name}</div>
  })} </div>)
};