'use client'

import { getAllCategories } from "@/app/api/category";
import { CategoryResponse } from "@/interface/category";
import { Radio, RadioGroup } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryFilter() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selected, setSelected] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (selected) {
      params.set('category', selected);
    } else {
      params.delete('category');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, [router, selected, searchParams]);

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    setSelected('');
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  const renderCategoryRecursive = (category: CategoryResponse, level = 0) => {
    const baseClass =
      level === 0
        ? 'font-bold sm:text-xs md:text-lg'
        : level === 1
          ? 'font-semibold sm:text-xs md:text-md'
          : 'sm:text-xs md:text-sm text-gray-600';
    const containerClass = level === 0 ? '' : 'sm:ml-3 md:ml-6';

    return (
      <div key={category.id} className={`mt-1 ${containerClass}`}>
        <div className="flex items-center gap-x-2 py-1 px-1">
          <Radio
            value={category.id}
            className="group flex flex-shrink-0 justify-center items-center sm:size-3 md:size-4 rounded-full border border-gray-700 bg-white hover:cursor-pointer"
          >
            <span className="invisible sm:size-1 md:size-2 rounded-full bg-gray-700 group-data-[checked]:visible" />
          </Radio>
          <span className={baseClass}>{category.name}</span>
        </div>
        {category.children?.map(child => renderCategoryRecursive(child, level + 1))}
      </div>
    );
  };

  return (
    <div>
      <RadioGroup
        value={selected}
        onChange={setSelected}
        className='flex flex-col select-none'
      >
        <div className="flex justify-between items-center mb-2">
          <span className='font-bold sm:text-lg md:text-2xl'>Loại</span>
          <button
            onClick={handleClearAll}
            className="flex h-fit px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 sm:text-xs md:text-sm"
          >
            Xóa tất cả
          </button>
        </div>

        <div className="grid grid-cols-2">
          {categories.map(category => renderCategoryRecursive(category))}
        </div>
      </RadioGroup>
    </div>
  );
}
