'use client'

import { deleteCartItem } from '@/app/api/cart';
import { createOrder } from '@/app/api/order';
import { useOrder } from '@/app/context/AuthContext';
import { formatPrice } from '@/utils/helpers';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';

export default function OrderSummary() {
  const [isFixed, setIsFixed] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { order, setOrder } = useOrder();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const productPrice = Number(typeof window !== "undefined" ? localStorage.getItem("productPrice") || "" : "");
  const deliveryFee = Number(typeof window !== "undefined" ? localStorage.getItem("deliveryFee") || "" : "");

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

  const handleCreateOrder = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);

    if (order !== null && userId !== "" && accessToken !== "") {
      try {
        const response = await createOrder(order, userId, accessToken);
        toast.success("Create order successful.");

        router.push(`/order/${response.id}`)

        for (const item of order.items) {
          const cartItem = {
            productId: item.productId,
            variantId: item.variantId
          }
          try {
            await deleteCartItem(cartItem, userId, accessToken);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) { }
        }

        setOrder(null);
        if (typeof window !== "undefined") {
          localStorage.setItem('productPrice', '0');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div
      className={`flex flex-col w-[390px] h-fit shadow-lg px-4 py-10 space-y-10 rounded-lg transition-all duration-300 ease-in-out ${isFixed ? 'fixed top-44 right-[175px]' : ''}`}
    >
      <h1>Order Summary</h1>
      <div className='space-y-4'>
        <div className='flex justify-between'>
          <h4 className='font-semibold'>Product Cost:</h4>
          <h4>{`${formatPrice(productPrice)}`}</h4>
        </div>

        <div className='flex justify-between'>
          <h4 className='font-semibold'>Shipping Fee:</h4>
          <h4>{`+ ${formatPrice(deliveryFee)}`}</h4>
        </div>

        <div className='flex justify-between'>
          <h4 className='font-semibold'>Discount:</h4>
          <h4>{`- ${formatPrice(0)}`}</h4>
        </div>

        <div className='w-full h-0.5 bg-gray-200' />

        <div className='flex justify-between'>
          <h4 className='font-semibold'>Total Cost:</h4>
          <h4>{formatPrice(productPrice + deliveryFee)}</h4>
        </div>
      </div>

      <div className='flex flex-col space-y-4'>
        <button
          disabled={loading}
          onClick={(e) => handleCreateOrder(e)}
          className='flex justify-center items-center h-12 bg-gray-900 px-6 rounded-md'
        >
          {loading ? (
            <ClipLoader
              size={20}
              color='#ffffff'
              aria-label="Loading Spinner"
            />
          ) : (
            <div className='flex justify-center items-center'>
              <ShoppingCartIcon className='size-8 mr-3 text-white' />
              <h6 className='text-xl font-semibold text-white'>Order</h6>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
