'use client'

import React, { useEffect, useState } from 'react'
import BackButton from '../ui/back-button';
import Link from 'next/link';
import ItemTable from '../ui/cart/item-table';
import SelectedAllCombobox from '../ui/cart/selected-all-combobox';
import { formatPrice } from '@/utils/helpers';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { clearCartItem, getCart } from '../api/cart';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { useCart, useOrder } from '../context/AppContext';
import { CreateOrder } from '@/interface/order';
import { Col, Row } from 'antd';

export default function Page() {
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItem, setSelectedItem] = useState<boolean[]>([]);
  const [orderMessage, setOrderMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { setOrder, setProductPrice } = useOrder();
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const router = useRouter();
  const { cart, setCart } = useCart();

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    setAccessToken(localStorage.getItem('accessToken') || '');
  }, []);

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
  }, [accessToken, setCart, userId]);

  const totalCost = selectedItem.reduce((total, isSelected, index) => {
    if (!isSelected) return total;

    const item = cart?.items[index];
    if (!item) return total;

    const price = item?.variantSlug ? item?.itemTotalPrice : item?.itemTotalOriginalPrice;

    return total + (price || 0);
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
        toast.success("Xóa tất cả thành công.");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Xóa tất cả không thành công.");
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
      setOrderMessage("Vui lòng chọn ít nhất 1 sản phẩm!");
      return;
    }
    setOrderMessage('');

    const selectedProducts = cart?.items.filter((_, index) => selectedItem[index]) || [];

    const itemData = selectedProducts.map(item => ({
      productId: item.productId,
      variantId: item.variantId !== undefined ? item.variantId : undefined,
      quantity: item.quantity
    }));

    setOrder(prevOrder => {
      const currentOrder: CreateOrder = prevOrder || {
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
        items: itemData,
      };
    });

    setProductPrice(totalCost);

    localStorage.setItem('productInCart', 'true');

    router.push("/order");
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

        <ul className="flex space-x-1 sm:text-md md:text-xl">
          <li>
            <Link href="/" className='text-gray-400 text-base hover:text-gray-900'>Trang chủ / </Link>
          </li>
          <li>
            <span className="text-base">Giỏ hàng của tôi</span>
          </li>
        </ul>
      </div>

      <Row className='flex sm:mt-4 md:mt-10 md:px-20'>
        <Col
          xs={24} lg={17}
          className='flex flex-col items-start space-y-4'
        >
          <div className='flex justify-between items-center w-full px-4'>
            <SelectedAllCombobox selectedAll={selectedAll} setSelectedAll={setSelectedAll} />
            <div className='flex justify-center items-center sm:space-x-2 md:space-x-6'>
              <div className='flex space-x-1'>
                <span className='font-semibold sm:text-base md:text-xl'>Tổng:</span>
                <span className='sm:text-base md:text-xl'>{`${cart?.items?.length || 0} sản phẩm`}</span>
              </div>

              <button
                onClick={handleClearAll}
                disabled={loading}
                className="flex justify-center h-fit sm:w-16 md:w-20 py-1 rounded-md border border-gray-700 sm:text-xs md:text-md"
              >
                {loading ? (
                  <ClipLoader
                    size={20}
                    color='#000000'
                    aria-label="Loading Spinner"
                  />
                ) : (
                  'Xóa tất cả'
                )}
              </button>
            </div>
          </div>
          <ItemTable selectedAll={selectedAll} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
          {cart?.items?.length === 0 && (
            <div className='flex justify-center items-center w-full text-lg py-4'>Bạn chưa thêm sản phẩm nào</div>
          )}
        </Col>

        <Col lg={1} />

        <Col
          xs={24} lg={6}
          className="flex flex-col h-fit mt-12 shadow-lg px-4 py-10 space-y-10 rounded-lg transition-all duration-300 ease-in-out"
        >
          <span className='text-3xl font-bold'>Thông tin đơn hàng</span>

          <div className='flex justify-between'>
            <span className='text-xl font-semibold'>Tổng tiền:</span>
            <span className='text-xl'>{formatPrice(totalCost)}</span>
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
              Tiến hành đặt hàng
            </button>
          </div>
        </Col>
      </Row>
    </div>
  )
}