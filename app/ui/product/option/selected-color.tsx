import { ProductInfoDataResponse } from '@/interface/product';
import { CheckIcon } from '@heroicons/react/24/outline';
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
      <h6 className='text-2xl font-semibold'>{`Selected Color: ${selectedColorIndex !== null ? colors.options[selectedColorIndex] : ''}`}</h6>
      <ul className='flex space-x-4'>
        {colors.options.map((item, index) => (
          <li
            key={index}
            className='flex justify-center items-center w-24 h-8 rounded-md hover:cursor-pointer border'
            onClick={() => handleColorClick(index)}
          >
            {item}
            {selectedColorIndex === index && (
              <CheckIcon className={`size-5 font-bold ml-2 ${item === "Trắng" ? 'text-gray-900' : 'text-black'}`} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectedColor;