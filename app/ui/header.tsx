'use client'

import { Disclosure } from '@headlessui/react'
import Link from 'next/link';
import Image from 'next/image';
import NavLinks from './header/nav-links';
import NavIcons from './header/nav-icons';
import Sidebar from './sidebar';

export default function Header() {
  return (
    <Disclosure as="nav" className="shadow-md bg-white">
      <div className="relative flex flex-1 h-auto my-2 items-center justify-between sm:px-5 lg:px-20 md:space-x-20 lg:space-x-0">
        <div className="sm:block md:hidden w-auto h-auto items-center">
          <Sidebar />
        </div>

        <div className="sm:hidden md:flex items-center">
          <Link href="/" passHref>
            <Image
              alt="Share And Care"
              src="/assets/logo.png"
              width={120}
              height={100}
              style={{ width: "100%", height: "100%" }}
            />
          </Link>
        </div>

        <div className="sm:flex md:hidden items-center">
          <Link href="/" passHref>
            <Image
              alt="Share And Care"
              src="/assets/logo.png"
              width={60}
              height={50}
              style={{ width: "100%", height: "100%" }}
            />
          </Link>
        </div>

        <div className="sm:hidden md:flex w-auto h-auto items-center justify-center">
          <NavLinks />
        </div>

        <div className="flex w-auto h-auto items-center justify-center">
          <NavIcons />
        </div>
      </div>
    </Disclosure>
  )
}
