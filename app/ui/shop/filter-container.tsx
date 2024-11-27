'use client'

import React from 'react'
import CategoryFilter from './filter/category'
import PriceFilter from './filter/price'
import RatingFilter from './filter/rating'
import { useEffect, useState } from "react"

export default function FilterContainer() {
  const [isFixed, setIsFixed] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const downTriggerPoint = 100;
      const upTriggerPoint = 450;

      if (scrollTop > downTriggerPoint && scrollTop < upTriggerPoint) {
        setIsFixed(true);
        setIsEnd(false);
      } else if (scrollTop >= upTriggerPoint) {
        setIsFixed(false);
        setIsEnd(true);
      } else {
        setIsFixed(false);
        setIsEnd(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex flex-col space-y-4 px-10 py-4 shadow-lg transition-all duration-300 ease-in-out ${isFixed ? 'fixed top-48' : isEnd ? 'absolute -bottom-[450px]' : ''
        }`}
    >
      <CategoryFilter />
      <PriceFilter />
      <RatingFilter />
    </div>
  )
}
