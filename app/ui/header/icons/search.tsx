'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ProductResponse } from '@/interface/product';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchCard from '../../search-card';
import { getTopSearchProduct } from '@/app/api/product';
import Link from 'next/link';
import { useMenu } from '@/app/context/AppContext';

export default function Search() {
  const [searchData, setSearchData] = useState('');
  const [searchProductList, setSearchProductList] = useState<ProductResponse[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const { isMenu, setIsMenu } = useMenu();

  useEffect(() => {
    if (searchData) {
      const fetchProducts = async () => {
        try {
          const response = await getTopSearchProduct(searchData);
          setSearchProductList(response.items);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      fetchProducts();
    }
  }, [searchData, setSearchProductList]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!document.getElementById('search-menu')?.contains(e.target as Node)) {
        setIsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchData(e.target.value);
  }

  const handleSearchProduct = (searchData: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchData) {
      params.set('search', searchData);
    } else {
      params.delete('search');
    }
    setIsMenu(false);
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <Menu as="div" id="search-menu" className="relative">
      <MenuButton
        onClick={() => setIsMenu(!isMenu)}
        className="flex items-center xl:hover:bg-gray-200 p-1 rounded-md"
      >
        <MagnifyingGlassIcon className="sm:size-7 xl:size-8" />
      </MenuButton>
      <MenuItems
        transition
        as={motion.div}
        initial={{ y: '-50%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        anchor="bottom"
        className="rounded-lg relative bg-white flex sm:px-4 md:px-20 xl:px-40 sm:py-6 md:py-10 flex-col shadow-lg w-full"
      >
        <div className='space-y-6'>
          <div className='relative'>
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Tìm kiếm..."
              onChange={handleChangeInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchProduct(searchData);
                }
              }}
              className="block w-full rounded-2xl border-0 py-1.5 pl-5 text-gray-900 sm:text-sm sm:leading-6 md:text-xl ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-400"
            />

            <MagnifyingGlassIcon className="absolute right-3 top-2 size-6 text-gray-400" />
          </div>

          <div className='sm:hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-6 px-4 w-full'>
            {searchProductList.map((product, index) => (
              <MenuItem key={index}>
                <Link href={`/product/${product.code}`}>
                  <SearchCard product={product} />
                </Link>
              </MenuItem>
            ))}
          </div>
        </div>
      </MenuItems>
    </Menu>
  )
}