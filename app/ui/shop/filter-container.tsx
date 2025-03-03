'use client'

import React, { Suspense } from 'react'
import CategoryFilter from './filter/category'
import PriceFilter from './filter/price'
// import RatingFilter from './filter/rating'

export default function FilterContainer() {

  return (
    <div
      className="flex flex-col space-y-10 md:px-10 py-4 md:shadow-lg transition-all duration-300 ease-in-out"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryFilter />
        <PriceFilter />
        {/* <RatingFilter /> */}
      </Suspense>
    </div>
  )
}
