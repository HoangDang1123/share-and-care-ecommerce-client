'use client'

import React, { useEffect } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ArrowRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { getCart } from '@/app/api/cart';
import { formatPrice } from '@/utils/helpers';
import { useCart } from '@/app/context/AppContext';
import { motion } from 'framer-motion';

interface CartProps {
  isLogin: boolean;
}

const Cart: React.FC<CartProps> = ({ isLogin }) => {
  const { cart, setCart } = useCart();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchCart = async () => {
      if (userId !== "" && accessToken !== "") {
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
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center xl:hover:bg-gray-200 p-1 rounded-md">
        <ShoppingCartIcon className="sm:size-7 xl:size-8" />
      </MenuButton>
      <MenuItems
        transition
        as={motion.div}
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        anchor="bottom end"
        className="relative z-10 mt-2 sm:w-full md:w-[600px] rounded-lg bg-white shadow-lg"
      >
        {isLogin ? (
          <>
            {cart?.items.length === 0 ? (
              <div className='flex justify-center items-center text-lg py-4'>There&apos;s no item.</div>
            ) : (
              cart?.items.slice(0, 3).map((cart, index) => (
                <MenuItem key={index}>
                  <Link
                    className='flex w-auto gap-x-10 sm:px-5 md:px-10 py-5 rounded-lg justify-between items-center hover:bg-gray-200'
                    href="/cart"
                  >
                    <Image
                      alt={cart.productName}
                      src={cart.productImage}
                      width={70}
                      height={100}
                    />
                    <h1 className='sm:text-lg md:text-xl'>{cart.productName}</h1>
                    <h1 className='sm:text-lg md:text-xl'>{cart.quantity}</h1>
                    <h1 className='sm:text-lg md:text-xl'>{formatPrice(cart.price)}</h1>
                  </Link>
                </MenuItem>
              ))
            )}
            <MenuItem>
              <Link
                href={"/cart"}
                className='flex justify-center items-center my-2 sm:text-md xl:text-lg w-full hover:text-blue-900 font-bold text-blue-700 underline'
              >
                Go to my cart
                <ArrowRightIcon className='size-4 ml-1' />
              </Link>
            </MenuItem>
          </>
        ) : (
          <Link
            href="/auth/login"
            className='flex justify-center items-center sm:h-4 xl:h-20 mx-5 my-10 sm:text-md xl:text-lg hover:text-blue-900 font-bold text-blue-700 underline'
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