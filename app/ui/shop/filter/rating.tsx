'use client'

import { Radio, RadioGroup } from '@headlessui/react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css'

export default function RatingFilter() {
  const starValues = [5, 4, 3, 2, 1, 0];

  return (
    <RadioGroup className='flex flex-col'>
      <h1 className='font-bold mb-2'>Rating</h1>
      {starValues.map((value) => (
        <div key={value} className='flex items-center mb-2 space-x-2'>
          <Radio
            value={value}
            className="group flex justify-center items-center size-5 rounded-full border border-gray-700 bg-white hover:cursor-pointer"
          >
            <span className="invisible size-3 rounded-full bg-gray-700 group-data-[checked]:visible" />
          </Radio>
          <Rating
            value={value}
            readOnly
            className='size-8'
          />
        </div>
      ))}
    </RadioGroup>
  )
}