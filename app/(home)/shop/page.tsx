'use client'

import { getAllProduct, getShopProducts } from "@/app/api/product";
import { useFilter } from "@/app/context/FilterContext";
import Card from "@/app/ui/card";
import SortSelected from "@/app/ui/shop/sort-selected";
import { FetchProductsParams, ProductDataResponse } from "@/interface/product";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { price } = useFilter();
  const [productList, setProductList] = useState<Array<ProductDataResponse>>([]);
  const [sort, setSort] = useState('');
  const searchParams = useSearchParams();

  const fetchProducts = async () => {
    const searchData = searchParams.get('search');
    const categoryData = searchParams.get('category');
    const minPriceData = searchParams.get('minPrice');
    const maxPriceData = searchParams.get('maxPrice');

    let response;

    try {
      const filters: FetchProductsParams = {};

      if (searchData) {
        filters.search = searchData;
      }
      if (categoryData) {
        filters.categoryId = categoryData;
      }
      if (minPriceData) {
        filters.minPrice = Number(minPriceData);
      }
      if (maxPriceData) {
        filters.maxPrice = Number(maxPriceData);
      }
      if (sort) {
        filters.sort = sort;
      }

      if (Object.keys(filters).length > 0) {
        response = await getShopProducts(filters);
      } else {
        response = await getAllProduct();
      }

      setProductList(response.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price.values, searchParams, sort]);

  return (
    <div className="flex flex-col space-y-8">
      <SortSelected setSort={setSort} />

      {productList.length === 0 ? (
        <div className='h-[480px] flex justify-center items-center'>
          There&apos;s no product.
        </div>
      ) : (
        <div className="w-full grid min-[0px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-16">
          {productList.map((product, index) => (
            <Card key={index} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}