'use client'

import { useOrder } from '@/app/context/AuthContext';
import { formatPrice } from '@/utils/helpers';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function OrderSummary() {
  const [isFixed, setIsFixed] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { order } = useOrder();

  const productPrice = Number(localStorage.getItem('productPrice'));
  const deliveryFee = Number(localStorage.getItem('deliveryFee'));

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const triggerPoint = 120;

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

  return (
    <div
          className={`flex flex-col w-[390px] h-fit shadow-lg px-4 py-10 space-y-10 rounded-lg transition-all duration-300 ease-in-out ${isFixed ? 'fixed top-44 right-[175px]' : ''}`}
        >
      <h1>Order Summary</h1>
      <div className='space-y-4'>
        <div className='flex justify-between'>
          <h4 className='font-semibold'>Product Cost:</h4>
          <h4>{`${formatPrice(productPrice)}`}</h4>
        </div>

        <div className='flex justify-between'>
          <h4 className='font-semibold'>Shipping Fee:</h4>
          <h4>{formatPrice(deliveryFee)}</h4>
        </div>

        {/* <div className='flex justify-between'>
                    <h4 className='font-semibold'>Discount:</h4>
                    <h4>{`-${formatPrice(order.discount)}`}</h4>
                </div> */}

        <div className='w-full h-0.5 bg-gray-200' />

        <div className='flex justify-between'>
          <h4 className='font-semibold'>Total Cost:</h4>
          <h4>{formatPrice(productPrice - deliveryFee)}</h4>
        </div>
      </div>

      <div className='flex flex-col space-y-4'>
        <button
          className='flex justify-center items-center text-xl font-semibold bg-gray-900 px-6 py-2 rounded-md text-white'
        >
          <ShoppingCartIcon className='size-8 mr-3' />
          Order
        </button>
      </div>
    </div>
  )
}
