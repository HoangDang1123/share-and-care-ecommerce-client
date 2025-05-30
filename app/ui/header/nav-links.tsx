import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllCategories, getChildCategories } from '@/app/api/category';
import { CategoryResponse } from '@/interface/category';
import { useMenu } from '@/app/context/AppContext';

export default function NavLinks() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [childCategories, setChildCategories] = useState<{ [key: string]: CategoryResponse[] }>({});
  const [isOpenArray, setIsOpenArray] = useState<boolean[]>([]);

  const { setIsMenu } = useMenu();

  useEffect(() => {
    setIsOpenArray(new Array(categories.length).fill(false));
  }, [categories]);

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

  const handleOnMouseEnter = async (index: number, categoryId: string) => {
    if (childCategories[categoryId]?.length > 0) {
      setIsMenu(true);
    }

    setIsOpenArray((prev) => {
      const newArray = [...prev];
      newArray[index] = true;
      return newArray;
    });

    // Fetch child categories and their children
    await fetchChildCategoriesRecursive(categoryId);
  };

  const fetchChildCategoriesRecursive = async (categoryId: string) => {
    try {
      if (!childCategories[categoryId]) {
        const response = await getChildCategories(categoryId);
        setChildCategories((prev) => ({
          ...prev,
          [categoryId]: response,
        }));

        // Recursive call to fetch child of child
        for (const child of response) {
          await fetchChildCategoriesRecursive(child.id);
        }
      }
    } catch (error) {
      console.error(`Error fetching child categories recursively for ${categoryId}:`, error);
    }
  };

  const handleOnMouseLeave = (index: number) => {
    setIsMenu(false);

    setIsOpenArray((prev) => {
      const newArray = [...prev];
      newArray[index] = false;
      return newArray;
    });
  };

  return (
    <div className="sm:hidden md:flex">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className="inline-flex group"
          onMouseEnter={() => handleOnMouseEnter(index, category.id)}
          onMouseLeave={() => handleOnMouseLeave(index)}
        >
          <Link
            href="/shop"
            className='flex grow items-center justify-center gap-2 rounded-xl md:text-xl xl:text-2xl text-gray-900 font-bold hover:bg-gray-200 flex-none px-6 py-4'
          >
            {category.name.toUpperCase()}
          </Link>

          {isOpenArray[index] && childCategories[category.id]?.length > 0 && (
            <div className="absolute grid grid-cols-6 border top-14 inset-x-60 mt-2 px-6 bg-white shadow-lg rounded-md p-2">
              {childCategories[category.id].map((child) => (
                <div key={child.id} className="relative group">
                  <Link
                    href={`/shop?category=${child.id}`}
                    className="block px-2 py-1 rounded-xl font-semibold text-xl text-gray-900 transition duration-300 transform hover:scale-105 hover:font-bold"
                  >
                    {child.name}
                  </Link>

                  {childCategories[child.id]?.length > 0 && (
                    <div className='border-l-2 ml-2 pl-1'>
                      {childCategories[child.id].map((subChild) => (
                        <Link
                          key={subChild.id}
                          href={`/shop?category=${subChild.id}`}
                          className="block px-2 py-1 rounded-xl text-lg text-gray-700 transition duration-300 transform hover:scale-105 hover:font-semibold"
                        >
                          {subChild.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}