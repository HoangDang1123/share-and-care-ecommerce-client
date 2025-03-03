import React from 'react'

interface SortSelectedProps {
  setSort: (sort: string) => void;
}

const SortSelected: React.FC<SortSelectedProps> = ({ setSort }) => {
  return (
    <div className="flex justify-end w-full bg-gray-200 px-4 py-2 sm:text-sm md:text-md rounded-md">
      <select
        onChange={(e) => setSort(e.target.value)} 
        className='sm:w-full md:w-fit p-1 rounded-md'
      >
        <option value="">Sort</option>
        <option value="PRICE">Price: Low to High</option>
        <option value="-PRICE">Price: High to Low</option>
        <option value="-CREATED_AT">Latest</option>
      </select>
    </div>
  )
}

export default SortSelected;