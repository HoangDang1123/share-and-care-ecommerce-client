'use client'

import React, { useEffect, useState } from 'react'
import BackButton from '../ui/back-button';
import data from "@/data/data.json";
import Link from 'next/link';
import ItemTable from '../ui/cart/item-table';
import SelectedAllCombobox from '../ui/cart/selected-all-combobox';
import { formatPrice } from '@/utils/Transaction';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function Page() {
  const cart = data.carts;

  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Array<boolean>>(new Array(cart.length).fill(false));
  const [isFixed, setIsFixed] = useState(false);
  const route = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const triggerPoint = 175;

      if (scrollTop > triggerPoint) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const totalCost = selectedItem.reduce((total, isSelected, index) => {
    return isSelected ? total + cart[index].item.price : total;
  }, 0);

  const goToOrder = () => {
    route.push(`/order/?refreshToken=${process.env.NEXT_PUBLIC_REFRESHTOKEN}`);
  }

  return (
    <div className='sm:px-6 md:px-12 lg:px-24 my-10'>
      <div className='flex items-center space-x-24'>
        <BackButton previousPathname={`/?refreshToken=${process.env.NEXT_PUBLIC_REFRESHTOKEN}`} />

        <ul className="flex space-x-1 text-xl">
          <li>
            <Link href={`/?=${process.env.NEXT_PUBLIC_}`} className='text-gray-400 hover:text-gray-900'>Home / </Link>
          </li>
          <li>
            My Cart
          </li>
        </ul>
      </div>

      <div className='flex mt-10 px-24 space-x-20'>
        <div className='flex flex-col items-start space-y-4'>
          <div className='flex justify-between items-center w-full px-4'>
            <SelectedAllCombobox selectedAll={selectedAll} setSelectedAll={setSelectedAll} />
            <div className='flex mt-1 space-x-2'>
              <h4 className='font-semibold'>Total:</h4>
              <h4>{`${cart.length} ${cart.length > 1 ? 'items' : 'item'}`}</h4>
            </div>
          </div>
          <ItemTable selectedAll={selectedAll} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        </div>

        <div
          className={`flex flex-col w-[390px] h-fit mt-14 shadow-lg px-4 py-10 space-y-10 rounded-lg transition-all duration-300 ease-in-out ${isFixed ? 'fixed top-32 right-[200px]' : ''}`}
        >
          <h1>Order Summary</h1>

          <div className='space-y-4'>
            <div className='flex justify-between'>
              <h4 className='font-semibold'>Product Cost:</h4>
              <h4>{`${formatPrice(totalCost)}`}</h4>
            </div>

            <div className='flex justify-between'>
              <h4 className='font-semibold'>Discount:</h4>
              <h4>-40.000 đ</h4>
            </div>

            <div className='w-full h-0.5 bg-gray-200' />

            <div className='flex justify-between'>
              <h4 className='font-semibold'>Total Cost:</h4>
              <h4>{formatPrice(totalCost - 40000)}</h4>
            </div>
          </div>

          <button
            onClick={goToOrder}
            className='flex justify-center items-center text-xl font-semibold bg-gray-900 px-6 py-2 rounded-md text-white'
          >
            <ShoppingCartIcon className='size-8 mr-3' />
            Order
          </button>
        </div>
      </div>
    </div>
  )
}
