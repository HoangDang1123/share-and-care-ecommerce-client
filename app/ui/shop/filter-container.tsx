'use client'

import React from 'react'
import CategoryFilter from './filter/category'
import PriceFilter from './filter/price'
import RatingFilter from './filter/rating'

export default function FilterContainer() {

  return (
    <div
      className="flex flex-col space-y-4 px-10 py-4 shadow-lg transition-all duration-300 ease-in-out"
    >
      <CategoryFilter />
      <PriceFilter />
      <RatingFilter />
    </div>
  )
}
