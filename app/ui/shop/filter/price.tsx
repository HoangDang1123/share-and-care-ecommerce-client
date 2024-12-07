'use client'

import { useFilter } from "@/app/context/FilterContext";
import { formatPrice } from "@/utils/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";
import { Range } from "react-range";

export default function PriceFilter() {
  const initialValues = useMemo(() => [0, 1000000], []);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { price, setPrice } = useFilter();

  useEffect(() => {
    const [minPrice, maxPrice] = price.values;
    const params = new URLSearchParams(searchParams);

    if (minPrice !== initialValues[0]) {
      params.set('minPrice', minPrice.toString());
    } else {
      params.delete('minPrice');
    }

    if (maxPrice !== initialValues[1]) {
      params.set('maxPrice', maxPrice.toString());
    } else {
      params.delete('maxPrice');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, [initialValues, price, router, searchParams]);

  return (
    <Suspense fallback={<div>Loading price filter...</div>}>
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
    </Suspense>
  )
}
