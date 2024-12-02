import React from 'react'

interface DescriptionProps {
  description: string | undefined,
}

const Description: React.FC<DescriptionProps> = ({ description }) => {
  return (
    <div className='flex flex-col rounded-md'>
      <div className='px-4 py-2 bg-gray-200 rounded-t-md'>
        <h6 className='text-2xl font-semibold'>Description</h6>
      </div>
      <div className='flex my-4 px-4'>
        <p className='text-xl leading-10 text-justify'>{description}</p>
      </div>
    </div>
  )
}

export default Description;