'use client'

import { RadioGroup } from '@headlessui/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const priceRanges = [
  { label: 'Dưới 100.000₫', value: [0, 100000] },
  { label: '100.000₫ - 200.000₫', value: [100000, 200000] },
  { label: '200.000₫ - 300.000₫', value: [200000, 300000] },
  { label: '300.000₫ - 500.000₫', value: [300000, 500000] },
  { label: '500.000₫ - 700.000₫', value: [500000, 700000] },
  { label: '700.000₫ - 1.000.000₫', value: [700000, 1000000] },
  { label: '1.000.000₫ - 1.500.000₫', value: [1000000, 1500000] },
  { label: '1.500.000₫ - 2.000.000₫', value: [1500000, 2000000] },
  { label: 'Trên 2.000.000₫', value: [2000000, 999999999] }, // giả định giới hạn trên
];

export default function PriceFilter() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const min = Number(searchParams.get('minPrice'));
    const max = Number(searchParams.get('maxPrice'));

    if (!min && !max) return;

    const foundIndex = priceRanges.findIndex(
      (range) => range.value[0] === min && range.value[1] === max
    );

    if (foundIndex !== -1) {
      setSelectedIndex(foundIndex);
    } else {
      setSelectedIndex(null);
    }
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedIndex !== null) {
      const [min, max] = priceRanges[selectedIndex].value;
      params.set('minPrice', String(min));
      params.set('maxPrice', String(max));
    } else {
      params.delete('minPrice');
      params.delete('maxPrice');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, [selectedIndex]);

  const handleClearAll = () => {
    setSelectedIndex(null);
    const params = new URLSearchParams(searchParams);
    params.delete('minPrice');
    params.delete('maxPrice');
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="font-bold sm:text-lg md:text-2xl">Giá</span>
        <button
          onClick={handleClearAll}
          className="px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Xóa tất cả
        </button>
      </div>

      <RadioGroup value={selectedIndex} onChange={setSelectedIndex} className="flex flex-col gap-2">
        {priceRanges.map((range, idx) => (
          <RadioGroup.Option
            key={idx}
            value={idx}
            className={({ checked }) =>
              `px-3 py-2 rounded-md cursor-pointer border text-sm ${checked ? 'bg-green-100 border-green-600 text-green-700' : 'bg-white border-gray-300'
              }`
            }
          >
            {range.label}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  );
}
