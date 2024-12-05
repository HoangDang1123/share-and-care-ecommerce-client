'use client'

import React, { useEffect, useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ArrowRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { CartDataResponse } from '@/interface/cart';
import { getCart } from '@/app/api/cart';

interface CartProps {
  isLogin: boolean;
}

const Cart: React.FC<CartProps> = ({ isLogin }) => {
  const [cart, setCart] = useState<CartDataResponse>();

  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchCart = async () => {
      if (userId !== null && accessToken !== null) {
        try {
          const response = await getCart(userId, accessToken);
          setCart(response);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { }
      }
    }

    fetchCart();
  }, [accessToken, setCart, userId]);

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton>
          <ShoppingCartIcon className='size-8' />
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute right-0 z-10 w-max origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        {isLogin ? (
          <>
            {cart?.items.length === 0 ? (
              <div className='flex justify-center items-center w-96 text-lg py-4'>There&apos;s no item.</div>
            ) : (
              cart?.items.slice(0, 3).map((cart, index) => (
                <MenuItem key={index}>
                  <Link
                    className='flex w-auto gap-x-10 px-10 py-5 rounded-lg justify-between items-center hover:bg-gray-200'
                    href={`/product/${cart.productId}`}
                  >
                    <Image
                      alt={cart.productName}
                      src={cart.productImage}
                      width={70}
                      height={100}
                    />
                    <h1 className='text-xl'>{cart.productName}</h1>
                    <h1 className='text-xl'>{cart.quantity}</h1>
                    <h1 className='text-xl'>{cart.price}</h1>
                  </Link>
                </MenuItem>
              ))
            )}
            <MenuItem>
              <Link
                href={"/cart"}
                className='flex justify-center items-center my-2 text-lg hover:text-blue-900 font-bold text-blue-700 underline'
              >
                Go to my cart
                <ArrowRightIcon className='size-4 ml-1' />
              </Link>
            </MenuItem>
          </>
        ) : (
          <Link
            href="/auth/login"
            className='flex justify-center items-center w-96 h-20 mx-5 my-10 text-lg hover:text-blue-900 font-bold text-blue-700 underline'
          >
            Go to login
            <ArrowRightIcon className='size-4 ml-1' />
          </Link>
        )}
      </MenuItems>
    </Menu>
  )
}

export default Cart;