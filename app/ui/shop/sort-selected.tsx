import React from 'react'

interface SortSelectedProps {
  setSort: (sort: string) => void;
}

const SortSelected: React.FC<SortSelectedProps> = ({ setSort }) => {
  return (
    <select
      onChange={(e) => setSort(e.target.value)}
      className='sm:w-full md:w-fit sm:text-sm md:text-base p-1 rounded-lg'
    >
      <option value="">Sort</option>
      <option value="PRICE">Price: Low to High</option>
      <option value="-PRICE">Price: High to Low</option>
      <option value="-CREATED_AT">Latest</option>
    </select>
  )
}

export default SortSelected;