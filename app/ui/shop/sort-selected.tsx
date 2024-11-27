import React from 'react'

export default function SortSelected() {
  return (
    <div className="flex justify-end w-full bg-gray-200 px-4 py-2 text-md rounded-md">
      <select className='p-1 rounded-md'>
        <option value="">Sort</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="latest">Latest</option>
      </select>
    </div>
  )
}
