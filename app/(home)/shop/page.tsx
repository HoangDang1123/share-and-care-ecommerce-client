'use client'

import { getAllProduct } from "@/app/api/product";
import Card from "@/app/ui/card";
import SortSelected from "@/app/ui/shop/sort-selected";
import { ProductDataResponse } from "@/interface/product";
import { useEffect, useState } from "react"

export default function Page() {
  const [productList, setProductList] = useState<Array<ProductDataResponse>>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProduct();
        setProductList(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [setProductList]);

  return (
    <div className="flex flex-col space-y-8">
      <SortSelected />

      <div className="w-full grid min-[0px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-16">
        {productList.map((product, index) => (
          <Card key={index} product={product} />
        ))}
      </div>
    </div>
  )
}