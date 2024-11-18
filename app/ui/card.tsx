import { Product } from '@/data/interface';
import { formatPrice } from '@/utils/Transaction';
import { StarIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface CardProps {
    product: Product;
}

const Card: React.FC<CardProps> = ({ product }) => {
    return (
        <div className='w-fit select-none'>
            <Link href={`/product/${product.id}/?refreshToken=${process.env.NEXT_PUBLIC_REFRESHTOKEN}`}>
                <Image
                    alt={product.name}
                    src={product.image[0]}
                    width={280}
                    height={200}
                    style={{ width: "auto", height: "auto", borderRadius: "10px" }}
                    className='hover:opacity-80'
                />
                <h2 className='my-2'>{product.name}</h2>
                <div className='flex justify-between'>
                    <h2 className='mt-1'>{formatPrice(product.price)}</h2>
                    <div className='flex products-center'>
                        <h2 className='mt-1'>{product.rating}</h2>
                        <StarIcon className='size-7 mt-1' />
                        <h2 className='mt-1'>{`(${product.sold})`}</h2>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Card;
