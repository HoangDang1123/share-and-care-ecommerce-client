'use client'

import { getAllCategories, getChildCategories } from "@/app/api/category";
import { CategoryDataResponse } from "@/interface/category";
import { Radio, RadioGroup } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryFilter() {
  const [categories, setCategories] = useState<Array<CategoryDataResponse>>([]);
  const [childCategories, setChildCategories] = useState<Array<CategoryDataResponse[]>>([]);
  const [parentIndex, setParentIndex] = useState('');
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
  }, [setCategories]);

  useEffect(() => {
    const fetchAllChildCategories = async () => {
      const tempCategories: Array<CategoryDataResponse[]> = [];

      const fetchPromises = categories.map(async (category) => {
        try {
          const response = await getChildCategories(category.id);
          tempCategories.push(response);
        } catch (error) {
          console.error("Error fetching child categories:", error);
        }
      });

      await Promise.all(fetchPromises);
      setChildCategories(tempCategories);
    };

    fetchAllChildCategories();
  }, [categories, setChildCategories]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (selected !== '' && parentIndex !== '') {
      params.set('category', selected);
    } else {
      params.delete('category');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, [router, selected, searchParams, parentIndex]);

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');

    setSelected('');

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }

  return (
    <div>
      <RadioGroup
        value={selected}
        onChange={setSelected}
        className='sm:hidden md:flex flex-col select-none'
      >
        <div className="flex justify-between items-center">
          <h1 className='font-bold mb-2'>Category</h1>
          <button
            onClick={handleClearAll}
            className="flex h-fit px-3 py-1 rounded-md border border-gray-700 text-md"
          >
            Clear all
          </button>
        </div>

        {categories.map((category, index) => (
          <div key={index} className='flex flex-col items-start w-full'>
            <div className="flex w-full">
              <span className="block text-lg font-semibold px-2">
                {category.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 w-full px-2">
              <div className="flex items-center space-x-2 text-lg py-1 px-2">
                <Radio
                  value={category.id}
                  className="group flex justify-center items-center size-5 rounded-full border border-gray-700 bg-white hover:cursor-pointer"
                >
                  <span className="invisible size-3 rounded-full bg-gray-700 group-data-[checked]:visible" />
                </Radio>
                <h6 className="text-lg mt-1">{`All ${category.name}`}</h6>
              </div>

              {Array.isArray(childCategories[index]) && childCategories[index].map((child, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-lg py-1 px-2"
                >
                  <Radio
                    value={child.id}
                    className="group flex justify-center items-center size-5 rounded-full border border-gray-700 bg-white hover:cursor-pointer"
                  >
                    <span className="invisible size-3 rounded-full bg-gray-700 group-data-[checked]:visible" />
                  </Radio>
                  <h6 className="text-lg mt-1">{child.name}</h6>
                </div>
              ))}
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="sm:flex md:hidden space-x-4 text-sm">
        <select
          onChange={(e) => setParentIndex(e.target.value)}
          className='sm:w-full md:w-fit p-1 border border-gray-900 border-solid rounded-md'
        >
          <option value="">Category</option>
          {categories.map((category, index) => (
            <option key={index} value={index}>{category.name}</option>
          ))}
        </select>

        <select
          disabled={parentIndex === ''}
          onChange={(e) => setSelected(e.target.value)}
          className='sm:w-full md:w-fit p-1 border border-gray-900 border-solid rounded-md disabled:bg-gray-200 disabled:border-gray-200'
        >
          <option value="">Child category</option>
          {parentIndex !== '' && Array.isArray(childCategories[Number(parentIndex)]) && childCategories[Number(parentIndex)].map((child, index) => (
            <option key={index} value={child.id}>{child.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
