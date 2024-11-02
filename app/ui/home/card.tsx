import { StarIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import React from 'react'

interface Product {
    image: string,
    name: string;
    price: string;
    rating: number;
    sold: number;
    discount: string;
}

interface CardProps {
    product: Product;
}

const Card: React.FC<CardProps> = ({ product }) => {
    return (
        <div>
            <Image
                alt={product.name}
                src={product.image}
                width={340}
                height={200}
            />
            <h2 className='my-2'>{product.name}</h2>
            <div className='flex justify-between'>
                <h2 className='mt-1'>{product.price}</h2>
                <div className='flex products-center'>
                    <h2 className='mt-1'>{product.rating}</h2>
                    <StarIcon className='size-6' />
                    <h2>{`(${product.sold})`}</h2>
                </div>
            </div>
        </div>
    )
}

export default Card;
