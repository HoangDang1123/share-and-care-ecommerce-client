'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ProductDetailResponse } from '@/interface/product';
import SizeGuide from './size-guide';

interface SelectedSizeProps {
  product: ProductDetailResponse;
  selectedSizeIndex: number | null,
  setSelectedSizeIndex: (selectedSizeIndex: number | null) => void,
}

const SelectedSize: React.FC<SelectedSizeProps> = ({ product, selectedSizeIndex, setSelectedSizeIndex }) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
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
      <div>There&apos;s no size</div>
    )
  }

  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex justify-between'>
        <h6 className='sm:text-base md:text-xl font-semibold'>
          {`Selected Size: ${selectedSizeIndex && selectedSizeIndex !== -1 ? sizes.values[selectedSizeIndex].descriptionUrl : ''}`}
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