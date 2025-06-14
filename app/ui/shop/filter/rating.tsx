'use client'

import { Radio, RadioGroup } from '@headlessui/react';
import { Rate } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RatingFilter() {
  const starValues = [5, 4, 3, 2, 1, 0];

  const [selected, setSelected] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (selected) {
      params.set('rating', selected);
    } else {
      params.delete('rating');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, [router, selected, searchParams]);

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('rating');
    setSelected('');
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  return (
    <RadioGroup className='flex flex-col'>
      <div className="flex justify-between items-center mb-4">
        <h2 className='font-bold'>Đánh giá</h2>
        <button
          onClick={handleClearAll}
          className="flex h-fit px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300"
        >
          Xóa tất cả
        </button>
      </div>

      {starValues.map((value) => (
        <div key={value} className='flex justify-center items-center mb-2 gap-4'>
          <Radio
            value={value}
            className="group flex justify-center items-center size-4 rounded-full border border-gray-700 bg-white hover:cursor-pointer"
          >
            <span className="invisible size-2 rounded-full bg-gray-700 group-data-[checked]:visible" />
          </Radio>

          <Rate
            disabled
            allowHalf
            className='text-yellow-500'
            style={{ fontSize: 24 }}
            defaultValue={value}
          />
        </div>
      ))}
    </RadioGroup>
  )
}