'use client'

import { Product } from '@/data/interface-test';
import { calculateDiscountPrice, formatPrice } from '@/utils/Transaction';
import { PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import SelectedColor from './filter/selected-color';
import SelectedSize from './filter/selected-size';
import SelectedQuantity from './filter/selected-quantity';

interface InforContainerProps {
    product: Product,
}

const InforContainer: React.FC<InforContainerProps> = ({ product }) => {
    const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
    const [selectedSizeIndex, setSelectedSizeIndex] = useState<number | null>(null);

    const [quantity, setQuantity] = useState(1);

    const finalPrice = product && product.price && product.discount
        ? calculateDiscountPrice(product.price, product.discount)
        : 0;

    return (
        <div className='flex flex-col w-full space-y-12'>
            <div className='space-y-2'>
                <h3 className='font-semibold'>{product.name}</h3>
                <h6 className='text-lg'>{`ID: ${product.id}`}</h6>
                <div className='flex items-end space-x-5'>
                    <h1 className='font-semibold'>{finalPrice !== undefined ? `${formatPrice(finalPrice)}` : 'Giá không có'}</h1>
                    <h6 className='text-xl line-through mb-2'>{formatPrice(product.price)}</h6>
                    <div className='flex justify-center w-24 mb-2 bg-green-700 text-white text-2xl py-1 rounded-lg'>
                        {product.discount}
                    </div>
                </div>
            </div>

            <SelectedColor product={product} selectedColorIndex={selectedColorIndex} setSelectedColorIndex={setSelectedColorIndex} />

            <SelectedSize product={product} selectedSizeIndex={selectedSizeIndex} setSelectedSizeIndex={setSelectedSizeIndex} />

            <SelectedQuantity
                product={product}
                quantity={quantity}
                setQuantity={setQuantity}
                selectedColorIndex={selectedColorIndex}
                selectedSizeIndex={selectedSizeIndex}
            />

            <div className='flex space-x-6'>
                <button
                    disabled={selectedColorIndex === null || selectedSizeIndex === null}
                    className={`flex justify-center items-center text-xl font-semibold bg-gray-300 px-6 py-2 rounded-md ${selectedColorIndex === null || selectedSizeIndex === null ? 'cursor-not-allowed' : ''}`}
                >
                    <PlusIcon className='size-7 mr-3' />
                    Add To Cart
                </button>

                <button
                    className={`flex justify-center items-center text-xl font-semibold bg-gray-900 px-6 py-2 rounded-md text-white ${selectedColorIndex === null || selectedSizeIndex === null ? 'cursor-not-allowed' : ''}`}
                    disabled={selectedColorIndex === null || selectedSizeIndex === null}
                >
                    <ShoppingCartIcon className='size-8 mr-3' />
                    Buy Now
                </button>
            </div>
        </div>
    )
}

export default InforContainer;