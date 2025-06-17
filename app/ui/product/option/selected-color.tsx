'use client'

import { ProductDetailResponse } from '@/interface/product';
import React, { useEffect } from 'react';

interface SelectedColorProps {
  product: ProductDetailResponse;
  selectedColorIndex: number | null;
  setSelectedColorIndex: (selectedColorIndex: number | null) => void;
}

const SelectedColor: React.FC<SelectedColorProps> = ({ product, selectedColorIndex, setSelectedColorIndex }) => {
  const colors = product.product.variantAttributes.find(item => (item.name.includes("Màu sắc") || item.name.includes("Color")));

  useEffect(() => {
    if (!colors) {
      setSelectedColorIndex(null);
    }
  }, [colors, setSelectedColorIndex]);

  const handleColorClick = (index: number) => {
    setSelectedColorIndex(index);
  };

  if (!colors) {
    return <div className='italic'>Màu sắc không khả dụng.</div>;
  }

  return (
    <div className='flex flex-col space-y-2'>
      <h3 className='sm:text-base md:text-xl font-semibold'>
        {`Màu đã chọn: ${selectedColorIndex !== null && selectedColorIndex !== -1 ? colors.values[selectedColorIndex].value : ''}`}
      </h3>
      <ul className='grid sm:grid-cols-10 md:grid-cols-12'>
        {colors.values.map((value, index) => (
          <li
            key={index}
            className={`flex justify-center items-center sm:size-8 md:size-9 bg-transparent p-0.5 rounded-full hover:cursor-pointer ${selectedColorIndex === index ? 'border-2 border-gray-600' : ''}`}
            onClick={() => handleColorClick(index)}
          >
            <span
              className={`flex justify-center items-center w-full h-full rounded-full ${value.descriptionUrl.toLowerCase() === '#ffffff' ? 'border border-gray-300' : ''}`}
              style={{ backgroundColor: `${value.descriptionUrl}` }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectedColor;