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
    <div className='relative w-full h-full select-none'>
      <Link href={`/product/${product.id}`}>
        <Image
          alt={product.name}
          src={product.mainImage}
          priority
          width={270}
          height={360}
          style={{ borderRadius: "10px" }}
          className='object-cover w-auto h-auto block transition ease-in-out hover:scale-110 duration-300 mb-5'
        />
        <div className='flex flex-col justify-between sm:h-28 md:h-32'>
          <h2 className='md:my-2 sm:text-lg md:text-2xl'>{product.name}</h2>
          <div className='flex justify-between'>
            <h2 className='md:mt-1 sm:text-lg md:text-2xl'>{formatPrice(product.price)}</h2>
            <div className='flex products-center'>
              <h2 className='md:mt-1 sm:text-lg md:text-2xl'>{product.rating}</h2>
              <StarIcon className='sm:size-4 md:size-7 mt-1' />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Card;
