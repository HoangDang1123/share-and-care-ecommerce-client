'use client'

import { getAllProduct, getAllSearchProduct, getCategoryFilterProduct, getPriceFilterProduct } from "@/app/api/product";
import { useFilter } from "@/app/context/FilterContext";
import Card from "@/app/ui/card";
import SortSelected from "@/app/ui/shop/sort-selected";
import { ProductDataResponse } from "@/interface/product";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function Page() {
  const { price } = useFilter();
  const [productList, setProductList] = useState<Array<ProductDataResponse>>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const searchData = searchParams.get('search');
      const categoryData = searchParams.get('category');
      const minPriceData = searchParams.get('minPrice');
      const maxPriceData = searchParams.get('maxPrice');

      if (!searchData && !categoryData && !minPriceData && !maxPriceData) {
        try {
          const response = await getAllProduct();
          setProductList(response.products);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      } else {
        if (searchData) {
          try {
            const response = await getAllSearchProduct(searchData);
            setProductList(response.products);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        } else if (categoryData) {
          try {
            const response = await getCategoryFilterProduct(categoryData);
            setProductList(response.products);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        } else if (minPriceData || maxPriceData) {
          try {
            const response = await getPriceFilterProduct(price.values[0], price.values[1]);
            setProductList(response.products);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        }
      }
    };

    fetchProducts();
  }, [price.values, searchParams, setProductList]);

  return (
    <div className="flex flex-col space-y-8">
      <SortSelected />

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
  )
}