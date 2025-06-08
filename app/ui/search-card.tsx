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
    <div className="flex items-center gap-4 px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-gray-200">
      <Image
        alt={product.name}
        src={product.mainImage}
        priority
        width={90}
        height={120}
        style={{ borderRadius: "10px" }}
        className="flex-shrink-0"
      />
      <div className="flex flex-col justify-between h-[120px]">
        <span className="text-xl font-semibold">{product.name}</span>
        <span className="text-xl">
          {formatPrice(typeof product.price === 'number' ? product.price : product.price.min)}
          <span className='flex items-center'>
            {product.rating}
            <StarIcon className='size-5 mb-1' />
          </span>
        </span>
      </div>
    </div>

  )
}

export default SearchCard;