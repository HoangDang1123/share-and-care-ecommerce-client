'use client'

import { deleteCartItem, getCart } from '@/app/api/cart';
import { createOrder } from '@/app/api/order';
import { useCart, useOrder } from '@/app/context/AppContext';
import { formatPrice } from '@/utils/helpers';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
import { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';

export default function OrderSummary() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setCart } = useCart();
  const { order, setOrder } = useOrder();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const productPrice = Number(typeof window !== "undefined" ? localStorage.getItem("productPrice") || "" : "");
  const deliveryFee = Number(typeof window !== "undefined" ? localStorage.getItem("deliveryFee") || "" : "");

  const handleCreateOrder = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);

    if (order !== null && userId !== "" && accessToken !== "") {
      try {
        const response = await createOrder(order, userId, accessToken);
        toast.success("Create order successful.");

        if (response.paymentUrl !== null) {
          router.replace(response.paymentUrl);
        } else {
          router.push(`/order/${response.orderId}`);
        }

        // Delete product if it in cart
        if (localStorage.getItem('productInCart') === 'true') {
          const cartResponse = await getCart(userId, accessToken);
          const cartItems = cartResponse.items || [];

          for (const item of order.items) {
            const cartItem = {
              productId: item.productId,
              variantId: item.variantId,
            };

            const existsInCart = cartItems.some(cartItem =>
              cartItem.productId === item.productId && cartItem.variantId === item.variantId
            );

            if (existsInCart) {
              try {
                await deleteCartItem(cartItem, userId, accessToken);
                try {
                  const response = await getCart(userId, accessToken);
                  setCart(response);
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) { }
              } catch (error) {
                console.error("Error deleting cart item:", error);
              }
            }
          }
        }

        localStorage.removeItem('productInCart');

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
      className="flex flex-col w-full h-fit md:shadow-lg px-4 py-10 space-y-10 md:rounded-lg transition-all duration-300 ease-in-out"
    >
      <h1>Order Summary</h1>
      <div className='space-y-4'>
        <div className='flex justify-between'>
          <h4 className='font-semibold sm:text-lg md:text-xl'>Product Cost:</h4>
          <h4 className='sm:text-lg md:text-xl'>{`${formatPrice(productPrice)}`}</h4>
        </div>

        <div className='flex justify-between'>
          <h4 className='font-semibold sm:text-lg md:text-xl'>Shipping Fee:</h4>
          <h4 className='sm:text-lg md:text-xl'>{`+ ${formatPrice(deliveryFee)}`}</h4>
        </div>

        <div className='flex justify-between'>
          <h4 className='font-semibold sm:text-lg md:text-xl'>Discount:</h4>
          <h4 className='sm:text-lg md:text-xl'>{`- ${formatPrice(0)}`}</h4>
        </div>

        <div className='w-full h-0.5 bg-gray-200' />

        <div className='flex justify-between'>
          <h4 className='font-semibold sm:text-lg md:text-xl'>Total Cost:</h4>
          <h4 className='sm:text-lg md:text-xl'>{formatPrice(productPrice + deliveryFee)}</h4>
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
