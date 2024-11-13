import React from 'react'
import { UserIcon } from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from 'next/link';

const guest = [
    { name: 'Login', href: '/auth/login' },
    { name: 'Sign Up', href: '/auth/sign-up' },
];

const customer = [
    { name: 'Profile', href: '/auth/login' },
    { name: 'Sign Out', href: '/auth/sign-up' },
];

interface UserProps {
    isLogin: boolean;
}

const User: React.FC<UserProps> = ({ isLogin }) => {
    return (
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
                {isLogin ? (
                    customer.map((item, index) => (
                        <MenuItem key={index}>
                            <Link href={item.href} className="block rounded-lg text-lg py-2 px-3 transition hover:bg-gray-200">
                                {item.name}
                            </Link>
                        </MenuItem>
                    ))
                ) : (
                    guest.map((item, index) => (
                        <MenuItem key={index}>
                            <Link href={item.href} className="block rounded-lg text-lg py-2 px-3 transition hover:bg-gray-200">
                                {item.name}
                            </Link>
                        </MenuItem>
                    ))
                )}
            </MenuItems>
        </Menu>
    )
}

export default User;