'use client'

import React, { useEffect, useState } from 'react'
import BackButton from '../ui/back-button';
import Link from 'next/link';
import ItemTable from '../ui/cart/item-table';
import SelectedAllCombobox from '../ui/cart/selected-all-combobox';
import { formatPrice } from '@/utils/helpers';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { CartDataResponse } from '@/interface/cart';
import { clearCartItem, getCart } from '../api/cart';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { useOrder } from '../context/AuthContext';
import { OrderData } from '@/interface/order';

export default function Page() {
  const [cart, setCart] = useState<CartDataResponse>();
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Array<boolean>>([]);
  const [isFixed, setIsFixed] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setOrder, setProductPrice } = useOrder();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchCart = async () => {
      if (userId && accessToken) {
        try {
          const response = await getCart(userId, accessToken);
          setCart(response);
          setSelectedItem(new Array(response.items.length).fill(false));
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCart();
  }, [accessToken, userId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const triggerPoint = 175;

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

  const totalCost = selectedItem.reduce((total, isSelected, index) => {
    return isSelected ? total + (cart?.items[index]?.itemTotalPrice || 0) : total;
  }, 0);

  const handleClearAll = async () => {
    setLoading(true);
    if (userId !== "" && accessToken !== "") {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await clearCartItem(userId, accessToken);
        try {
          const response = await getCart(userId, accessToken);
          setCart(response);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { }
        toast.success("Clear cart successful.");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to clear cart.");
      }
      finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }

  const goToOrder = () => {
    if (!selectedItem.some(isSelected => isSelected)) {
      setOrderMessage("Please select at least 1 product !");
      return;
    }
    setOrderMessage('');

    const selectedProducts = cart?.items.filter((_, index) => selectedItem[index]) || [];

    const productDetails = selectedProducts.map(item => ({
      productId: item.productId,
      variantId: item.variantId !== undefined ? item.variantId : null,
      quantity: item.quantity
    }));

    setOrder(prevOrder => {
      const currentOrder: OrderData = prevOrder || {
        shippingAddress: {
          fullname: '',
          phone: '',
          street: '',
          ward: '',
          district: '',
          city: ''
        },
        items: [],
        couponCode: "",
        paymentMethod: '',
        deliveryId: ''
      };

      return {
        ...currentOrder,
        items: productDetails,
      };
    });

    setProductPrice(totalCost);

    router.push("/order");
  }

  return (
    <div className='sm:px-6 md:px-12 lg:px-24 my-10'>
      <div className='flex items-center space-x-24'>
        <BackButton previousPathname="/" />

        <ul className="flex space-x-1 text-xl">
          <li>
            <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
          </li>
          <li>
            My Cart
          </li>
        </ul>
      </div>

      <div className='flex mt-10 px-20 space-x-20'>
        <div className='flex flex-col items-start space-y-4'>
          <div className='flex justify-between items-center w-full px-4'>
            <SelectedAllCombobox selectedAll={selectedAll} setSelectedAll={setSelectedAll} />
            <div className='flex items-center space-x-6'>
              <div className='flex mt-1 space-x-2'>
                <h4 className='font-semibold'>Total:</h4>
                <h4>{`${cart?.items?.length || 0} ${cart?.items?.length === 1 ? 'item' : 'items'}`}</h4>
              </div>

              <button
                onClick={handleClearAll}
                disabled={loading}
                className="flex justify-center h-fit w-20 py-1 rounded-md border border-gray-700 text-md"
              >
                {loading ? (
                  <ClipLoader
                    size={20}
                    color='#000000'
                    aria-label="Loading Spinner"
                  />
                ) : (
                  'Clear all'
                )}
              </button>
            </div>
          </div>
          <ItemTable cart={cart} setCart={setCart} selectedAll={selectedAll} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
          {cart?.items?.length === 0 && (
            <div className='flex justify-center items-center w-[1085px] text-lg py-4'>There&apos;s no item</div>
          )}
        </div>

        <div
          className={`flex flex-col w-[390px] h-fit mt-12 shadow-lg px-4 py-10 space-y-10 rounded-lg transition-all duration-300 ease-in-out ${isFixed ? 'fixed top-32 right-[175px]' : ''}`}
        >
          <h1>Order Summary</h1>

          <div className='flex justify-between'>
            <h4 className='font-semibold'>Total Cost:</h4>
            <h4>{formatPrice(totalCost)}</h4>
          </div>

          <div className='flex flex-col space-y-4'>
            {orderMessage && (
              <div className='text-red-500 font-semibold text-lg'>
                {orderMessage}
              </div>
            )}

            <button
              onClick={goToOrder}
              className='flex justify-center items-center text-xl font-semibold bg-gray-900 px-6 py-2 rounded-md text-white'
            >
              <ShoppingCartIcon className='size-8 mr-3' />
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}