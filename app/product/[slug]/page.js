import React from "react";
import { fetchDataFromApi } from '@/utils/api';
import ProductClient from "./ProductClient";

export async function generateStaticParams() {
  const products = await fetchDataFromApi("/api/products?populate=*");
  return products.data.map((p) => ({
    slug: p.attributes.slug,
  }));
}

export async function fetchProductData(slug) {
  const productResponse = await fetchDataFromApi(
      `/api/products?populate=*&filters[slug][$eq]=${slug}`);
  const productsResponse = await fetchDataFromApi(
      `/api/products?populate=*&filters[slug][$ne]=${slug}`);

  return { 
    product: productResponse.data[0], 
    products: productsResponse.data 
  };
}

const ProductDetail = async ({ params }) => {
  const { slug } = params;
  const initialData = await fetchProductData(slug);

  return <ProductClient initialData={initialData} slug={slug} />;
}; 

export default ProductDetail;
