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
    breakpoint: { max: 4000, min: 1441 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 1440, min: 1281 },
    items: 5
  },
  laptop: {
    breakpoint: { max: 1280, min: 769 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 768, min: 481 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 480, min: 0 },
    items: 2
  }
};

interface TopProductProps {
  category: CategoryDataResponse,
}

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const CustomLeftArrow = ({ onClick, ...rest }: any) => {
//   const {
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     carouselState: { currentSlide, deviceType }
//   } = rest;
//   return (
//     <button onClick={onClick} className='w-10 h-10 z-20'>
//       <ArrowLeftIcon className="size-6" />
//     </button>
//   );
// };

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const CustomRightArrow = ({ onClick, ...rest }: any) => {
//   const {
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     carouselState: { currentSlide, deviceType }
//   } = rest;
//   return (
//     <button onClick={onClick} className='w-10 h-10 z-20'>
//       <ArrowRightIcon className="size-6" />
//     </button>
//   );
// };

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
    <div className='md:mt-8 px-20'>
      <div className="flex justify-between items-center md:mb-2">
        <h1 className='sm:text-xl md:text-3xl'>{category.name.toUpperCase()}</h1>
        <Link
          href={{ pathname: "/shop", query: { category: category.id } }}
          className="flex justify-center items-center sm:space-x-1 md:space-x-2 bg-gray-700 text-white sm:text-sm md:text-md xl:text-xl h-fit sm:px-3 md:px-4 py-2 rounded-full hover:bg-gray-800"
        >
          <span>
            View All
          </span>
          <ChevronDoubleRightIcon className='size-4' />
        </Link>
      </div>

      {topProduct.length === 0 ? (
        <div className='w-88vw h-[360px] flex justify-center items-center bg-gray-200 rounded-xl'>
          There&apos;s no product.
        </div>
      ) : (
        <Carousel
          ssr={true}
          responsive={responsive}
          swipeable={true}
          draggable={true}
          infinite={true}
          containerClass='w-88vw py-5'
          itemClass='px-5'
          // customLeftArrow={<CustomLeftArrow />}
          // customRightArrow={<CustomRightArrow />}
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
