'use client'

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftStartOnRectangleIcon,
  ClipboardDocumentIcon,
  MapPinIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import BackButton from "../ui/back-button";
import { Col, Row } from "antd";
import Image from "next/image";
import { ShippingAddress } from "../ui/profile/shipping-address";
import { OrderList } from "../ui/profile/order-list";
import { ChangePassword } from "../ui/profile/change-password";
import { toast } from "react-toastify";
import { logoutRequest, uploadAvatar } from "../api/auth";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import { AllOrderResponse } from "@/interface/order";
import { getAllOrder } from "../api/order";
import { reconnectSocket } from "@/utils/socket";
import { useSocket } from "../context/SocketContext";

export default function Page() {
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [avatar, setAvatar] = useState('');
  const [tabActive, setTabActive] = useState(1);
  const [uploadAvatarLoading, setUploadAvatarLoading] = useState(false);
  const [orders, setOrders] = useState<AllOrderResponse>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { setSocket } = useSocket();

  const tabItems = [
    {
      key: 1,
      label: 'Order List',
      icon: <ClipboardDocumentIcon className="size-6" />,
      children:
        <OrderList
          userId={userId}
          accessToken={accessToken}
          {...(orders && orders.total > 0 ? { total: orders.total } : {})}
        />,
    },
    {
      key: 2,
      label: 'Shipping Address',
      icon: <MapPinIcon className="size-6" />,
      children: <ShippingAddress userId={userId} accessToken={accessToken} />,
    },
    {
      key: 3,
      label: 'Change Password',
      icon: <UserIcon className="size-6" />,
      children: <ChangePassword userId={userId} accessToken={accessToken} />,
    },
  ];

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    setAccessToken(localStorage.getItem('accessToken') || '');
    const avatar = localStorage.getItem('avatarUrl');
    setAvatar(
      avatar === 'https://via.placeholder.com/400x400.png' || !avatar
        ? '/assets/default-avatar-icon.jpg'
        : avatar
    );
  }, []);

  useEffect(() => {
    if (userId && accessToken) {
      const fetchOrder = async () => {
        const response = await getAllOrder(userId, accessToken);
        setOrders(response);
      }

      fetchOrder();
    }
  }, [accessToken, userId]);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadAvatarLoading(true);
      const response = await uploadAvatar(file, userId, accessToken);

      setAvatar(response.image_url);
      localStorage.setItem('avatarUrl', response.image_url);

      setUploadAvatarLoading(false);
      toast.success("Upload avatar successful!");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { }
    finally {
      setUploadAvatarLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!accessToken) {
      toast.error("Access token is not available.");
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await logoutRequest(userId, accessToken);

      router.push("/auth/login");
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
        localStorage.removeItem('avatarUrl');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        const socket = reconnectSocket();
        setSocket(socket);

        socket.on('connect', () => {
          console.log('🔄 Reconnected as anonymous');
        });
      }
    }
  }

  if (userId === "" || accessToken === "") {
    return (
      <div className="flex justify-center items-center h-[750px] bg-black gap-x-4">
        <h6 className="text-white">Please log in to continue</h6>
        <Link
          href="/auth/login"
          className="flex-none rounded-full bg-white px-3 py-1 sm:text-xs md:text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          Go to Login <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    )
  }

  return (
    <div className='md:px-12 lg:px-24 sm:my-5 md:my-20'>
      <div className='flex items-center sm:px-6 md:px-0 sm:space-x-8 md:space-x-24'>
        <BackButton />

        <ul className="flex space-x-1 text-xl">
          <li>
            <Link href="/" className='text-gray-400 text-base hover:text-gray-900'>Home / </Link>
          </li>
          <li>
            <span className="text-base">Profile</span>
          </li>
        </ul>
      </div>

      <Row className='flex sm:mt-4 md:mt-10 md:px-20'>
        <Col xs={24} md={5} className="flex flex-col items-center h-fit px-6 py-8 md:shadow-lg rounded-lg">
          <div className="flex flex-col items-center mb-8 pb-8 border-b-2">
            <div className="relative group sm:w-32 md:w-24 lg:w-24 xl:w-36 sm:h-32 md:h-24 lg:h-24 xl:h-36 rounded-full border-2 border-gray-400 mb-4">
              <Image
                src={avatar}
                alt="Avatar"
                width={500}
                height={500}
                className="w-full h-full rounded-full object-cover transition-opacity duration-300 group-hover:opacity-40"
              />
              <button
                onClick={handleClick}
                className="absolute inset-0 flex items-center justify-center w-full h-full top-1/4 bg-transparent text-blue-500 border-none text-sm font-bold opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 group-hover:border-none"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                {uploadAvatarLoading ? (
                  <ClipLoader
                    size={30}
                    color='#ffffff'
                    aria-label="Loading Spinner"
                  />
                ) : (
                  'Change Avatar'
                )}
              </button>
            </div>
            <span className="sm:text-2xl md:text-lg xl:text-2xl font-semibold">{localStorage.getItem('name')}</span>
            <span className="sm:text-md md:text-sm xl:text-md">{localStorage.getItem('email')}</span>
          </div>

          <div className="w-full flex flex-col gap-y-2">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTabActive(tab.key)}
                className={`flex items-center justify-between sm:text-lg md:text-base xl:text-lg px-4 py-2 font-semibold rounded-md hover:bg-gray-100 ${tab.key === tabActive ? 'bg-gray-200' : ''}`}
              >
                <div className="flex gap-x-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>

                {tab.label === 'Order List' && (
                  <span>{`(${orders ? orders.total : 0})`}</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 border-t-2 w-full pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-x-2 sm:text-lg md:text-base xl:text-lg px-4 py-2 font-semibold rounded-md hover:bg-gray-100"
            >
              <ArrowLeftStartOnRectangleIcon className="size-6" />
              <span>Logout</span>
            </button>
          </div>
        </Col>

        <Col xs={0} md={1} />

        <Col xs={24} md={18} className="flex flex-col items-center">
          {tabItems.map((tab) => (
            <div key={tab.key} className={tab.key === tabActive ? 'w-full block' : 'hidden'}>
              {tab.children}
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
}
