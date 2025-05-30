import { ProductResponse } from '@/interface/product';
import { formatPrice } from '@/utils/helpers'
import { StarIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import React from 'react'

interface SearchCardProps {
  product: ProductResponse;
}

const SearchCard: React.FC<SearchCardProps> = ({ product }) => {
  return (
    <div
      className='grid grid-rows-3 grid-flow-col gap-x-4 px-4 py-2 rounded-lg items-center justify-start hover:cursor-pointer hover:bg-gray-200'
    >
      <Image
        alt={product.name}
        src={product.mainImage}
        priority
        width={90}
        height={120}
        style={{ width: "auto", height: "auto", borderRadius: "10px" }}
        className='row-span-3'
      />
      <span className="text-xl font-semibold text-start col-span-2">{product.name}</span>
      <span className="text-xl self-end text-start row-span-2 col-span-2">
        {formatPrice(typeof product.price === 'number' ? product.price : product.price.min)}
        <span className='flex items-center'>
          {product.rating}
          <StarIcon className='size-5 mb-1' />
        </span>
      </span>
    </div>
  )
}

export default SearchCard;