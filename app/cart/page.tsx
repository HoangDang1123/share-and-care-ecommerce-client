'use client'

import React, { useEffect, useState } from 'react'
import BackButton from '../ui/back-button';
import Link from 'next/link';
import ItemTable from '../ui/cart/item-table';
import SelectedAllCombobox from '../ui/cart/selected-all-combobox';
import { formatPrice } from '@/utils/helpers';
import { BanknotesIcon, CurrencyDollarIcon, GiftIcon, ReceiptPercentIcon, ShoppingCartIcon, TagIcon, TicketIcon, TruckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { clearCartItem, getCart } from '../api/cart';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { useCart, useOrder } from '../context/AppContext';
import { CreateOrder, OrderPricingSummary } from '@/interface/order';
import { getPreviewOrder } from '../api/order';
import { Col, Row } from 'antd';

export default function Page() {
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItem, setSelectedItem] = useState<boolean[]>([]);
  const [orderMessage, setOrderMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { setOrder } = useOrder();
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [preview, setPreview] = useState<OrderPricingSummary | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const router = useRouter();
  const { cart, setCart } = useCart();

  const emptyPreview: OrderPricingSummary = {
    itemsPrice: 0,
    productDiscount: 0,
    couponDiscount: 0,
    shippingPrice: 0,
    shippingDiscount: 0,
    orderDiscount: 0,
    totalSavings: 0,
    totalPrice: 0,
    items: [],
  };

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    setAccessToken(localStorage.getItem('accessToken') || '');
  }, []);

  useEffect(() => {
    console.log(preview)
  }, [preview]);

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

  useEffect(() => {
    const fetchPreviewOrder = async () => {
      const selectedProducts = cart?.items.filter((_, index) => selectedItem[index]) || [];

      if (selectedProducts.length === 0) {
        setPreview(emptyPreview);
        return;
      }

      const itemData = selectedProducts.map(item => ({
        productId: item.productId,
        variantId: item.variantId !== undefined ? item.variantId : undefined,
        quantity: item.quantity,
      }));

      const previewOrder = {
        shippingAddress: {
          fullname: '',
          phone: '',
          street: '',
          ward: '',
          district: '',
          city: ''
        },
        items: itemData,
        couponCode: '',
        paymentMethod: '',
        deliveryId: ''
      };

      try {
        const response = await getPreviewOrder(previewOrder, userId, accessToken);
        setPreview(response);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Không thể tính tổng đơn hàng");
      }
    };

    if (userId && accessToken) {
      fetchPreviewOrder();
    }
  }, [selectedItem, userId, accessToken, cart]);

  const handleFetchCoupon = async (code: string) => {
    if (!userId || !accessToken || !cart) return;

    const selectedProducts = cart.items.filter((_, index) => selectedItem[index]) || [];
    if (selectedProducts.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm trước khi áp dụng mã giảm giá.");
      return;
    }

    const itemData = selectedProducts.map(item => ({
      productId: item.productId,
      variantId: item.variantId !== undefined ? item.variantId : undefined,
      quantity: item.quantity
    }));

    const previewOrder = {
      shippingAddress: {
        fullname: '',
        phone: '',
        street: '',
        ward: '',
        district: '',
        city: ''
      },
      items: itemData,
      couponCode: code,
      paymentMethod: '',
      deliveryId: ''
    };

    try {
      const result = await getPreviewOrder(previewOrder, userId, accessToken);
      setPreview(result);
      setOrder(previewOrder);

      if (code) {
        toast.success("Áp dụng mã giảm giá thành công!");
      } else {
        toast.success("Đã xóa mã giảm giá.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { }
  }

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
                  <span className='font-semibold sm:text-lg md:text-xl'>Tổng tiền hàng:</span>
                </div>
                <span className='sm:text-lg md:text-xl'>{formatPrice(preview.itemsPrice)}</span>
              </div>

              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <BanknotesIcon className='w-5 h-5 text-green-600' />
                  <span className='font-semibold sm:text-lg md:text-xl'>Giảm giá sản phẩm:</span>
                </div>
                <span className='sm:text-lg md:text-xl'>{`- ${formatPrice(preview.productDiscount)}`}</span>
              </div>

              <div className='w-full h-0.5 bg-gray-200' />

              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <TruckIcon className='w-5 h-5 text-green-600' />
                  <span className='font-semibold sm:text-lg md:text-xl'>Phí vận chuyển:</span>
                </div>
                <span className='sm:text-lg md:text-xl'>{`+ ${formatPrice(preview.shippingPrice)}`}</span>
              </div>

              <div className='w-full h-0.5 bg-gray-200' />

              <div className='flex flex-col gap-2'>
                <div className='flex justify-between items-center gap-2'>
                  <div className='flex items-center gap-2'>
                    <TagIcon className='w-5 h-5 text-orange-600' />
                    <span className='font-semibold sm:text-lg md:text-xl'>Mã giảm giá:</span>
                  </div>
                  <input
                    type='text'
                    placeholder='Nhập mã giảm giá'
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className='px-4 py-2 bg-orange-100 border border-orange-300 rounded-md text-sm w-28 md:w-48 shadow-inner placeholder-orange-800
      focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
      hover:bg-orange-100 transition duration-200'
                  />
                </div>
                <div className='flex justify-end gap-1'>
                  <button
                    onClick={() => {
                      setCouponInput('');
                      handleFetchCoupon('');
                    }}
                    className='px-4 py-1 text-sm text-orange-600 border border-orange-600 hover:bg-orange-50 rounded-md transition duration-200'
                  >
                    Xóa mã
                  </button>
                  <button
                    onClick={() => handleFetchCoupon(couponInput)}
                    className='px-4 py-1 text-sm text-white bg-orange-600 hover:bg-orange-700 rounded-md transition duration-200'
                  >
                    Áp dụng mã
                  </button>
                </div>
              </div>

              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <TicketIcon className='w-5 h-5 text-green-600' />
                  <span className='font-semibold sm:text-lg md:text-xl'>Giảm giá mã khuyến mãi:</span>
                </div>
                <span className='sm:text-lg md:text-xl'>{formatPrice(preview.couponDiscount)}</span>
              </div>

              <div className='w-full h-0.5 bg-gray-200' />

              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <GiftIcon className='w-5 h-5 text-green-600' />
                  <span className='font-semibold sm:text-lg md:text-xl'>Tổng tiết kiệm:</span>
                </div>
                <span className='sm:text-lg md:text-xl'>{formatPrice(preview.totalSavings)}</span>
              </div>

              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <CurrencyDollarIcon className='w-5 h-5 text-gray-800' />
                  <span className='font-semibold sm:text-lg md:text-xl'>Tổng tiền:</span>
                </div>
                <span className='sm:text-lg md:text-xl'>{formatPrice(preview.totalPrice)}</span>
              </div>
            </div>
          )}

          <div className='flex flex-col gap-y-2'>
            {orderMessage && (
              <div className='text-red-500 font-semibold text-lg'>
                {orderMessage}
              </div>
            )}

            <div className='flex flex-col space-y-4'>
              <button
                disabled={loading}
                onClick={goToOrder}
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
                    <span className='text-xl font-semibold text-white'>Tiến hành đặt hàng</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}