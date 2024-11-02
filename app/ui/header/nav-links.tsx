import Link from 'next/link';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const links = [
  { name: 'TOP SALES', href: '/top-sales' },
  { name: 'BEST SELLER', href: '/best-seller' },
  { name: 'LATEST', href: '/latest' },
];

const categories = [
  { name: 'T-shirt', href: '/categories/t-shirt' },
  { name: 'Shirt', href: '/categories/shirt' },
  { name: 'Hoodies', href: '/categories/hoodies' },
];

export default function NavLinks() {
  const user_id = null;

  return (
    <div className="flex space-x-4">
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={user_id ? `/${user_id}${link.href}` : link.href}
            className='flex grow items-center justify-center gap-2 rounded-md text-2xl text-gray-900 font-medium hover:bg-gray-200 flex-none p-2 px-3'
          >
            <strong className="hidden md:block">{link.name}</strong>
          </Link>
        );
      })}

      <Menu as="div" className="relative ml-3">
        <div>
          <MenuButton className='flex grow items-center justify-center gap-2 rounded-md text-2xl text-gray-900 font-medium hover:bg-gray-200 flex-none p-2 px-3'>
            <strong className="hidden md:block">CATEGORIES</strong>
            <ChevronDownIcon className='size-6' />
          </MenuButton>
        </div>
        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          {categories.map((category, index) => {
            return (
              <MenuItem key={index}>
                <a href={category.href} className="block rounded-lg text-lg py-2 px-3 transition hover:bg-gray-200">
                  {category.name}
                </a>
              </MenuItem>
            );
          })}
        </MenuItems>
      </Menu>
    </div>
  )
}
