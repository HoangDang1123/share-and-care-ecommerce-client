'use client';

import { getOrderDetail } from '@/app/api/order';
import { VNPAYPayment } from '@/app/api/payment';
import BackButton from '@/app/ui/back-button';
import Status from '@/app/ui/order/status';
import { OrderDetailResponse } from '@/interface/order';
import { PaymentData } from '@/interface/payment';
import { formatPrice } from '@/utils/helpers';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

export default function Page() {
  const [order, setOrder] = useState<OrderDetailResponse>();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  // const [isFixedTop, setIsFixedTop] = useState(false);
  // const [isFixedBottom, setIsFixedBottom] = useState(false);
  const router = useRouter();
  const param = useParams();
  const id = param.id;

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY;
  //     const triggerTopPoint = 60;
  //     const triggerBottomPoint = 260;

  //     if (scrollTop > triggerTopPoint && scrollTop < triggerBottomPoint) {
  //       setIsFixedTop(true);
  //       setIsFixedBottom(false);
  //     } else if (scrollTop >= triggerBottomPoint) {
  //       setIsFixedTop(false);
  //       setIsFixedBottom(true);
  //     } else {
  //       setIsFixedTop(false);
  //       setIsFixedBottom(false);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (typeof id !== 'string') {
        return;
      }
      if (userId !== "" && accessToken !== "") {
        try {
          const response = await getOrderDetail(id, userId, accessToken);
          setOrder(response);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchProducts();
  }, [accessToken, id, userId]);

  const handlePayment = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setPaymentLoading(true);
    try {
      if (typeof id !== 'string') {
        return;
      }

      const paymentData: PaymentData = {
        orderId: id,
        language: "",
        bankCode: "",
      }
      const response = await VNPAYPayment(paymentData);
      router.replace(response);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { }
  }

  const handleCanceling = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setCancelLoading(true);
  }

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

  if (!order) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className='md:px-12 lg:px-24 sm:my-5 md:my-20'>
      <div className='flex items-center sm:px-6 md:px-0 sm:space-x-8 md:space-x-24'>
        <BackButton />

        <ul className="flex space-x-1 sm:text-md md:text-xl text-ellipsis text-nowrap">
          <li>
            <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
          </li>
          <li>
            <Link href="/profile" className='text-gray-400 hover:text-gray-900'>Profile / </Link>
          </li>
          <li>
            {order.orders.id}
          </li>
        </ul>
      </div>

      <div className='grid sm:grid-cols-1 md:grid-cols-3 w-full md:px-20 sm:gap-y-10 md:gap-x-20 sm:mt-4 md:mt-10'>
        <div className="flex flex-col w-full md:col-span-2 space-y-4 mx-auto sm:p-4 md:p-10 md:rounded-xl md:shadow-lg">
          <h1 className="md:mb-6 sm:text-2xl md:text-3xl">Order Information</h1>

          <Status status={order.orders.status} method={order.orders.paymentMethod} />

          <table className='w-full'>
            <thead className='w-full'>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border px-4 py-2 text-center">Product</th>
                <th className="border px-4 py-2 text-center">Price</th>
                <th className="border px-4 py-2 text-center">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {order.orders.items.map(item => (
                <tr key={item.productId}>
                  <td className="flex items-center">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      width={50}
                      height={50}
                      className="mr-2"
                    />
                    {item.productName}
                  </td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='space-y-6'>
            <div className='space-y-2'>
              <h1 className="sm:text-2xl md:text-3xl">Shipping Address</h1>
              <div className='space-y-2'>
                <h6 className="sm:text-base md:text-lg">{order.orders.shippingAddress.fullname}</h6>
                <h6 className="sm:text-base md:text-lg">{order.orders.shippingAddress.phone}</h6>
                <h6 className="sm:text-base md:text-lg">{order.orders.shippingAddress.street}, {order.orders.shippingAddress.ward}, {order.orders.shippingAddress.district}, {order.orders.shippingAddress.city}</h6>
              </div>
            </div>

            <div className='space-y-2'>
              <h1 className='sm:text-2xl md:text-3xl'>Payment Method</h1>
              <h6 className="sm:text-base md:text-lg">
                {order.orders.paymentMethod === "VN_PAY" ? "VNPay" : order.orders.paymentMethod}
              </h6>
            </div>

            <div className='space-y-2'>
              <h1 className='sm:text-2xl md:text-3xl'>Delivery Information</h1>
              <h6 className="sm:text-base md:text-lg">{order.orders.deliveryMethod.name}</h6>
            </div>
          </div>
        </div>

        {/* <div
          className={`col-span-2 flex flex-col w-[390px] h-fit shadow-lg px-4 py-10 space-y-10 rounded-lg transition-all duration-300 ease-in-out ${isFixedTop ? 'fixed top-40 right-[173px]' : isFixedBottom ? 'absolute bottom-9 right-[173px]' : ''}`}
        > */}
        <div
          className='flex flex-col w-full h-fit shadow-lg px-4 py-10 space-y-10 rounded-lg transition-all duration-300 ease-in-out'
        >
          <h1 className='sm:text-2xl md:text-3xl'>Order Summary</h1>
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <h4 className='font-semibold sm:text-lg md:text-xl'>Product Cost:</h4>
              <h4 className='sm:text-lg md:text-xl'>{`${formatPrice(order.orders.itemsPrice)}`}</h4>
            </div>

            <div className='flex justify-between'>
              <h4 className='font-semibold sm:text-lg md:text-xl'>Shipping Fee:</h4>
              <h4 className='sm:text-lg md:text-xl'>{`+ ${formatPrice(order.orders.shippingPrice)}`}</h4>
            </div>

            <div className='flex justify-between'>
              <h4 className='font-semibold sm:text-lg md:text-xl'>Discount:</h4>
              <h4 className='sm:text-lg md:text-xl'>{`- ${formatPrice(order.orders.discountPrice)}`}</h4>
            </div>

            <div className='w-full h-0.5 bg-gray-200' />

            <div className='flex justify-between'>
              <h4 className='font-semibold sm:text-lg md:text-xl'>Total Cost:</h4>
              <h4 className='sm:text-lg md:text-xl'>{formatPrice(order.orders.totalPrice)}</h4>
            </div>
          </div>

          <div className='flex flex-col space-y-4'>
            {order.orders.paymentMethod === 'VN_PAY' ? (
              order.orders.status === "AWAITING_PAYMENT" ? (
                <button
                  disabled={paymentLoading || cancelLoading}
                  onClick={(e) => handlePayment(e)}
                  className='flex justify-center items-center h-11 bg-gray-900 rounded-md'
                >
                  {paymentLoading ? (
                    <ClipLoader
                      size={20}
                      color='#ffffff'
                      aria-label="Loading Spinner"
                    />
                  ) : (
                    <div className='flex justify-center items-center'>
                      <CreditCardIcon className='size-6 mr-3 text-white' />
                      <h6 className='text-lg font-semibold text-white'>PAYMENT</h6>
                    </div>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className='flex justify-center items-center bg-gray-200 opacity-50 px-6 py-2 rounded-md'
                >
                  <div className='flex justify-center items-center'>
                    <CheckCircleIcon className='size-6 mr-3 text-green-600' />
                    <h6 className='text-xl font-semibold text-green-600'>Order is Paid</h6>
                  </div>
                </button>
              )
            ) : (
              <button
                disabled
                className='flex justify-center items-center bg-gray-200 opacity-50 px-6 py-2 rounded-md'
              >
                <div className='flex justify-center items-center'>
                  <h6 className='text-lg font-semibold text-green-600'>{order.orders.status}</h6>
                </div>
              </button>
            )}
            <button
              disabled={cancelLoading || paymentLoading}
              onClick={(e) => handleCanceling(e)}
              className='flex justify-center items-center h-11 bg-red-500 rounded-md hover:bg-red-600'
            >
              {cancelLoading ? (
                <ClipLoader
                  size={20}
                  color='#ffffff'
                  aria-label="Loading Spinner"
                />
              ) : (
                <div className='flex justify-center items-center'>
                  <h6 className='text-lg font-semibold text-white'>CANCEL</h6>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}