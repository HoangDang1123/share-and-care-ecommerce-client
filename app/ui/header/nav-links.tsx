import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllCategories } from '@/app/api/category';
import { CategoryResponse } from '@/interface/category';
import { useMenu } from '@/app/context/AppContext';

export default function NavLinks() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { setIsMenu } = useMenu();

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

  const handleOnMouseEnter = (index: number) => {
    setIsMenu(true);
    setHoveredIndex(index);
  };

  const handleOnMouseLeave = () => {
    setIsMenu(false);
    setHoveredIndex(null);
  };

  return (
    <div className="sm:hidden md:grid grid-cols-4">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className="inline-flex group"
          onMouseEnter={() => handleOnMouseEnter(index)}
          onMouseLeave={() => handleOnMouseLeave()}
        >
          <Link
            href="/shop"
            title={category.name}
            className={`flex grow items-center justify-center gap-2 rounded-xl md:text-base xl:text-xl text-gray-900 font-bold flex-none px-4 py-2 ${hoveredIndex === index ? 'bg-gray-200' : ''}`}
          >
            {category.name.toUpperCase()}
          </Link>

          {hoveredIndex === index && category.children?.length > 0 && (
            <div>
              <span className='absolute top-12 inset-x-60 h-6 w-full' />
              <div className="absolute grid grid-cols-6 border top-14 inset-x-60 mt-2 px-6 bg-white shadow-lg rounded-md p-8 z-50">
                {category.children.map((child) => (
                  <div key={child.id} className="relative group">
                    <Link
                      href={`/shop?category=${child.id}`}
                      className="block px-2 py-1 rounded-xl font-semibold text-xl text-gray-900 transition duration-300 transform hover:scale-105 hover:font-bold"
                    >
                      {child.name}
                    </Link>

                    {child.children?.length > 0 && (
                      <div className='border-l-2 ml-2 pl-1'>
                        {child.children.map((subChild) => (
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
