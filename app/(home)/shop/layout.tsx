import BackButton from "@/app/ui/back-button";
import FilterContainer from "@/app/ui/shop/filter-container";
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
      <div className='sm:px-6 md:px-12 lg:px-24 sm:my-5 md:my-10'>
        <div className='flex items-center sm:space-x-8 md:space-x-24'>
          <BackButton previousPathname="/" />

          <ul className="flex space-x-1 sm:text-md md:text-xl">
            <li>
              <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
            </li>
            <li>
              Shop
            </li>
          </ul>
        </div>

        <div className='grid md:grid-cols-[1fr_3fr] md:mt-10 sm:gap-4 md:gap-10'>
          <div>
            <FilterContainer />
          </div>
          <div className="col-span-1">
            <Suspense>{children}</Suspense>
          </div>
        </div>
      </div>
    </FilterProvider>
  )
}