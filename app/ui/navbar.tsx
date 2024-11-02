'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'About Us', href: '/about' },
  {
    name: 'Blog',
    href: '/blog',
  },
  { name: 'Customer Service', href: '/customer-service' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="bg-gray-900">
      <div className="relative flex h-12 items-center justify-between sm:px-5 lg:px-20">
        <div className="absolute inset-y-0 left-2 flex items-center sm:hidden">
          {/* Mobile menu button*/}
          <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span className="absolute -inset-0.5" />
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
            <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
          </DisclosureButton>
        </div>
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-end">
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-2">
              {links.map((link) => {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      'flex grow items-center justify-center gap-2 rounded-md text-sm text-white font-medium hover:bg-gray-700 flex-none p-2 px-3',
                      {
                        'bg-gray-700': pathname === link.href,
                      },
                    )}
                  >
                    <p className="hidden md:block">{link.name}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {links.map((link) => {
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'flex grow items-center gap-2 rounded-md p-3 text-sm text-white font-medium hover:bg-gray-700 flex-none justify-start px-3',
                  {
                    'bg-gray-700': pathname === link.href,
                  },
                )}
              >
                <p className="block md:hidden">{link.name}</p>
              </Link>
            );
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
