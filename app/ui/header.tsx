'use client'

import { Disclosure } from '@headlessui/react'
import Link from 'next/link';
import Image from 'next/image';
import NavLinks from './header/nav-links';
import NavIcons from './header/nav-icons';
import Sidebar from './sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isHidden, setIsHidden] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const triggerPoint = 0;

      if (scrollTop > triggerPoint) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Disclosure as="nav" className="shadow-md bg-white">
      <div className={`relative flex flex-1 h-auto my-2 items-center justify-between sm:px-5 lg:px-20 md:space-x-20 lg:space-x-0 transition-all duration-700 ease-in-out ${isHidden ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-[500px] opacity-100'}`}>
        <div className="sm:block md:hidden w-auto h-auto items-center">
          <Sidebar />
        </div>

        <div className="sm:hidden md:flex items-center">
          <button
            onClick={() => router.push("/")}
            className="p-0 border-none bg-transparent"
            aria-label="Go to homepage"
          >
            <Image
              alt="Share And Care"
              src="/assets/logo.png"
              width={120}
              height={100}
              style={{ width: "100%", height: "100%" }}
            />
          </button>
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
