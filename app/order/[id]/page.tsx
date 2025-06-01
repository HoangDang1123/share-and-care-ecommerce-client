'use client';

import { cancelOrder, getOrderDetail } from '@/app/api/order';
import { VNPAYPayment } from '@/app/api/payment';
import BackButton from '@/app/ui/back-button';
import { OrderItem } from '@/app/ui/order/detail/order-item';
import OrderTimeline from '@/app/ui/order/detail/order-status';
import { OrderDetailResponse, OrderStatus, PaymentStatus } from '@/interface/order';
import { PaymentData } from '@/interface/payment';
import { convertDateTime, formatPrice } from '@/utils/helpers';
import { ArrowPathIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';

export default function Page() {
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [order, setOrder] = useState<OrderDetailResponse>();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [returnLoading, setReturnLoading] = useState(false);
  const router = useRouter();
  const param = useParams();
  const id = param.id;

  const paymentStatusBadge: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'bg-gray-200 text-gray-800',
    [PaymentStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [PaymentStatus.FAILED]: 'bg-red-100 text-red-800',
    [PaymentStatus.PENDING_REFUND]: 'bg-yellow-100 text-yellow-800',
    [PaymentStatus.REFUNDED]: 'bg-blue-100 text-blue-800',
  };

  const canCancel = order
    && (order.order.status === OrderStatus.PENDING
      || order.order.status === OrderStatus.AWAITING_PAYMENT
      || order.order.status === OrderStatus.PROCESSING
      || order.order.status === OrderStatus.AWAITING_SHIPMENT)

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
    try {
      if (typeof id !== 'string') {
        return;
      }

      await cancelOrder(id, userId, accessToken);
      toast.success("Cancel order sucessful!");

      router.push("/profile");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { }
    finally {
      setCancelLoading(false);
    }
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

      <div className='flex flex-col gap-y-4 sm:mt-4 md:mt-10 md:px-20'>
        <OrderTimeline
          paymentMethod={order.order.paymentMethod}
          currentStatus={order.order.status.toUpperCase()}
        />
        <div className='flex flex-col border-2 p-6 gap-y-4 font-medium rounded-md hover:text-gray-900'>
          <div className='flex justify-between'>
            <div className='flex flex-col gap-y-1'>
              <span className='font-semibold mb-4'>{`ID: ${order.order.id}`}</span>
              <span>{`Ordered Date: ${convertDateTime(order.order.createdAt)}`}</span>
              <span>{`Delivery Method: ${order.order.deliveryMethod}`}</span>
              <div className='flex gap-x-1'>
                <span>Shipping:</span>
                <span>{`${order.order.shippingAddress.fullname} - ${order.order.shippingAddress.phone} -`}</span>
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
            {order.order.deliveredAt !== null && (
              <span>{`Delivered Date: ${convertDateTime(order.order.deliveredAt)}`}</span>
            )}
          </div>

          {order.order.items.map((childItem, index) => (
            <OrderItem key={index} item={childItem} />
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
        </div>

        <div className='flex justify-end gap-x-4'>
          {order.order.status === OrderStatus.AWAITING_PAYMENT && (
            <button
              onClick={handlePayment}
              className='flex justify-center items-center w-56 h-12 bg-gray-800 hover:bg-gray-900 text-white text-xl font-bold rounded-lg'
            >
              {paymentLoading ? (
                <ClipLoader
                  size={20}
                  color='#ffffff'
                  aria-label="Loading Spinner"
                />
              ) : (
                <div className='flex justify-center items-center gap-x-2'>
                  <CreditCardIcon className='size-7' />
                  <span>Payment</span>
                </div>
              )}
            </button>
          )}

          {canCancel && (
            <button
              onClick={handleCanceling}
              className='flex justify-center items-center w-32 h-12 bg-red-500 hover:bg-red-600 text-white text-xl font-bold rounded-lg'
            >
              {cancelLoading ? (
                <ClipLoader
                  size={20}
                  color='#ffffff'
                  aria-label="Loading Spinner"
                />
              ) : (
                <span>Cancel</span>
              )}
            </button>
          )}

          {order.order.status === OrderStatus.DELIVERED && (
            <button
              onClick={handlePayment}
              className='flex justify-center items-center w-60 h-12 bg-gray-800 hover:bg-gray-900 text-white text-xl font-bold rounded-lg'
            >
              {returnLoading ? (
                <ClipLoader
                  size={20}
                  color='#ffffff'
                  aria-label="Loading Spinner"
                />
              ) : (
                <div className='flex justify-center items-center gap-x-2'>
                  <ArrowPathIcon className='size-7' />
                  <span>Request Return</span>
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}