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
      label: 'Danh sách đơn hàng',
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
      label: 'Địa chỉ giao hàng',
      icon: <MapPinIcon className="size-6" />,
      children: <ShippingAddress userId={userId} accessToken={accessToken} />,
    },
    {
      key: 3,
      label: 'Đổi mật khẩu',
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
      toast.success("Tải ảnh đại diện thành công.");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { }
    finally {
      setUploadAvatarLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!accessToken) {
      toast.error("Access token không khả dụng.");
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await logoutRequest(userId, accessToken);

      router.push("/auth/login");
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

  if (userId === "" || accessToken === "") {
    return (
      <div className="flex justify-center items-center h-[750px] bg-black gap-x-4">
        <span className="text-white">Bạn cần đăng nhập để tiếp tục</span>
        <Link
          href="/auth/login"
          className="flex-none rounded-full bg-white px-3 py-1 sm:text-xs md:text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          Đi tới trang đăng nhập <span aria-hidden="true">&rarr;</span>
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
            <Link href="/" className='text-gray-400 text-base hover:text-gray-900'>Trang chủ / </Link>
          </li>
          <li>
            <span className="text-base">Tài khoản</span>
          </li>
        </ul>
      </div>

      <Row className="flex sm:mt-4 md:mt-10 md:px-20">
        <Col xs={0} md={5} className="hidden md:flex flex-col items-center h-fit px-6 py-8 shadow-lg rounded-lg">
          <div className="flex flex-col items-center mb-8 pb-8 border-b-2">
            <div className="relative group w-24 h-24 xl:w-36 xl:h-36 rounded-full border-2 border-gray-400 mb-4">
              <Image
                src={avatar}
                alt="Avatar"
                width={500}
                height={500}
                className="w-full h-full rounded-full object-cover transition-opacity duration-300 group-hover:opacity-40"
              />
              <button
                onClick={handleClick}
                className="absolute inset-0 flex items-center justify-center w-full h-full bg-transparent text-blue-500 text-sm font-bold opacity-0 group-hover:opacity-100"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                {uploadAvatarLoading ? (
                  <ClipLoader size={30} color="#ffffff" aria-label="Loading Spinner" />
                ) : (
                  'Đổi ảnh đại diện'
                )}
              </button>
            </div>
            <span className="text-lg xl:text-2xl font-semibold">{localStorage.getItem('name')}</span>
            <span className="text-sm xl:text-md">{localStorage.getItem('email')}</span>
          </div>

          <div className="w-full flex flex-col gap-y-2">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTabActive(tab.key)}
                className={`flex items-center justify-between text-base xl:text-lg px-4 py-2 font-semibold rounded-md hover:bg-gray-100 ${tab.key === tabActive ? 'bg-gray-200' : ''}`}
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
              className="flex items-center w-full gap-x-2 text-base xl:text-lg px-4 py-2 font-semibold rounded-md hover:bg-gray-100"
            >
              <ArrowLeftStartOnRectangleIcon className="size-6" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </Col>

        <Col lg={1}/>

        <div className="flex flex-col items-center w-full px-4 py-6 border-b md:hidden">
          <div className="relative group w-24 h-24 rounded-full border-2 border-gray-400 mb-4">
            <Image
              src={avatar}
              alt="Avatar"
              width={500}
              height={500}
              className="w-full h-full rounded-full object-cover transition-opacity duration-300 group-hover:opacity-40"
            />
            <button
              onClick={handleClick}
              className="absolute inset-0 flex items-center justify-center w-full h-full bg-transparent text-blue-500 text-sm font-bold opacity-0 group-hover:opacity-100"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                ref={fileInputRef}
                className="hidden"
              />
              {uploadAvatarLoading ? (
                <ClipLoader size={30} color="#ffffff" aria-label="Loading Spinner" />
              ) : (
                'Đổi ảnh'
              )}
            </button>
          </div>

          <span className="text-lg font-semibold">{localStorage.getItem('name')}</span>
          <span className="text-sm text-gray-600">{localStorage.getItem('email')}</span>

          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-x-2 text-base font-medium px-4 py-2 rounded-md border hover:bg-gray-100"
          >
            <ArrowLeftStartOnRectangleIcon className="size-5" />
            <span>Đăng xuất</span>
          </button>
        </div>

        <Col xs={24} md={18} className="flex flex-col items-center gap-y-4">
          <div className="w-full px-4 md:hidden">
            <label htmlFor="mobile-tab-select" className="block mb-1 font-semibold">
              Chọn mục
            </label>
            <select
              id="mobile-tab-select"
              value={tabActive}
              onChange={(e) => setTabActive(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-base"
            >
              {tabItems.map((tab) => (
                <option key={tab.key} value={tab.key}>
                  {tab.label} {tab.label === 'Order List' ? `(${orders ? orders.total : 0})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            {tabItems.map((tab) => (
              <div key={tab.key} className={tab.key === tabActive ? 'block' : 'hidden'}>
                {tab.children}
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
}
