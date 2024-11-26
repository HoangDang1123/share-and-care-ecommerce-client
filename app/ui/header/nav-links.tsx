import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllCategories } from '@/app/api/product';
import { CategoryDataResponse } from '@/interface/product';

interface CategoryLink {
  name: string,
  href: string,
}

const links = [
  { name: 'TOP SALES', href: '/top-sales' },
  { name: 'BEST SELLER', href: '/best-seller' },
  { name: 'LATEST', href: '/latest' },
];

export default function NavLinks() {
  const [categories, setCategories] = useState<Array<CategoryDataResponse>>([]);
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

  const categoriesLink: Array<CategoryLink> = [];

  for (let i = 0; i < categories.length; i++) {
    categoriesLink.push({ name: categories[i].name, href: `/categories/${categories[i].name.toLowerCase()}` });
  }

  return (
    <div className="flex space-x-4">
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className='flex grow items-center justify-center gap-2 rounded-md text-2xl text-gray-900 font-medium hover:bg-gray-200 flex-none p-2 px-3'
          >
            <strong className="hidden md:block">{link.name}</strong>
          </Link>
        );
      })}

      <div
        className="relative inline-flex group"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Link
          href="/categories/all"
          className='relative flex grow items-center justify-center gap-2 rounded-md text-2xl text-gray-900 font-medium hover:bg-gray-200 flex-none p-2 px-3'
        >
          <strong className="hidden md:block">CATEGORIES</strong>
        </Link>

        <div
          className={`absolute right-0 z-10 mt-12 w-full origin-top-right rounded-md bg-white shadow-lg transition-opacity duration-300 ease-in-out ${isOpen ? 'block opacity-100' : 'hidden opacity-0'
            }`}
        >
          {categoriesLink.map((category, index) => (
            <div key={index}>
              <Link href={category.href} className="block rounded-lg text-lg py-2 px-3 transition hover:bg-gray-200">
                {category.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
