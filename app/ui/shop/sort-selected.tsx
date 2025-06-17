'use client';

import { Fragment, useState } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface SortSelectedProps {
  setSort: (sort: string) => void;
}

const defaultOption = { value: '', label: 'Sắp xếp' };

const groupedOptions = [
  {
    label: '💰 Giá',
    options: [
      { value: '-MIN_PRICE', label: 'Cao tới Thấp' },
      { value: 'MIN_PRICE', label: 'Thấp tới Cao' },
    ],
  },
  {
    label: '👀 Lượt xem',
    options: [
      { value: '-VIEWS', label: 'Nhiều nhất' },
      { value: 'VIEWS', label: 'Ít nhất' },
    ],
  },
  {
    label: '🛒 Bán chạy',
    options: [
      { value: '-SOLD', label: 'Nhiều nhất' },
      { value: 'SOLD', label: 'Ít nhất' },
    ],
  },
  {
    label: '📦 Tồn kho',
    options: [
      { value: '-QUANTITY', label: 'Nhiều nhất' },
      { value: 'QUANTITY', label: 'Ít nhất' },
    ],
  },
  {
    label: '⭐ Đánh giá',
    options: [
      { value: '-RATING', label: 'Cao nhất' },
      { value: 'RATING', label: 'Thấp nhất' },
    ],
  },
  {
    label: '🕒 Thời gian',
    options: [
      { value: '-CREATED_AT', label: 'Mới nhất' },
      { value: 'CREATED_AT', label: 'Cũ nhất' },
    ],
  },
];

export default function SortSelected({ setSort }: SortSelectedProps) {
  const [selected, setSelected] = useState(defaultOption);

  const handleChange = (option: { value: string; label: string }) => {
    setSelected(option);
    setSort(option.value);
  };

  return (
    <div className="w-64">
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm">
            <span className="block truncate">{selected.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm">
            {/* Mặc định */}
            <Listbox.Option
              value={defaultOption}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                    {defaultOption.label}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>

            {/* Grouped options */}
            {groupedOptions.map((group, groupIdx) => (
              <div key={groupIdx}>
                <div className="px-4 py-1 text-xs text-gray-400 font-semibold">{group.label}</div>
                {group.options.map((option, optIdx) => (
                  <Listbox.Option
                    key={optIdx}
                    value={option}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </div>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
