'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardDocumentIcon, MapPinIcon, UserIcon } from "@heroicons/react/24/outline";
import BackButton from "../ui/back-button";
import { Col, Row } from "antd";
import Image from "next/image";
import { ShippingAddress } from "../ui/profile/shipping-address";
import { OrderList } from "../ui/profile/order-list";

export default function Page() {
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [avatar, setAvatar] = useState('');
  const [tabActive, setTabActive] = useState(3);

  const tabItems = [
    {
      key: 1,
      label: 'Change Password',
      icon: <UserIcon className="size-6" />,
      children: <ShippingAddress userId={userId} accessToken={accessToken} />,
    },
    {
      key: 2,
      label: 'Shipping Address',
      icon: <MapPinIcon className="size-6" />,
      children: <ShippingAddress userId={userId} accessToken={accessToken} />,
    },
    {
      key: 3,
      label: 'Order List',
      icon: <ClipboardDocumentIcon className="size-6" />,
      children: <OrderList userId={userId} accessToken={accessToken} />,
    },
  ];

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    setAccessToken(localStorage.getItem('accessToken') || '');
    setAvatar(localStorage.getItem('avatar') || '/assets/default-avatar-icon.jpg');
  }, []);

  if (userId === "" || accessToken === "") {
    return (
      <div className="flex justify-center items-center h-[735px] bg-black gap-x-4">
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
            <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
          </li>
          <li>Profile</li>
        </ul>
      </div>

      <Row className='flex sm:mt-4 md:mt-10 md:px-20'>
        <Col xs={24} md={5} className="flex flex-col items-center h-fit px-6 py-8 md:shadow-lg rounded-lg">
          <div className="flex flex-col items-center mb-8 pb-8 border-b-2">
            <div className="relative group sm:w-32 md:w-24 lg:w-24 xl:w-36 sm:h-32 md:h-24 lg:h-24 xl:h-36 rounded-full mb-4">
              <Image
                src={avatar}
                alt="Avatar"
                width={500}
                height={500}
                className="w-full h-full rounded-full object-cover transition-opacity duration-300 group-hover:opacity-40"
              />
              <button

                className="absolute inset-0 flex items-center justify-center w-full h-full top-1/4 bg-transparent text-blue-500 border-none text-sm font-bold opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 group-hover:border-none"
              >
                Change Avatar
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
                className={`flex items-center gap-x-2 sm:text-lg md:text-base xl:text-lg px-4 py-2 font-semibold rounded-md hover:bg-gray-100 ${tab.key === tabActive ? 'bg-gray-200' : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
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
