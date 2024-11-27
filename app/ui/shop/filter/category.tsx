'use client'

import { getAllCategories, getChildCategories } from "@/app/api/category";
import { CategoryDataResponse } from "@/interface/category";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export default function CategoryFilter() {
  const [categories, setCategories] = useState<Array<CategoryDataResponse>>([]);
  const [childCategories, setChildCategories] = useState<Array<CategoryDataResponse[]>>([]);

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

  return (
    <div className='flex flex-col select-none'>
      <h1 className='font-bold mb-2'>Category</h1>

      {categories.map((category, index) => (
        <div key={index} className='flex flex-col items-start'>
          <div className="flex">
            <span className="block text-lg font-semibold px-2">
              {category.name}
            </span>
            <span className="w-full" />
          </div>

          <div className="grid grid-cols-2 gap-x-6 w-full px-4">
            <div className="flex items-center space-x-2 text-lg py-1 px-2">
              <Checkbox
                className="group block size-5 rounded border border-gray-700 bg-white data-[checked]:bg-gray-200 hover:cursor-pointer"
              >
                <CheckIcon className='opacity-0 group-data-[checked]:opacity-100' />
              </Checkbox>
              <h6 className="text-lg mt-1">{`All ${category.name}`}</h6>
            </div>

            {Array.isArray(childCategories[index]) && childCategories[index].map((child, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-lg py-1 px-2"
              >
                <Checkbox
                  className="group block size-5 rounded border border-gray-700 bg-white data-[checked]:bg-gray-200 hover:cursor-pointer"
                >
                  <CheckIcon className='opacity-0 group-data-[checked]:opacity-100' />
                </Checkbox>
                <h6 className="text-lg mt-1">{child.name}</h6>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
