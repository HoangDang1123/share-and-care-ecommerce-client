import { Attribute } from '@/interface/attribute';
import { Category } from '@/interface/category';
import React from 'react'

interface DetailProps {
  categories: Category[],
  attributes: Attribute[],
}

const Detail: React.FC<DetailProps> = ({ categories, attributes }) => {
  return (
    <div className='flex flex-col px-6 py-4 bg-gray-100 rounded-lg'>
      <h6 className='sm:text-md md:text-xl font-semibold'>Detail</h6>

      <div className='grid grid-cols-12 w-full sm:mt-6 md:mt-10'>
        <div className='sm:col-span-4 lg:col-span-2 flex flex-col sm:gap-y-2 md:gap-y-4'>
          <label className='sm:text-sm md:text-base'>Categories</label>
          {attributes.map((attribute) => (
            <label
              key={attribute.name}
              className='sm:text-sm md:text-base'
            >
              {attribute.name}
            </label>
          ))}
        </div>

        <div className='sm:col-span-8 lg:col-span-10 flex flex-col sm:gap-y-2 md:gap-y-4'>
          <div className='flex gap-x-2'>
            <label>:</label>
            {categories.map((category, index) => (
              <label key={category.id} className='sm:text-sm md:text-base'>
                {category.name}{index < categories.length - 1 ? ',' : ''}
              </label>
            ))}
          </div>
          {attributes.map((attribute) => (
            <label
              key={attribute.name}
              className='sm:text-sm md:text-base'
            >
              <div className='flex gap-x-2'>
                <label>:</label>
                {attribute.values.map((value, index) => (
                  <label key={value.value} className='sm:text-sm md:text-base'>
                    {value.value}{index < attribute.values.length - 1 ? ',' : ''}
                  </label>
                ))}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Detail;