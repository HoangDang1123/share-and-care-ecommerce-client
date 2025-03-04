import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllCategories, getChildCategories } from '@/app/api/category';
import { CategoryDataResponse } from '@/interface/category';

const links = [
  { name: 'ABOUT US', href: '/about' },
  {
    name: 'BLOG',
    href: '/blog',
  },
  { name: 'SERVICE', href: '/customer-service' },
];

export default function NavLinks() {
  const [categories, setCategories] = useState<Array<CategoryDataResponse>>([]);
  const [childCategories, setChildCategories] = useState<Array<CategoryDataResponse[]>>([]);
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="sm:hidden md:flex space-x-8">
      <div
        className="relative inline-flex group"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Link
          href="/shop"
          className='relative flex grow items-center justify-center gap-2 rounded-md md:text-xl xl:text-2xl text-gray-900 font-medium hover:bg-gray-200 flex-none px-3 py-2'
        >
          <strong>SHOP</strong>
        </Link>

        <div
          className={`absolute flex w-[1080px] -right-[760px] z-10 mt-12 origin-top space-x-10 px-10 py-5 rounded-md bg-white shadow-lg transition-opacity duration-300 ease-in-out ${isOpen ? 'block opacity-100' : 'hidden opacity-0'}`}
        >
          {categories.map((category, index) => (
            <div key={index} className='flex flex-col items-start'>
              <span className="block text-xl font-semibold uppercase px-2 transition mb-4">
                {category.name}
              </span>

              <Link 
                href={{ pathname: "/shop", query: { category: category.id } }} 
                className="block w-48 text-start rounded-lg text-lg py-1 px-2 transition hover:font-semibold whitespace-nowrap"
              >
                {`All ${category.name}`}
              </Link>

              {Array.isArray(childCategories[index]) && childCategories[index].map((child, childIndex) => (
                <Link
                  key={childIndex}
                  href={{ pathname: "/shop", query: { category: child.id } }}
                  className="block w-48 text-start rounded-lg text-lg py-1 px-2 transition hover:font-semibold whitespace-nowrap"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className='flex grow items-center justify-center gap-2 rounded-md md:text-xl xl:text-2xl text-gray-900 font-medium hover:bg-gray-200 flex-none px-3 py-2'
          >
            <strong>{link.name}</strong>
          </Link>
        );
      })}
    </div>
  )
}
