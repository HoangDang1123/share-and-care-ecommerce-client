import React, { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ProductInfoDataResponse } from '@/interface/product';
import SizeGuide from './size-guide';

interface SelectedSizeProps {
  product: ProductInfoDataResponse,
  selectedSizeIndex: number | null,
  setSelectedSizeIndex: (selectedSizeIndex: number | null) => void,
}

const SelectedSize: React.FC<SelectedSizeProps> = ({ product, selectedSizeIndex, setSelectedSizeIndex }) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const sizes = product.variants.find(item => item.name === 'Size');

  const handleSizeClick = (index: number) => {
    setSelectedSizeIndex(index);
  };

  if (!sizes) {
    return (
      <div>There&apos;s no size</div>
    )
  }

  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex justify-between'>
        <h6 className='sm:text-xl md:text-2xl font-semibold'>
          {`Selected Size: ${selectedSizeIndex !== null ? sizes.options[selectedSizeIndex] : ''}`}
        </h6>

        <button
          onClick={() => setIsOpenDialog(true)}
          className="flex justify-center items-center space-x-2 bg-gray-700 text-white text-sm font-semibold h-fit px-4 py-2 rounded-full hover:bg-gray-800"
        >
          Size Guide
        </button>
        <Dialog open={isOpenDialog} onClose={() => setIsOpenDialog(false)} className="relative z-50">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          />
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
              <DialogTitle className="font-bold">Size Guide</DialogTitle>
              <SizeGuide />
            </DialogPanel>
          </div>
        </Dialog>
      </div>
      <ul className='sm:grid md:flex sm:grid-cols-5 sm:gap-4 md:gap-0 md:space-x-4'>
        {sizes.options.map((item, index) => (
          <li
            key={index}
            className={`flex justify-center items-center w-16 h-8 rounded-full hover:cursor-pointer ${selectedSizeIndex === index ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
            title={item}
            onClick={() => handleSizeClick(index)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SelectedSize;