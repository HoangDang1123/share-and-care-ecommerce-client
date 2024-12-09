'use client';

import { getOrderDetail } from '@/app/api/order';
import { VNPAYPayment } from '@/app/api/payment';
import { OrderDataDetailResponse } from '@/interface/order';
import { PaymentData } from '@/interface/payment';
import { formatPrice } from '@/utils/helpers';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

export default function Page() {
  const [order, setOrder] = useState<OrderDataDetailResponse>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const router = useRouter();
  const param = useParams();
  const id = param.id;

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const triggerPoint = 120;

      if (scrollTop > triggerPoint) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (typeof id !== 'string') {
        return;
      }
      if (userId !== null && accessToken !== null) {
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

  return (
    <div className='sm:px-6 md:px-12 lg:px-24 my-10 mt-28'>
      {order ? (
        <div className='grid grid-cols-1 md:grid-cols-7 px-5 md:px-20 space-x-0 md:space-x-14 mt-10'>
          <div className="col-span-5 rounded-lg p-5 shadow-lg">
            <h1 className="text-2xl font-bold mb-5">Order Information</h1>
            <table className='w-full'>
              <thead className='w-full'>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
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

            <h2 className="mt-5">Shipping Address</h2>
            <div className='space-y-4'>
              <div>
                <h6>{order.orders.shippingAddress.fullname}</h6>
                <h6>{order.orders.shippingAddress.phone}</h6>
                <h6>{order.orders.shippingAddress.street}, {order.orders.shippingAddress.ward}, {order.orders.shippingAddress.district}, {order.orders.shippingAddress.city}</h6>
              </div>

              <div>
                <h2>Payment Method</h2>
                <h6>{order.orders.paymentMethod}</h6>
              </div>

              <div>
                <h2>Delivery Information</h2>
                <h6>{order.orders.deliveryMethod.name}</h6>
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col w-[390px] h-fit shadow-lg px-4 py-10 space-y-10 rounded-lg transition-all duration-300 ease-in-out ${isFixed ? 'fixed top-40 right-[173px]' : ''}`}
          >
            <h1>Order Summary</h1>
            <div className='space-y-4'>
              <div className='flex justify-between'>
                <h4 className='font-semibold'>Product Cost:</h4>
                <h4>{`${formatPrice(order.orders.itemsPrice)}`}</h4>
              </div>

              <div className='flex justify-between'>
                <h4 className='font-semibold'>Shipping Fee:</h4>
                <h4>{formatPrice(order.orders.shippingPrice)}</h4>
              </div>

              <div className='flex justify-between'>
                <h4 className='font-semibold'>Discount:</h4>
                <h4>{`- ${formatPrice(order.orders.discountPrice)}`}</h4>
              </div>

              <div className='w-full h-0.5 bg-gray-200' />

              <div className='flex justify-between'>
                <h4 className='font-semibold'>Total Cost:</h4>
                <h4>{formatPrice(order.orders.totalPrice)}</h4>
              </div>
            </div>

            <div className='flex flex-col space-y-4'>
              <button
                disabled={loading}
                onClick={(e) => handlePayment(e)}
                className='flex justify-center items-center bg-gray-900 px-6 py-2 rounded-md'
              >
                {loading ? (
                  <ClipLoader
                    size={20}
                    color='#ffffff'
                    aria-label="Loading Spinner"
                  />
                ) : (
                  <div className='flex justify-center items-center'>
                    <CreditCardIcon className='size-8 mr-3 text-white' />
                    <h6 className='text-xl font-semibold text-white'>Order Payment</h6>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 text-red-600 p-5 rounded-lg">
          <h2 className="text-xl font-semibold">An error occurred!</h2>
          <h6>Order information is not available. Please check again.</h6>
        </div>
      )}
    </div>
  );
}