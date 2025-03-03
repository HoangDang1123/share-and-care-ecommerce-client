import { Category } from '@/interface/product';
import React from 'react'

interface DetailProps {
  category: Array<Category>,
  quantity: number,
  attributes: Array<string>,
}

const Detail: React.FC<DetailProps> = ({ category, quantity, attributes }) => {
  return (
    <div className='flex flex-col rounded-md'>
      <div className='px-4 py-2 bg-gray-200 rounded-t-md'>
        <h6 className='sm:text-xl md:text-2xl font-semibold'>Detail</h6>
      </div>
      <div className='flex my-4 px-4 space-x-10'>
        <div className='flex flex-col space-y-4'>
          <div className='flex justify-between space-x-2'>
            <h6 className='sm:text-lg md:text-xl font-semibold'>Category</h6>
            <h6 className='sm:text-lg md:text-xl font-semibold'>:</h6>
          </div>

          <div className='flex justify-between space-x-2'>
            <h6 className='sm:text-lg md:text-xl font-semibold'>Quantity left in stock</h6>
            <h6 className='sm:text-lg md:text-xl font-semibold'>:</h6>
          </div>

          <div className='flex justify-between space-x-2'>
            <h6 className='sm:text-lg md:text-xl font-semibold'>Attributes</h6>
            <h6 className='sm:text-lg md:text-xl font-semibold'>:</h6>
          </div>
        </div>

        <div className='flex flex-col space-y-4'>
          <h6 className='sm:text-lg md:text-xl'>
            {category.map(cat => cat.name).join(', ')}
          </h6>

          <h6 className='sm:text-lg md:text-xl'>{quantity}</h6>

          <h6 className='sm:text-lg md:text-xl'>
            {attributes.join(', ')}
          </h6>
        </div>
      </div>
    </div>
  )
}

export default Detail;