import { UserIcon } from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from 'next/link';
import { logoutRequest } from '@/app/api/auth';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  ArrowRightStartOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
  CursorArrowRippleIcon
} from '@heroicons/react/24/outline';
import { reconnectSocket } from '@/utils/socket';
import { useSocket } from '@/app/context/SocketContext';

interface UserProps {
  isLogin: boolean;
}

const User: React.FC<UserProps> = ({ isLogin }) => {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const { setSocket } = useSocket();

  const handleGoToProfile = () => { }

  const handleLogout = async () => {
    if (!accessToken) {
      toast.error("Access token không khả dụng.");
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await logoutRequest(userId, accessToken);
      toast.success("Đăng xuất thành công.");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Đã có lỗi xảy ra trong quá trình đăng xuất.");
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
        localStorage.removeItem('avatarUrl');
        localStorage.removeItem('email');
        localStorage.removeItem('name');

        const socket = reconnectSocket({
          token: localStorage.getItem('accessToken') || '',
          deviceToken: localStorage.getItem('deviceToken') || '',
          role: 'user',
        });

        setSocket(socket);

        socket.on('connect', () => {
          console.log('🔄 Reconnected with anonymous');
        });
      }
    }
  }

  const guest = [
    { name: 'Đăng nhập', icon: <ArrowRightStartOnRectangleIcon className='size-6' />, href: '/auth/login' },
    { name: 'Đăng ký', icon: <CursorArrowRippleIcon className='size-6' />, href: '/auth/sign-up' },
  ];

  const customer = [
    { name: 'Tài khoản', icon: <UserIcon className='size-6' />, click: handleGoToProfile, href: '/profile' },
    { name: 'Đăng xuất', icon: <ArrowLeftStartOnRectangleIcon className='size-6' />, click: handleLogout, href: '/auth/login' },
  ];

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center p-1 rounded-md">
        {isLogin ? (
          <span className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm bg-gray-800 text-white hover:bg-gray-900 hover:border-none">
            <i className="italic font-medium not-italic:font-normal">Xin chào,</i>
            <span className="font-semibold">{localStorage.getItem('name')}</span>
          </span>
        ) : (
          <UserIcon className="sm:size-7 xl:size-8" />
        )}
      </MenuButton>
      <MenuItems
        transition
        as={motion.div}
        initial={{ y: '-50%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        anchor="bottom end"
        className="relative z-10 mt-2 sm:w-32 md:w-44 rounded-lg bg-white shadow-lg"
      >
        {isLogin ? (
          customer.map((item, index) => (
            <MenuItem key={index}>
              <Link
                href={item.href}
                onClick={() => {
                  item.click();
                }}
                className="flex items-center gap-x-2 w-full rounded-lg sm:text-md xl:text-lg py-2 px-3 transition hover:bg-gray-200"
              >
                {item.icon}
                {item.name}
              </Link>
            </MenuItem>
          ))
        ) : (
          guest.map((item, index) => (
            <MenuItem key={index}>
              <Link
                href={item.href}
                className="flex items-center gap-x-2 rounded-lg sm:text-md xl:text-lg py-2 px-3 transition hover:bg-gray-200"
              >
                {item.icon}
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