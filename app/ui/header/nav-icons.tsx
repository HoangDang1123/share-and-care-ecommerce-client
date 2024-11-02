import { Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { UserIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const options = [
    { name: 'Login', href: '/categories/t-shirt' },
    { name: 'Sign Up', href: '/categories/shirt' },
];

const carts = [
    { name: 'Hoodies', quantity: 1000, price: "99.000đ", image: "/assets/Product.png" },
    { name: 'Hoodies', quantity: 1000, price: "99.000đ", image: "/assets/Product.png" },
    { name: 'Hoodies', quantity: 1000, price: "99.000đ", image: "/assets/Product.png" },
]

export default function NavIcons() {
    return (
        <div className="flex space-x-6">
            <Popover as="div" className="relative ml-3">
                {({ open }) => (
                    <>
                        <PopoverButton>
                            <MagnifyingGlassIcon className='size-8' />
                        </PopoverButton>
                        <AnimatePresence>
                            {open && (
                                <PopoverPanel
                                    static
                                    as={motion.div}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    anchor="bottom"
                                    className="rounded-lg relative bg-white flex mt-5 px-20 py-10 flex-col shadow-lg w-full"
                                >
                                    <input
                                        id="search"
                                        name="search"
                                        type="text"
                                        placeholder="Search..."
                                        className="block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 sm:text-sm sm:leading-6 md:text-xl ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-400"
                                    />
                                </PopoverPanel>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </Popover>

            <Menu as="div" className="relative ml-3">
                <div>
                    <MenuButton>
                        <UserIcon className='size-8' />
                    </MenuButton>
                </div>
                <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    {options.map((option, index) => {
                        return (
                            <MenuItem key={index}>
                                <a href={option.href} className="block rounded-lg text-lg py-2 px-3 transition hover:bg-gray-200">
                                    {option.name}
                                </a>
                            </MenuItem>
                        );
                    })}
                </MenuItems>
            </Menu>

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
                    {carts.map((cart, index) => {
                        return (
                            <MenuItem key={index}>
                                <Link
                                    className='flex block w-max gap-x-10 px-10 py-5 rounded-lg justify-between items-center hover:bg-gray-200'
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
                        );
                    })}
                </MenuItems>
            </Menu>
        </div>
    )
}
