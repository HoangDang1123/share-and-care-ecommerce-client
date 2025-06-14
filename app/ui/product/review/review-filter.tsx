'use client'

import React from 'react'

interface ReviewFilterProps {
  setRatingFilter: (ratingFilter: number | undefined) => void,
  setHasImageFilter: (hasImageFilter: boolean | undefined) => void,
}

const ReviewFilter: React.FC<ReviewFilterProps> = ({ setRatingFilter, setHasImageFilter }) => {

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRatingFilter(Number(event.target.value));
  }

  const handleHasImageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setHasImageFilter(event.target.value === "true" ? true : event.target.value === "false" ? false : undefined);
  }

  return (
    <div className='flex justify-center items-center gap-x-8'>
      <select
        onChange={handleRatingChange}
        className="border rounded-md p-1 text-base w-40"
      >
        <option value="">Đánh giá </option>
        <option value="1">1 sao</option>
        <option value="2">2 sao</option>
        <option value="3">3 sao</option>
        <option value="4">4 sao</option>
        <option value="5">5 sao</option>
      </select>

      <select
        onChange={handleHasImageChange}
        className="border rounded-md p-1 text-base w-40">
        <option value="">Hình ảnh </option>
        <option value="image">Có hình ảnh</option>
        <option value="no-image">Không có hình ảnh</option>
      </select>
    </div>
  )
}

export default ReviewFilter;