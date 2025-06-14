'use client'

import React, { useState, Suspense } from 'react'
import CategoryFilter from './filter/category'
import PriceFilter from './filter/price'
import RatingFilter from './filter/rating'
import AttributeFilter from './filter/attribute'

const TABS = [
  { id: 'category', label: 'Loại' },
  { id: 'attribute', label: 'Thuộc tính' },
  { id: 'price', label: 'Giá' },
  { id: 'rating', label: 'Đánh giá' },
]

export default function FilterContainer() {
  const [activeTab, setActiveTab] = useState('category')

  const renderContent = () => {
    switch (activeTab) {
      case 'category':
        return <CategoryFilter />
      case 'attribute':
        return <AttributeFilter />
      case 'price':
        return <PriceFilter />
      case 'rating':
        return <RatingFilter />
      default:
        return null
    }
  }

  return (
    <div className="sm:hidden lg:flex flex-col h-fit gap-y-4 md:px-4 py-4 md:shadow-xl bg-white rounded-xl">
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200
              ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-indigo-500'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-4">
        <Suspense fallback={<div>Đang tải...</div>}>
          {renderContent()}
        </Suspense>
      </div>
    </div>
  )
}