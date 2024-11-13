import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ArrowRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

interface CartProps {
    isLogin: boolean;
}

const carts = [
    { name: 'Hoodies', quantity: 1000, price: "99.000đ", image: "/assets/Product.png" },
    { name: 'Hoodies', quantity: 1000, price: "99.000đ", image: "/assets/Product.png" },
    { name: 'Hoodies', quantity: 1000, price: "99.000đ", image: "/assets/Product.png" },
]

const Cart: React.FC<CartProps> = ({ isLogin }) => {
    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <MenuButton>
                    <ShoppingCartIcon className='size-8' />
                </MenuButton>
            </div>
            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-auto origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                {isLogin ? (
                    <>
                        {carts.map((cart, index) => (
                            <MenuItem key={index}>
                                <Link
                                    className='flex w-max gap-x-10 px-10 py-5 rounded-lg justify-between items-center hover:bg-gray-200'
                                    href="#"
                                >
                                    <Image
                                        alt={cart.name}
                                        src={cart.image}
                                        width={70}
                                        height={100}
                                    />
                                    <h1 className='text-xl'>{cart.name}</h1>
                                    <h1 className='text-xl'>{cart.quantity}</h1>
                                    <h1 className='text-xl'>{cart.price}</h1>
                                </Link>
                            </MenuItem>
                        ))}
                        <Link
                            href="#"
                            className='flex justify-center items-center mb-2 text-lg hover:text-blue-900 font-bold text-blue-700 underline'
                        >
                            Go to my cart
                            <ArrowRightIcon className='size-4 ml-1' />
                        </Link>
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