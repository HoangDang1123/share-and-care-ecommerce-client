import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Card from './card';

interface Product {
  image: string,
  name: string;
  price: string;
  rating: number;
  sold: number;
  discount: string;
}

interface TopProductProps {
  list: Array<Product>;
}

const TopProduct: React.FC<TopProductProps> = ({ list }) => {
  return (
    <div className='mt-10'>
      <div className="flex justify-between px-10 mb-2">
        <h1>TOP SALES</h1>
        <a href="#" className="text-xl italic underline">View more</a>
      </div>

      <div className='relative flex justify-between h-auto space-x-4'>
        <button
          className="h-[405px] left-0 p-1 cursor-pointer rounded-l-xl bg-gray-700 bg-opacity-20 hover:bg-opacity-30"
          aria-label="View Previous Image"
        >
          <ChevronLeftIcon className="size-8" />
        </button>

        <div className='flex w-full space-x-5'>
          {list.map((item, index) => {
            return (
              <Card key={index} product={item} />
            )
          })}
        </div>

        <button
          className="h-[405px] right-0 p-1 cursor-pointer rounded-r-xl bg-gray-700 bg-opacity-20 hover:bg-opacity-30"
          aria-label="View Next Image"
        >
          <ChevronRightIcon className="size-8" />
        </button>
      </div>
    </div>
  );
};

export default TopProduct;
