import React, { useEffect, useState } from 'react'
import { UserIcon } from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from 'next/link';
import { logoutRequest } from '@/app/api/auth';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';

interface UserProps {
  isLogin: boolean;
}

const User: React.FC<UserProps> = ({ isLogin }) => {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const id = searchParams.get('userId');
    if (id) {
      setUserId(id);
    }
  }, [searchParams]);

  const handleGoToProfile = () => {
  }

  const handleLogout = async () => {
    if (!accessToken) {
      toast.error("Access token is not available.");
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await logoutRequest(userId, accessToken);
      toast.success("Logout successfull.");

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      router.push("/auth/login");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An error occurred during logout.");
    }
  }

  const guest = [
    { name: 'Login', href: '/auth/login' },
    { name: 'Sign Up', href: '/auth/sign-up' },
  ];

  const customer = [
    { name: 'Profile', click: handleGoToProfile },
    { name: 'Logout', click: handleLogout },
  ];

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton>
          <UserIcon className='size-8' />
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        {isLogin ? (
          customer.map((item, index) => (
            <MenuItem key={index}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  item.click();
                }}
                className="block w-full rounded-lg text-lg text-start py-2 px-3 transition hover:bg-gray-200"
              >
                {item.name}
              </button>
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