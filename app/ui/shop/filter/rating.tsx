'use client'

import { Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css'

export default function RatingFilter() {
  const starValues = [5, 4, 3, 2, 1, 0];

  return (
    <div className='flex flex-col'>
      <h1 className='font-bold mb-2'>Rating</h1>
      {starValues.map((value) => (
        <div key={value} className='flex items-center mb-2 space-x-2'>
          <Checkbox
            className="group block size-5 mt-1 rounded border border-gray-700 bg-white data-[checked]:bg-gray-200 hover:cursor-pointer"
          >
            <CheckIcon className='opacity-0 group-data-[checked]:opacity-100' />
          </Checkbox>
          <Rating
            value={value}
            readOnly
            className='size-8'
          />
        </div>
      ))}
    </div>
  )
}