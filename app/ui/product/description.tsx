import React from 'react'

interface DescriptionProps {
  description: string,
}

const Description: React.FC<DescriptionProps> = ({ description }) => {
  return (
    <div className='flex flex-col px-6 py-4 bg-gray-100 rounded-lg'>
      <h3 className='sm:text-lg md:text-xl font-semibold'>Mô tả sản phẩm</h3>
      
      <div className='flex mt-10'>
        <p className='sm:text-md md:text-lg leading-10 text-justify whitespace-pre-line'>{description}</p>
      </div>
    </div>
  )
}

export default Description;