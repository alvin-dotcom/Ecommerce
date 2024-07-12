"use client";
import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Wrapper from "@/components/Wrapper";
import useSWR from "swr";
import { fetchDataFromApi } from "@/utils/api";

const maxResult = 3;

const fetchProducts = async (slug, page) => {
  return await fetchDataFromApi(
    `/api/products?populate=*&[filters][categories][slug][$eq]=${slug}&pagination[page]=${page}&pagination[pageSize]=${maxResult}`
  );
};

const CategoryClient = ({ initialData, slug }) => {
  const [pageIndex, setPageIndex] = useState(1);

  const { data, error, isLoading } = useSWR(
    `/api/products?populate=*&[filters][categories][slug][$eq]=${slug}&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}`,
    () => fetchProducts(slug, pageIndex),
    { fallbackData: initialData.products }
  );

  const handlePrevPage = () => {
    if (pageIndex > 1) setPageIndex(pageIndex - 1);
  };

  const handleNextPage = () => {
    if (data?.meta?.pagination?.pageCount > pageIndex)
      setPageIndex(pageIndex + 1);
  };

  return (
    <div className="w-full md:py-20 relative">
      <Wrapper>
        <div className="text-center max-w-[800px] mx-auto mt-8 md:mt-0">
          <div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
            {initialData.category?.attributes?.name}
          </div>
        </div>
        {/* products grid start */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-14 px-5 md:px-0">
          {data?.data?.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
        {/* products grid end */}
        <div className="flex gap-3 items-center justify-center my-16 md:my-0">
          <button
            className={`rounded py-2 px-4 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`}
            onClick={handlePrevPage}
            disabled={pageIndex === 1}
          >
            Previous
          </button>
          <span className="font-bold">{`${pageIndex} of ${
            data && data.meta.pagination.pageCount
          }`}</span>
          <button
            className={`rounded py-2 px-4 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`}
            onClick={handleNextPage}
            disabled={data?.meta?.pagination?.pageCount <= pageIndex}
          >
            Next
          </button>
        </div>
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-white/[0.5] flex flex-col gap-5 justify-center items-center">
            <img src="/logo.svg" width={150} />
            <span className="text-2xl font-medium">Loading...</span>
          </div>
        )}
      </Wrapper>
    </div>
  );
};

export default CategoryClient;
