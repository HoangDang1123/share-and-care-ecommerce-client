import { Product } from '@/data/interface-test';
import { CheckIcon } from '@heroicons/react/24/outline';
import React from 'react'

interface SelectedColorProps {
  product: Product,
  selectedColorIndex: number | null,
  setSelectedColorIndex: (selectedColorIndex: number | null) => void,
}

const SelectedColor: React.FC<SelectedColorProps> = ({ product, selectedColorIndex, setSelectedColorIndex }) => {
  const handleColorClick = (index: number) => {
    setSelectedColorIndex(index);
  };

  return (
    <div className='flex flex-col space-y-2'>
      <h6 className='text-2xl font-semibold'>{`Selected Color: ${selectedColorIndex !== null ? product.color[selectedColorIndex].name : ''}`}</h6>
      <ul className='flex space-x-4'>
        {product.color.map((item, index) => (
          <li
            key={index}
            className='flex justify-center items-center w-12 h-6 rounded-md hover:cursor-pointer'
            style={{
              backgroundColor: item.code,
              border: item.code === "#ffffff" ? '1px solid black' : 'none'
            }}
            title={item.name}
            onClick={() => handleColorClick(index)}
          >
            {selectedColorIndex === index && (
              <CheckIcon className={`size-5 font-bold ${item.code === "#ffffff" ? 'text-gray-900' : 'text-white'}`} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SelectedColor;