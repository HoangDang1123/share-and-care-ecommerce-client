import BackButton from "@/app/ui/back-button";
import Link from "next/link";
import { FilterProvider } from "@/app/context/FilterContext";
import { Suspense } from "react";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProvider>
      <div className='sm:px-6 md:px-12 lg:px-24 sm:my-5 md:my-20'>
        <div className='flex items-center sm:space-x-8 md:space-x-24'>
          <BackButton />

          <ul className="flex space-x-1 sm:text-md md:text-xl">
            <li>
              <Link href="/" className='text-gray-400 text-base hover:text-gray-900'>Trang chủ / </Link>
            </li>
            <li>
              <span className="text-base">Cửa hàng</span>
            </li>
          </ul>
        </div>

        <div className='mt-10'>
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </FilterProvider>
  )
}