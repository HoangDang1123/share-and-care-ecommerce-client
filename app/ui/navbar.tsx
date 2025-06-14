'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Cửa hàng', href: '/shop' },
  { name: 'Blog', href: '/blog' },
  { name: 'Về chúng tôi', href: '/about' },
  { name: 'Dịch vụ khách hàng', href: '/customer-service' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className='sm:hidden md:flex justify-end sm:px-6 lg:px-10 bg-gray-900'>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`relative flex items-center justify-center md:text-sm font-medium flex-none mx-1 my-2 px-2 py-1 transition-transform transform-gpu will-change-transform hover:rounded-md ${isActive ? 'bg-gray-200 text-black rounded-md hover:bg-white' : 'text-white hover:bg-gray-700 hover:scale-105'}`}
          >
            <strong>{link.name}</strong>
            <span className='absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full'></span>
          </Link>

        );
      })}
    </div>
  );
}
