import { UserIcon } from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from 'next/link';
import { logoutRequest } from '@/app/api/auth';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface UserProps {
  isLogin: boolean;
}

const User: React.FC<UserProps> = ({ isLogin }) => {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";

  const handleGoToProfile = () => { }

  const handleLogout = async () => {
    if (!accessToken) {
      toast.error("Access token is not available.");
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await logoutRequest(userId, accessToken);
      toast.success("Logout successfull.");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An error occurred during logout.");
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenTimestamp');
        localStorage.removeItem('order');
        localStorage.removeItem('productPrice');
        localStorage.removeItem('deliveryFee');
        localStorage.removeItem('isLogin');
      }
    }
  }

  const guest = [
    { name: 'Login', href: '/auth/login' },
    { name: 'Sign Up', href: '/auth/sign-up' },
  ];

  const customer = [
    { name: 'Profile', click: handleGoToProfile, href: '/profile' },
    { name: 'Logout', click: handleLogout, href: '/auth/login' },
  ];

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center xl:hover:bg-gray-200 p-1 rounded-md">
        <UserIcon className="sm:size-7 xl:size-8" />
      </MenuButton>
      <MenuItems
        transition
        as={motion.div}
        initial={{ y: '-50%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        anchor="bottom end"
        className="relative z-10 mt-2 sm:w-36 md:w-48 rounded-lg bg-white shadow-lg"
      >
        {isLogin ? (
          customer.map((item, index) => (
            <MenuItem key={index}>
              <Link
                href={item.href}
                onClick={() => {
                  item.click();
                }}
                className="block w-full rounded-lg sm:text-md xl:text-lg py-2 px-3 transition hover:bg-gray-200"
              >
                {item.name}
              </Link>
            </MenuItem>
          ))
        ) : (
          guest.map((item, index) => (
            <MenuItem key={index}>
              <Link href={item.href} className="block rounded-lg sm:text-md xl:text-lg py-2 px-3 transition hover:bg-gray-200">
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