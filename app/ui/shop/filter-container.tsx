'use client'

import React, { Suspense } from 'react'
import CategoryFilter from './filter/category'
import PriceFilter from './filter/price'
import RatingFilter from './filter/rating'

export default function FilterContainer() {

  return (
    <div
      className="sm:hidden lg:flex flex-col h-fit gap-y-8 md:px-8 py-4 md:shadow-xl transition-all duration-300 ease-in-out"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryFilter />
        <PriceFilter />
        <RatingFilter />
      </Suspense>
    </div>
  )
}
