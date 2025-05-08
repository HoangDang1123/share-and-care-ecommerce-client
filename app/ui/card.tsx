import { ProductResponse } from '@/interface/product';
import { formatPrice } from '@/utils/helpers';
import { StarIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface CardProps {
  product: ProductResponse;
}

const Card: React.FC<CardProps> = ({ product }) => {
  return (
    <div className='relative w-full h-full flex flex-col justify-between select-none'>
      <Link href={`/product/${product.code}`}>
        <Image
          alt={product.name}
          src={product.mainImage}
          priority
          width={270}
          height={360}
          style={{ borderRadius: "10px" }}
          className='object-cover w-auto h-auto block transition ease-in-out hover:scale-110 duration-300 mb-4'
        />
        <div className='flex flex-col justify-between sm:h-28 md:h-40'>
          <h2 className='md:my-2 sm:text-base md:text-2xl'>{product.name}</h2>
          <div className='flex justify-between'>
            <h2 className='md:mt-1 sm:text-base md:text-2xl'>
              {formatPrice(typeof product.price === 'number' ? product.price : product.price.min)}
            </h2>
            <div className='flex products-center'>
              <h2 className='md:mt-1 sm:text-base md:text-2xl'>{product.rating}</h2>
              <StarIcon className='sm:size-4 md:size-7 mt-1' />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Card;
