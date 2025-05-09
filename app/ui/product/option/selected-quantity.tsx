'use client'

import { ProductDetailResponse } from '@/interface/product';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'

interface SelectedQuantityProps {
  product: ProductDetailResponse,
  quantityInStock: number,
  quantity: number,
  setQuantity: React.Dispatch<React.SetStateAction<number>>,
  selectedColorIndex: number | null,
  selectedSizeIndex: number | null,
}

const SelectedQuantity: React.FC<SelectedQuantityProps> = ({ product, quantityInStock, quantity, setQuantity, selectedColorIndex, selectedSizeIndex }) => {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const hasVariants = product.product.variants.length > 0;
    const isColorOrSizeNotSelected = selectedColorIndex === -1 || selectedSizeIndex === -1;
  
    setDisabled(hasVariants && isColorOrSizeNotSelected);
  }, [product.product.variants.length, selectedColorIndex, selectedSizeIndex, setDisabled]);

  const decQuantity = () => {
    setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
  }

  const incQuantity = () => {
    setQuantity(prevQuantity => Math.min(prevQuantity + 1, quantityInStock));
  }

  return (
    <div className='flex items-center space-x-4'>
      <h6 className='sm:text-base md:text-xl font-semibold'>Quantity</h6>
      <div className='flex items-center justify-between space-x-2 rounded-md'>
        <button
          onClick={decQuantity}
          className={`flex justify-center items-center px-1 py-1 h-full rounded-md border-solid border border-gray-900 ${disabled ? 'cursor-not-allowed' : ''}`}
          disabled={disabled}
        >
          <MinusIcon className='sm:size-4 md:size-5' />
        </button>

        <input
          type="number"
          className="sm:w-16 md:w-20 text-center border-solid border border-gray-900 rounded-md sm:text-base md:text-xl"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(Number(e.target.value), 1))}
          min="1"
          max={quantityInStock}
          disabled={disabled}
        />

        <button
          onClick={incQuantity}
          className={`flex justify-center items-center px-1 py-1 h-full rounded-md border-solid border border-gray-900 ${disabled ? 'cursor-not-allowed' : ''}`}
          disabled={disabled}
        >
          <PlusIcon className='sm:size-4 md:size-5' />
        </button>
      </div>
      <h6 className='sm:text-xl md:text-2xl'>{`( ${quantityInStock} left )`}</h6>
    </div>
  )
}

export default SelectedQuantity;