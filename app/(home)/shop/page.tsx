'use client'

import { getAllProduct, getShopProducts } from "@/app/api/product";
import { useFilter } from "@/app/context/FilterContext";
import Card from "@/app/ui/card";
import Pagination from "@/app/ui/pagination";
import FilterContainer from "@/app/ui/shop/filter-container";
import SortSelected from "@/app/ui/shop/sort-selected";
import { FetchProductsParams, Product } from "@/interface/product";
import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { price } = useFilter();
  const [productList, setProductList] = useState<Product>();
  const [searchData, setSearchData] = useState('');
  const [sort, setSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchProducts = async () => {
    const searchData = searchParams.get('search');
    const categoryData = searchParams.get('category');
    const minPriceData = searchParams.get('minPrice');
    const maxPriceData = searchParams.get('maxPrice');
    const minRatingData = searchParams.get('minRating');
    const attributesParam = searchParams.get('attributes');

    let response;

    try {
      const filters: FetchProductsParams = {};

      if (searchData) filters.search = searchData;
      if (categoryData) filters.categoryId = categoryData;
      if (minPriceData) filters.minPrice = Number(minPriceData);
      if (maxPriceData) filters.maxPrice = Number(maxPriceData);
      if (minRatingData) filters.minRating = Number(minRatingData);
      if (sort) filters.sort = sort;

      if (attributesParam) {
        try {
          const decoded = decodeURIComponent(attributesParam);
          filters.attributes = JSON.parse(decoded);
        } catch (err) {
          console.error("Invalid attribute filter:", err);
        }
      }

      response = Object.keys(filters).length > 0
      ? await getShopProducts(filters, currentPage, pageSize)
      : await getAllProduct(currentPage, pageSize);

      setProductList(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price.values, searchParams, sort, currentPage, pageSize]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchData) params.set('search', searchData);
    else params.delete('search');

    router.push(`/shop?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (sort) params.set('sort', sort);
    else params.delete('sort');

    router.push(`/shop?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchData(e.target.value);
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="sm:hidden md:flex justify-between w-full bg-gray-200 p-4 gap-x-10 rounded-xl">
        <div className='relative w-full'>
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Tìm kiếm..."
            onChange={handleChangeInput}
            className="block w-full rounded-lg border-0 py-1.5 pl-5 text-gray-900 sm:text-sm sm:leading-6 md:text-lg placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-400"
          />
          <MagnifyingGlassIcon className="absolute right-3 top-2 size-6 text-gray-400" />
        </div>

        <SortSelected setSort={setSort} />
      </div>

      {!productList || productList.total === 0 ? (
        <div className='h-[480px] flex justify-center items-center'>
          Sản phẩm không tồn tại.
        </div>
      ) : (
        <div className="flex flex-col gap-y-20">
          <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-10 sm:gap-y-8 md:gap-y-16 items-stretch">
            {productList.items.map((product, index) => (
              <Card key={index} product={product} />
            ))}
          </div>

          <div className='flex justify-center items-center gap-x-4 mt-4'>
            <Pagination
              currentPage={currentPage}
              totalItems={productList.total}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />

            <div className='flex justify-center items-center gap-x-2'>
              <select
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1);
                }}
                className="border rounded-md p-1 text-base"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
              <span>sản phẩm mỗi trang</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-l-xl shadow-lg z-50 hover:bg-indigo-700"
        >
          <FunnelIcon className="w-6 h-6" />
        </button>

        <div
          className={`
          fixed top-0 right-0 h-full sm:w-2/3 lg:w-1/3 bg-white shadow-xl z-40 p-4 transition-transform duration-300 overflow-scroll
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Lọc sản phẩm</h2>
            <button onClick={() => setIsOpen(false)}>
              <XMarkIcon className="w-6 h-6 text-gray-600 hover:text-black" />
            </button>
          </div>
          <FilterContainer />
        </div>

        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}