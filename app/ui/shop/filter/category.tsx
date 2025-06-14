'use client'

import { getAllCategories, getChildCategories } from "@/app/api/category";
import { CategoryResponse } from "@/interface/category";
import { Radio, RadioGroup } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryFilter() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [childMap, setChildMap] = useState<Record<string, CategoryResponse[]>>({});
  const [selected, setSelected] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
        for (const category of response) {
          await fetchChildRecursive(category.id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChildRecursive = async (categoryId: string) => {
    try {
      if (!childMap[categoryId]) {
        const response = await getChildCategories(categoryId);
        setChildMap(prev => ({ ...prev, [categoryId]: response }));

        for (const child of response) {
          await fetchChildRecursive(child.id);
        }
      }
    } catch (error) {
      console.error(`Error fetching children for ${categoryId}:`, error);
    }
  };

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
    const baseClass = level === 0 ? 'font-bold text-lg' : level === 1 ? 'font-semibold text-md' : 'text-sm text-gray-600';
    const containerClass = level === 0 ? '' : 'ml-6';

    return (
      <div key={category.id} className={`mt-1 ${containerClass}`}>
        <div className="flex items-center gap-x-2 py-1 px-2">
          <Radio
            value={category.id}
            className="group flex justify-center items-center size-4 rounded-full border border-gray-700 bg-white hover:cursor-pointer"
          >
            <span className="invisible size-2 rounded-full bg-gray-700 group-data-[checked]:visible" />
          </Radio>
          <span className={baseClass}>{category.name}</span>
        </div>
        {childMap[category.id]?.map(child => renderCategoryRecursive(child, level + 1))}
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
        <div className="flex justify-between items-center">
          <h2 className='font-bold'>Loại</h2>
          <button
            onClick={handleClearAll}
            className="flex h-fit px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Xóa tất cả
          </button>
        </div>

        {categories.map(category => renderCategoryRecursive(category))}
      </RadioGroup>
    </div>
  );
}