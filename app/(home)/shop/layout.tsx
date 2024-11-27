import BackButton from "@/app/ui/back-button";
import FilterContainer from "@/app/ui/shop/filter-container";
import Link from "next/link";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='sm:px-6 md:px-12 lg:px-24 my-10'>
      <div className='flex items-center space-x-24'>
        <BackButton previousPathname="/" />

        <ul className="flex space-x-1 text-xl">
          <li>
            <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
          </li>
          <li>
            Shop
          </li>
        </ul>
      </div>

      <div className='grid grid-cols-[1fr_3fr] mt-10 gap-10'>
        <div>
          <FilterContainer />
        </div>
        <div className="col-span-1">
          {children}
        </div>
      </div>
    </div>
  )
}