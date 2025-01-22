'use client'

import React, { useEffect, useState } from 'react'
import Card from '../card';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import { CategoryDataResponse } from '@/interface/category';
import { getTopCategoriesProduct } from '@/app/api/product';
import { ProductDataResponse } from '@/interface/product';
import Link from 'next/link';
import { ChevronDoubleRightIcon } from '@heroicons/react/24/outline';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2
  }
};

interface TopProductProps {
  category: CategoryDataResponse,
}

const TopProduct: React.FC<TopProductProps> = ({ category }) => {
  const [topProduct, setTopProduct] = useState<Array<ProductDataResponse>>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getTopCategoriesProduct(category.id);
        setTopProduct(response.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category, setTopProduct]);

  return (
    <div className='mt-8 px-20'>
      <div className="flex justify-between mb-2">
        <h1>{category.name.toUpperCase()}</h1>
        <Link
          href={{ pathname: "/shop", query: { category: category.id } }}
          className="flex justify-center items-center space-x-2 bg-gray-700 text-white text-xl h-fit px-4 py-2 rounded-full hover:bg-gray-800"
        >

          <span>
            View All
          </span>
          <ChevronDoubleRightIcon className='size-4' />
        </Link>
      </div>

      {topProduct.length === 0 ? (
        <div className='w-[1700px] h-[360px] flex justify-center items-center bg-gray-200 rounded-xl'>
          There&apos;s no product.
        </div>
      ) : (
        <Carousel
          ssr={true}
          responsive={responsive}
          swipeable={true}
          draggable={true}
          infinite={true}
          containerClass='w-[1700px] py-5'
          itemClass='px-5'
        >
          {topProduct.map((item, index) => {
            return (
              <Card key={index} product={item} />
            )
          })}
        </Carousel>
      )}
    </div>
  );
};

export default TopProduct;
