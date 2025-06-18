'use client'

import { deleteCartItem, getCart } from '@/app/api/cart';
import { createOrder, getPreviewOrder } from '@/app/api/order';
import { useCart, useOrder } from '@/app/context/AppContext';
import { OrderPricingSummary } from '@/interface/order';
import { formatPrice } from '@/utils/helpers';
import {
  ShoppingCartIcon,
  TagIcon,
  BanknotesIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';

export default function OrderSummary() {
  const [preview, setPreview] = useState<OrderPricingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const router = useRouter();
  const { setCart } = useCart();
  const { order, setOrder } = useOrder();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
  if (!order || !userId || !accessToken) return;

  const handler = setTimeout(async () => {
    try {
      const response = await getPreviewOrder(order, userId, accessToken);
      setPreview(response);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setPreview(null);
    }
  }, 500);

  return () => clearTimeout(handler);
}, [order, userId, accessToken]);

  const handleCreateOrder = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);

    if (order !== null && userId !== "" && accessToken !== "") {
      try {
        const response = await createOrder(order, userId, accessToken);
        toast.success("Đặt hàng thành công.");

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
      <span className='flex items-center gap-2 font-bold text-3xl'>
        <ReceiptPercentIcon className='w-10 h-10 text-gray-700' />
        Thông tin đơn hàng
      </span>

      {!preview ? (
        <div>Đang tải...</div>
      ) : (
        <div className='flex flex-col gap-y-6'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <BanknotesIcon className='w-5 h-5 text-blue-600' />
              <span className='font-semibold sm:text-lg md:text-xl'>Giá sản phẩm:</span>
            </div>
            <span className='sm:text-lg md:text-xl'>{formatPrice(preview.itemsPrice)}</span>
          </div>

          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <TruckIcon className='w-5 h-5 text-green-600' />
              <span className='font-semibold sm:text-lg md:text-xl'>Phí giao hàng:</span>
            </div>
            <span className='sm:text-lg md:text-xl'>{`+ ${formatPrice(preview.shippingPrice)}`}</span>
          </div>

          <div className='w-full h-0.5 bg-gray-200' />

          <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <TagIcon className='w-5 h-5 text-orange-600' />
                <span className='font-semibold sm:text-lg md:text-xl'>Mã giảm giá:</span>
              </div>
              <input
                type='text'
                placeholder='Nhập mã giảm giá'
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className='px-4 py-2 bg-orange-100 border border-orange-300 rounded-md text-sm w-28 md:w-40 shadow-inner placeholder-orange-800
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
        hover:bg-orange-100 transition duration-200'
              />
            </div>
            <button
              onClick={() =>
                setOrder((prev) =>
                  prev ? { ...prev, couponCode: couponInput } : null
                )
              }
              className='self-end px-4 py-1 text-sm text-white bg-orange-600 hover:bg-orange-700 rounded-md transition duration-200'
            >
              Áp dụng mã
            </button>
          </div>

          <div className='w-full h-0.5 bg-gray-200' />

          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <CurrencyDollarIcon className='w-5 h-5 text-gray-800' />
              <span className='font-semibold sm:text-lg md:text-xl'>Tổng tiền:</span>
            </div>
            <span className='sm:text-lg md:text-xl'>{formatPrice(preview.totalPrice)}</span>
          </div>
        </div>
      )}

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
              <span className='text-xl font-semibold text-white'>Đặt hàng</span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
