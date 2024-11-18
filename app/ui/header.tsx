'use client'

import { Disclosure } from '@headlessui/react'
import Link from 'next/link';
import Image from 'next/image';
import NavLinks from './header/nav-links';
import NavIcons from './header/nav-icons';

export default function Header() {

  return (
    <Disclosure as="nav" className="shadow-md bg-white">
      <div className="relative flex h-auto my-2 items-center justify-between sm:px-5 lg:px-20">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link href={`/?refreshToken=${process.env.NEXT_PUBLIC_REFRESHTOKEN}`} passHref>
              <Image
                alt="Share And Care"
                src="/assets/logo.png"
                width={120}
                height={100}
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex items-center justify-center">
            <NavLinks /> 
          </div>

          <div className="hidden sm:ml-6 sm:flex items-center justify-center">
            <NavIcons />
          </div>
        </div>
      </div>
    </Disclosure>
  )
}
