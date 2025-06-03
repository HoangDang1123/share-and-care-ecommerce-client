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
        <option value="">Rating </option>
        <option value="1">1 Star</option>
        <option value="2">2 Star</option>
        <option value="3">3 Star</option>
        <option value="4">4 Star</option>
        <option value="5">5 Star</option>
      </select>

      <select
        onChange={handleHasImageChange}
        className="border rounded-md p-1 text-base w-40">
        <option value="">Image </option>
        <option value="image">Has image</option>
        <option value="no-image">No image</option>
      </select>
    </div>
  )
}

export default ReviewFilter;