'use client';

import { Rate } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ratingRanges = [
  { label: 'Từ 5 sao', value: 5 },
  { label: 'Từ 4 sao', value: 4 },
  { label: 'Từ 3 sao', value: 3 },
  { label: 'Từ 2 sao', value: 2 },
  { label: 'Từ 1 sao', value: 1 },
  { label: 'Chưa có đánh giá', value: 0 },
];

export default function RatingFilter() {
  const [selected, setSelected] = useState<number | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
  const minRatingParam = searchParams.get('minRating');
  if (minRatingParam) {
    setSelected(Number(minRatingParam));
  }
}, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selected !== null) {
      params.set('minRating', String(selected));
    } else {
      params.delete('minRating');
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, [selected]);

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('minRating');
    setSelected(null);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">Đánh giá</h2>
        <button
          onClick={handleClearAll}
          className="px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {ratingRanges.map((range) => {
          const isSelected = selected === range.value;
          return (
            <button
              key={range.value}
              onClick={() => setSelected(range.value)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition
                ${isSelected ? 'bg-indigo-50 border-indigo-600' : 'border-gray-300 hover:border-indigo-400'}`}
            >
              <Rate
                disabled
                allowHalf
                character={<StarFilled />}
                defaultValue={range.value}
                className="text-yellow-500"
                style={{ fontSize: 18 }}
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
