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
      <option value="">Sắp xếp</option>
      <option value="PRICE">Giá: Thấp tới Cao</option>
      <option value="-PRICE">Giá: Cao tới Thấp</option>
      <option value="-CREATED_AT">Mới nhất</option>
    </select>
  )
}

export default SortSelected;