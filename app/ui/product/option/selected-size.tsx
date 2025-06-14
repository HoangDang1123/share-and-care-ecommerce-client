'use client'

import React, { useEffect } from 'react'
import { ProductDetailResponse } from '@/interface/product';

interface SelectedSizeProps {
  product: ProductDetailResponse;
  selectedSizeIndex: number | null,
  setSelectedSizeIndex: (selectedSizeIndex: number | null) => void,
}

const SelectedSize: React.FC<SelectedSizeProps> = ({ product, selectedSizeIndex, setSelectedSizeIndex }) => {
  const sizes = product.product.variantAttributes.find(item => item.name.includes("Size"));

  useEffect(() => {
    if (!sizes) {
      setSelectedSizeIndex(null);
    }
  }, [sizes, setSelectedSizeIndex]);

  const handleSizeClick = (index: number) => {
    setSelectedSizeIndex(index);
  };

  if (!sizes) {
    return (
      <div className='italic'>Kích thước không khả dụng.</div>
    )
  }

  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex justify-between'>
        <h3 className='sm:text-base md:text-xl font-semibold'>
          {`Kích thước đã chọn: ${selectedSizeIndex !== null && selectedSizeIndex !== -1 ? sizes.values[selectedSizeIndex].descriptionUrl : ''}`}
        </h3>
      </div>
      <ul className='sm:grid md:flex sm:grid-cols-6 sm:gap-4 md:gap-0 md:space-x-4'>
        {sizes.values.map((item, index) => (
          <li
            key={index}
            className={`flex justify-center items-center sm:w-12 sm:h-6 sm:text-sm md:w-16 md:h-8 md:text-lg rounded-full hover:cursor-pointer ${selectedSizeIndex === index ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
            onClick={() => handleSizeClick(index)}
          >
            {item.value}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SelectedSize;