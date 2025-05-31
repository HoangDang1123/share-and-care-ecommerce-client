'use client';

import { getOrderDetail } from '@/app/api/order';
import { VNPAYPayment } from '@/app/api/payment';
import BackButton from '@/app/ui/back-button';
import { OrderDetailResponse, OrderStatus, PaymentMethod, PaymentStatus } from '@/interface/order';
import { PaymentData } from '@/interface/payment';
import { convertDateTime, formatPrice } from '@/utils/helpers';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { ArrowPathIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { Col, Row } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

export default function Page() {
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [order, setOrder] = useState<OrderDetailResponse>();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const router = useRouter();
  const param = useParams();
  const id = param.id;
  const statusBadge: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-gray-200 text-gray-800',
    [OrderStatus.AWAITING_PAYMENT]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
    [OrderStatus.AWAITING_SHIPMENT]: 'bg-indigo-100 text-indigo-800',
    [OrderStatus.SHIPPED]: 'bg-sky-100 text-sky-800',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [OrderStatus.RETURN_REQUESTED]: 'bg-orange-100 text-orange-800',
    [OrderStatus.RETURNED]: 'bg-orange-200 text-orange-900',
    [OrderStatus.PENDING_REFUND]: 'bg-purple-100 text-purple-800',
    [OrderStatus.REFUNDED]: 'bg-emerald-100 text-emerald-800',
  };

  const paymentStatusBadge: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'bg-gray-200 text-gray-800',
    [PaymentStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [PaymentStatus.FAILED]: 'bg-red-100 text-red-800',
    [PaymentStatus.PENDING_REFUND]: 'bg-yellow-100 text-yellow-800',
    [PaymentStatus.REFUNDED]: 'bg-blue-100 text-blue-800',
  };

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    setAccessToken(localStorage.getItem('accessToken') || '');
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
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

    fetchOrder();
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
            {order.order.id}
          </li>
        </ul>
      </div>

      <Row className='flex sm:mt-4 md:mt-10 md:px-20'>
        <Col span={17} className='flex flex-col border-2 p-6 gap-y-4 rounded-md hover:text-gray-900'>
          <div className='flex justify-between'>
            <div className='flex flex-col'>
              <span className='font-semibold mb-4'>{`ID: ${order.order.id}`}</span>
              <span>{`Ordered Date: ${convertDateTime(order.order.createdAt)}`}</span>
              <span>{`Delivery Method: ${order.order.deliveryMethod}`}</span>
              <div className='flex gap-x-1'>
                <span>Shipping:</span>
                <div className='flex flex-col'>
                  <span>{`${order.order.shippingAddress.fullname}, ${order.order.shippingAddress.phone}`}</span>
                  <span>
                    {[
                      order.order.shippingAddress.street,
                      order.order.shippingAddress.ward,
                      order.order.shippingAddress.district,
                      order.order.shippingAddress.city
                    ].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>
            </div>
            <div className='flex flex-col items-end gap-y-2'>
              <span className={`font-semibold w-fit h-fit px-3 py-1 rounded-lg ${statusBadge[order.order.status]}`}>
                {order.order.status.replace(/_/g, ' ')}
              </span>
              {order.order.deliveredAt !== null && (
                <span>{`Delivered Date: ${convertDateTime(order.order.deliveredAt)}`}</span>
              )}
            </div>
          </div>

          {order.order.items.map((childItem, index) => (
            <div
              key={index}
              className='flex justify-between border-t-2 border-b-2 py-4'
            >
              <div className='flex gap-x-4'>
                <Image
                  src={childItem.image}
                  alt={childItem.productName}
                  width={500}
                  height={500}
                  className='object-cover w-24'
                />
                <div className='flex flex-col justify-between'>
                  <div className='flex flex-col'>
                    <span>{childItem.productName}</span>
                    <span>{`Quantity: ${childItem.quantity}`}</span>
                  </div>
                  <span>{`Slug: ${childItem.variantSlug}`}</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className="font-semibold">{`Price: ${formatPrice(childItem.price)}`}</span>
                <div className='flex justify-end items-center gap-x-2'>
                  <span
                    className={`inline-block text-sm font-medium px-3 py-1 rounded-lg w-fit ${childItem.canReturn
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                      }`}
                  >
                    {childItem.canReturn ? '7-Day Return' : 'Not Returnable'}
                  </span>
                  {childItem.canReturn && (
                    <button
                      className="rounded-lg p-2 bg-red-400 text-white font-semibold hover:bg-red-500 transition-colors duration-200"
                    >
                      <ArrowPathIcon className='size-4' />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className='flex justify-between'>
            <div className='flex flex-col gap-y-2'>
              <span>{`Payment Method: ${order.order.paymentMethod}`}</span>
              <span className={`font-semibold w-fit h-fit px-3 py-1 rounded-lg ${paymentStatusBadge[order.order.paymentStatus]}`}>
                {order.order.paymentStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <span className='font-semibold'>{`Total: ${formatPrice(order.order.totalPrice)}`}</span>
          </div>
        </Col>

        <Col span={1} />

        <Col span={6} className='flex flex-col space-y-4'>
          {order.order.paymentMethod === PaymentMethod.VNPAY ? (
            order.order.status === OrderStatus.AWAITING_PAYMENT ? (
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
                <h6 className='text-lg font-semibold text-green-600'>{order.order.status}</h6>
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
        </Col>
      </Row>
    </div>
  );
}