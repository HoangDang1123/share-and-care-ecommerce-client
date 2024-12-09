import { ProductInfoDataResponse } from '@/interface/product';
import { CheckIcon } from '@heroicons/react/24/outline';
import React from 'react'

const colorCodes: { [key: string]: string } = {
  "Trắng": "#ffffff",
  "Xanh Dương": "#001F6B",
  "Đỏ": "#8B0000",
  "Xanh Lá": "#004d00",
  "Vàng": "#BDAA00",
  "Light blue": "#ADD8E6",
  "Xanh wash": "#A0C4E1",
};

interface SelectedColorProps {
  product: ProductInfoDataResponse,
  selectedColorIndex: number | null,
  setSelectedColorIndex: (selectedColorIndex: number | null) => void,
}

const SelectedColor: React.FC<SelectedColorProps> = ({ product, selectedColorIndex, setSelectedColorIndex }) => {
  const colors = product.variants.find(item => item.name === 'Color');

  const handleColorClick = (index: number) => {
    setSelectedColorIndex(index);
  };

  if (!colors) {
    return (
      <div>There&apos;s no color</div>
    )
  }

  return (
    <div className='flex flex-col space-y-2'>
      <h6 className='text-2xl font-semibold'>{`Selected Color: ${selectedColorIndex !== null ? colors.options[selectedColorIndex] : ''}`}</h6>
      <ul className='flex space-x-4'>
        {colors.options.map((item, index) => (
          <li
            key={index}
            className='flex justify-center items-center w-12 h-6 rounded-md hover:cursor-pointer'
            style={{
              backgroundColor: colorCodes[item] || 'transparent',
              border: colorCodes[item] === "#ffffff" ? '1px solid black' : 'none'
            }}
            onClick={() => handleColorClick(index)}
          >
            {selectedColorIndex === index && (
              <CheckIcon className={`size-5 font-bold ${colorCodes[item] === "#ffffff" ? 'text-gray-900' : 'text-white'}`} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SelectedColor;