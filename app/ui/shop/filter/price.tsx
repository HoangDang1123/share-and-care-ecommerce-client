'use client'

import { formatPrice } from "@/utils/helpers";
import { useState } from "react";
import { Range } from "react-range";

export default function PriceFilter() {
  const [price, setPrice] = useState({
    values: [0, 1000000],
  });

  return (
    <div className='flex flex-col'>
      <h1 className='font-bold mb-2'>Price</h1>
      <Range
        step={1000}
        min={0}
        max={1000000}
        values={price.values}
        onChange={(values) => setPrice({ values })}
        renderTrack={({ props, children }) => {
          const { ...restProps } = props;
          return (
            <div className='w-full h-[6px] bg-slate-200 rounded-full cursor-pointer' {...restProps} >
              {children}
            </div>
          );
        }}
        renderThumb={({ props }) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { key, ...restProps } = props;
          return (
            <div key={props.key} className='w-[15px] h-[15px] bg-[#059473] rounded-full' {...restProps} />
          );
        }}
      />
      <div className="mt-4">
        <span className="text-slate-800 font-bold text-lg">
          {formatPrice(price.values[0])} - {formatPrice(price.values[1])}
        </span>
      </div>
    </div>
  )
}
