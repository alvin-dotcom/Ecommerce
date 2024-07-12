// app/category/[slug]/page.js
import React from 'react';
import { fetchDataFromApi } from '@/utils/api';
import CategoryClient from './CategoryClient';

const maxResult = 3;

export async function generateStaticParams() {
  const categories = await fetchDataFromApi('/api/categories?populate=*');
  return categories.data.map((c) => ({
    slug: c.attributes.slug,
  }));
}

async function fetchCategoryData(slug, page = 1) {
  const category = await fetchDataFromApi(`/api/categories?filters[slug][$eq]=${slug}`);
  const products = await fetchDataFromApi(`/api/products?populate=*&[filters][categories][slug][$eq]=${slug}&pagination[page]=${page}&pagination[pageSize]=${maxResult}`);
  return { category: category.data[0], products };
}

const CategoryPage = async ({ params }) => {
  const { slug } = params;
  const initialData = await fetchCategoryData(slug);

  return <CategoryClient initialData={initialData} slug={slug} />;
};

export default CategoryPage;
