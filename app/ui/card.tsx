import { ProductDataResponse } from '@/interface/product';
import { formatPrice } from '@/utils/helpers';
import { StarIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface CardProps {
  product: ProductDataResponse;
}

const Card: React.FC<CardProps> = ({ product }) => {
  return (
    <div className='w-fit h-full select-none'>
      <Link href={`/product/${product.id}`}>
        <Image
          alt={product.name}
          src={product.mainImage}
          priority
          width={270}
          height={360}
          style={{ width: "auto", height: "auto", borderRadius: "10px" }}
          className='transition ease-in-out hover:scale-110 duration-300 mb-5'
        />
        <div className='flex flex-col justify-between'>
          <h2 className='my-2'>{product.name}</h2>
          <div className='flex justify-between'>
            <h2 className='mt-1'>{formatPrice(product.price)}</h2>
            <div className='flex products-center'>
              <h2 className='mt-1'>{product.rating}</h2>
              <StarIcon className='size-7 mt-1' />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Card;
