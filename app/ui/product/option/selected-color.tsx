import { ProductInfoDataResponse } from '@/interface/product';
import React from 'react';

interface SelectedColorProps {
  product: ProductInfoDataResponse;
  selectedColorIndex: number | null;
  setSelectedColorIndex: (selectedColorIndex: number | null) => void;
}

const SelectedColor: React.FC<SelectedColorProps> = ({ product, selectedColorIndex, setSelectedColorIndex }) => {
  const colors = product.variants.find(item => item.name === 'Color');

  const handleColorClick = (index: number) => {
    setSelectedColorIndex(index);
  };

  if (!colors) {
    return <div>There&apos;s no color</div>;
  }

  return (
    <div className='flex flex-col space-y-2'>
      <h6 className='sm:text-xl md:text-2xl font-semibold'>{`Selected Color: ${selectedColorIndex !== null ? colors.options[selectedColorIndex] : ''}`}</h6>
      <ul className='grid sm:grid-cols-3 md:grid-cols-4 gap-4'>
        {colors.options.map((item, index) => (
          <li
            key={index}
            className={`flex justify-center items-center h-8 rounded-full hover:cursor-pointer ${selectedColorIndex === index ? 'bg-gray-900 text-white' : 'bg-gray-300'}`}
            onClick={() => handleColorClick(index)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectedColor;