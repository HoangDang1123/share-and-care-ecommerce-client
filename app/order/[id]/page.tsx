'use client';

import { cancelOrder, getOrderDetail } from '@/app/api/order';
import { VNPAYPayment } from '@/app/api/payment';
import BackButton from '@/app/ui/back-button';
import { OrderItem } from '@/app/ui/order/detail/order-item';
import OrderTimeline from '@/app/ui/order/detail/order-status';
import { OrderDetailResponse, OrderStatus, PaymentMethod } from '@/interface/order';
import { PaymentData } from '@/interface/payment';
import { convertDateTime, formatPrice } from '@/utils/helpers';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { Col, Row } from 'antd';
import Image from 'next/image';
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

  const statusBadge: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-gray-200 text-gray-800',
    [OrderStatus.AWAITING_PAYMENT]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
    [OrderStatus.AWAITING_SHIPMENT]: 'bg-indigo-100 text-indigo-800',
    [OrderStatus.SHIPPED]: 'bg-sky-100 text-sky-800',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [OrderStatus.NOT_DELIVERED]: 'bg-emerald-100 text-emerald-800',
    [OrderStatus.RETURN_REQUESTED]: 'bg-orange-100 text-orange-800',
    [OrderStatus.RETURNED]: 'bg-orange-200 text-orange-900',
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
      toast.success("Cancel order successful!");

      router.push("/profile");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { }
    finally {
      setCancelLoading(false);
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
            <Link href="/" className='text-gray-400 text-base hover:text-gray-900'>Home / </Link>
          </li>
          <li>
            <Link href="/profile" className='text-gray-400 text-base hover:text-gray-900'>Profile / </Link>
          </li>
          <li>
            <span className="text-base">{order.order.id}</span>
          </li>
        </ul>
      </div>

      <Row className='sm:mt-4 md:mt-10 md:px-20'>
        <Col span={17} className='flex flex-col gap-y-4'>
          <OrderTimeline
            paymentMethod={order.order.paymentMethod}
            currentStatus={order.order.status.toUpperCase()}
          />
          <div className='flex flex-col border-2 p-6 gap-y-4 rounded-md hover:text-gray-900'>
            <div className='flex justify-between'>
              <div className='flex flex-col gap-y-1'>
                <span className='font-semibold mb-4'>{`ID: ${order.order.id}`}</span>
                <span>{`Ordered Date: ${convertDateTime(order.order.timestamps.createdAt)}`}</span>
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

              <div className='flex flex-col items-end gap-y-4'>
                <span className={`font-semibold h-fit px-3 py-1 rounded-lg ${statusBadge[order.order.status]}`}>
                  {order.order.status.replace(/_/g, ' ')}
                </span>

                {order.order.timestamps.deliveredAt !== null && (
                  <span>{`Delivered Date: ${convertDateTime(order.order.timestamps.deliveredAt)}`}</span>
                )}
              </div>
            </div>

            {order.order.items.map((childItem, index) => (
              <OrderItem key={index} item={childItem} orderId={order.order.id} />
            ))}

            <div className='flex justify-end'>
              {order.order.paymentMethod === PaymentMethod.COD ? (
                <Image
                  src={'/assets/cash-payment.png'}
                  alt='COD'
                  width={100}
                  height={100}
                  className='w-16'
                />
              ) : order.order.paymentMethod === PaymentMethod.VNPAY ? (
                <Image
                  src={'/assets/vnpay.png'}
                  alt='VNPAY'
                  width={100}
                  height={100}
                  className='w-16'
                />
              ) : (
                <Image
                  src={'/assets/momo.png'}
                  alt='MOMO'
                  width={100}
                  height={100}
                  className='w-16'
                />
              )}
            </div>
          </div>
        </Col>

        <Col span={1} />

        <Col
          span={6}
          className="flex flex-col w-full h-fit md:shadow-lg px-4 pt-10 gap-y-10 md:rounded-lg transition-all duration-300 ease-in-out"
        >
          <h1>Order Summary</h1>
          <div className='flex flex-col gap-y-4'>
            <div className='flex justify-between'>
              <h4 className='font-semibold sm:text-lg md:text-xl'>Product Cost:</h4>
              <h4 className='sm:text-lg md:text-xl'>{formatPrice(order.order.pricing.itemsPrice)}</h4>
            </div>

            <div className='flex justify-between'>
              <h4 className='font-semibold sm:text-lg md:text-xl'>Shipping Fee:</h4>
              <h4 className='sm:text-lg md:text-xl'>{`+ ${formatPrice(order.order.pricing.shippingPrice)}`}</h4>
            </div>

            <div className='flex justify-between'>
              <h4 className='font-semibold sm:text-lg md:text-xl'>Product Discount:</h4>
              <h4 className='sm:text-lg md:text-xl'>{`- ${formatPrice(order.order.pricing.productDiscount)}`}</h4>
            </div>

            <div className='flex justify-between'>
              <h4 className='font-semibold sm:text-lg md:text-xl'>Coupon Discount:</h4>
              <h4 className='sm:text-lg md:text-xl'>{`- ${formatPrice(order.order.pricing.couponDiscount)}`}</h4>
            </div>

            <div className='flex justify-between'>
              <h4 className='font-semibold sm:text-lg md:text-xl'>Shipping Discount:</h4>
              <h4 className='sm:text-lg md:text-xl'>{`- ${formatPrice(order.order.pricing.shippingDiscount)}`}</h4>
            </div>

            <div className='w-full h-0.5 bg-gray-200' />

            <div className='flex justify-between'>
              <h4 className='font-semibold sm:text-lg md:text-xl'>Total Cost:</h4>
              <h4 className='sm:text-lg md:text-xl'>{formatPrice(order.order.pricing.totalPrice)}</h4>
            </div>
          </div>

          <div className='flex flex-col w-full gap-y-4'>
            {order.order.status === OrderStatus.AWAITING_PAYMENT && (
              <button
                onClick={handlePayment}
                className='flex justify-center items-center h-12 bg-gray-800 hover:bg-gray-900 text-white text-xl font-bold rounded-lg'
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
                className='flex justify-center items-center mb-10 h-12 bg-red-500 hover:bg-red-600 text-white text-xl font-bold rounded-lg'
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
          </div>
        </Col>
      </Row>
    </div>
  );
}