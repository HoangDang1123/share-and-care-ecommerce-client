'use client';

import { cancelOrder, getOrderDetail } from '@/app/api/order';
import { OrderItem } from '@/app/ui/order/detail/order-item';
import OrderTimeline from '@/app/ui/order/detail/order-status';
import { OrderDetailResponse, OrderStatus, PaymentMethod } from '@/interface/order';
import { convertDateTime, formatPrice, getOrderStatusLabel } from '@/utils/helpers';
import { Button } from '@headlessui/react';
import {
  ArrowTurnDownLeftIcon,
  CalendarIcon,
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  ReceiptPercentIcon,
  TruckIcon,
  UserIcon,
  ShoppingBagIcon,
  TagIcon,
  TicketIcon,
  GiftIcon,
  BanknotesIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
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
    [OrderStatus.READY_TO_SHIP]: 'bg-indigo-100 text-indigo-800',
    [OrderStatus.IN_TRANSIT]: 'bg-sky-100 text-sky-800',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [OrderStatus.NOT_DELIVERED]: 'bg-emerald-100 text-emerald-800',
    [OrderStatus.RETURN]: 'bg-orange-200 text-orange-900',
  };

  const canCancel = order
    && (order.order.status === OrderStatus.PENDING
      || order.order.status === OrderStatus.AWAITING_PAYMENT
      || order.order.status === OrderStatus.PROCESSING
      || order.order.status === OrderStatus.READY_TO_SHIP)

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
  }, [accessToken, id, userId, order?.order.status]);

  const handlePayment = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setPaymentLoading(true);
    try {
      if (order && order.paymentUrl) {
        router.replace(order.paymentUrl);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { }
    finally {
      setPaymentLoading(false);
    }
  }

  const handleCanceling = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setCancelLoading(true);
    try {
      if (typeof id !== 'string') {
        return;
      }

      await cancelOrder(id, userId, accessToken);
      toast.success("Hủy đơn hàng thành công.");

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

  if (!order) {
    return (
      <div>Đang tải...</div>
    )
  }

  return (
    <div className='md:px-12 lg:px-24 sm:my-5 md:my-20'>
      <div className='flex items-center sm:px-6 md:px-0 sm:space-x-8 md:space-x-24'>
        <Button
          onClick={() => router.replace("/profile")}
          className='hover:bg-gray-300 hover:rounded-md px-1 py-1'
        >
          <ArrowTurnDownLeftIcon className='sm:size-6 xl:size-8' />
        </Button>

        <ul className="flex space-x-1 sm:text-md md:text-xl text-ellipsis text-nowrap">
          <li>
            <Link href="/" className='text-gray-400 text-base hover:text-gray-900'>Trang chủ / </Link>
          </li>
          <li>
            <Link href="/profile" className='text-gray-400 text-base hover:text-gray-900'>Đơn hàng / </Link>
          </li>
          <li>
            <span className="text-base">{order.order.id}</span>
          </li>
        </ul>
      </div>

      <Row className='sm:mt-4 md:mt-10 md:px-20'>
        <Col xs={24} md={17} className='flex flex-col gap-y-4'>
          <OrderTimeline
            paymentMethod={order.order.paymentMethod}
            currentStatus={order.order.status.toUpperCase()}
          />
          <div className='flex flex-col border-2 p-4 sm:p-6 gap-y-4 rounded-md hover:text-gray-900'>
            <div className='flex flex-col md:flex-row justify-between gap-4'>
              <div className='flex flex-col gap-y-4'>
                <span className='font-semibold'>{`Mã đơn hàng: ${order.order.id}`}</span>
                <div className="flex items-start gap-2">
                  <CalendarIcon className="w-4 h-4 mt-1 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Ngày đặt hàng</p>
                    <p className="font-medium text-foreground">
                      {convertDateTime(order.order.timestamps.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <TruckIcon className="w-4 h-4 mt-1 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Dịch vụ giao hàng</p>
                    <p className="font-medium text-foreground">{order.order.deliveryMethod}</p>
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-start md:items-end gap-y-4'>
                <span className={`font-semibold px-3 py-1 rounded-lg ${statusBadge[order.order.status]}`}>
                  {getOrderStatusLabel(order.order.status).replace(/_/g, ' ')}
                </span>

                {order.order.timestamps.deliveredAt !== null && (
                  <div className="flex items-start gap-2">
                    <CalendarIcon className="w-4 h-4 mt-1 text-primary" />
                    <div>
                      <p className="text-muted-foreground">Ngày giao hàng</p>
                      <p className="font-medium text-foreground">
                        {convertDateTime(order.order.timestamps.deliveredAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Row gutter={[16, 16]} className='w-full'>
              <Col xs={24} sm={12} md={6}>
                <div className="flex items-start gap-2">
                  <UserIcon className="w-4 h-4 mt-1 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Họ tên</p>
                    <p className="font-medium text-foreground">{order.order.shippingAddress.fullname}</p>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12} md={4}>
                <div className="flex items-start gap-2">
                  <PhoneIcon className="w-4 h-4 mt-1 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium text-foreground">{order.order.shippingAddress.phone}</p>
                  </div>
                </div>
              </Col>

              <Col xs={24} md={14}>
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-4 h-4 mt-1 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Địa chỉ</p>
                    <p className="font-medium text-foreground">
                      {`${order.order.shippingAddress.street}, ${order.order.shippingAddress.ward}, ${order.order.shippingAddress.district}, ${order.order.shippingAddress.city}`}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>

            {order.order.items.map((childItem, index) => (
              <OrderItem key={index} item={childItem} orderId={order.order.id} status={order.order.status} />
            ))}

            <div className='flex justify-end'>
              {order.order.paymentMethod === PaymentMethod.COD ? (
                <Image src={'/assets/cash-payment.png'} alt='Thanh toán khi nhận hàng' width={100} height={100} className='w-16' />
              ) : order.order.paymentMethod === PaymentMethod.VNPAY ? (
                <Image src={'/assets/vnpay.png'} alt='VNPAY' width={100} height={100} className='w-16' />
              ) : (
                <Image src={'/assets/momo.png'} alt='MOMO' width={100} height={100} className='w-16' />
              )}
            </div>
          </div>
        </Col>

        <Col lg={1} />

        <Col xs={24} md={6} className="flex flex-col w-full h-fit md:shadow-lg px-4 pt-10 gap-y-10 md:rounded-lg transition-all duration-300 ease-in-out">
          <span className='flex items-center gap-2 font-bold text-3xl'>
            <ReceiptPercentIcon className='w-10 h-10 text-gray-700' />
            Thông tin đơn hàng
          </span>

          <div className='flex flex-col gap-y-4'>
            <div className='flex justify-between items-center text-gray-800'>
              <div className='flex items-center gap-2'>
                <ShoppingBagIcon className='w-5 h-5 text-blue-500' />
                <span className='font-semibold sm:text-base md:text-lg'>Tổng tiền hàng:</span>
              </div>
              <span className='sm:text-base md:text-lg'>{formatPrice(order.order.pricing.itemsPrice)}</span>
            </div>

            <div className='flex justify-between items-center text-gray-800'>
              <div className='flex items-center gap-2'>
                <TruckIcon className='w-5 h-5 text-orange-500' />
                <span className='font-semibold sm:text-base md:text-lg'>Phí vận chuyển:</span>
              </div>
              <span className='sm:text-base md:text-lg'>{`+ ${formatPrice(order.order.pricing.shippingPrice)}`}</span>
            </div>

            <div className='flex justify-between items-center text-gray-800'>
              <div className='flex items-center gap-2'>
                <TagIcon className='w-5 h-5 text-green-600' />
                <span className='font-semibold sm:text-base md:text-lg'>Giảm giá sản phẩm:</span>
              </div>
              <span className='sm:text-base md:text-lg'>{`- ${formatPrice(order.order.pricing.productDiscount)}`}</span>
            </div>

            <div className='flex justify-between items-center text-gray-800'>
              <div className='flex items-center gap-2'>
                <TicketIcon className='w-5 h-5 text-green-600' />
                <span className='font-semibold sm:text-base md:text-lg'>Giảm giá mã khuyến mãi:</span>
              </div>
              <span className='sm:text-base md:text-lg'>{`- ${formatPrice(order.order.pricing.couponDiscount)}`}</span>
            </div>

            <div className='flex justify-between items-center text-gray-800'>
              <div className='flex items-center gap-2'>
                <GiftIcon className='w-5 h-5 text-green-600' />
                <span className='font-semibold sm:text-base md:text-lg'>Giảm giá vận chuyển:</span>
              </div>
              <span className='sm:text-base md:text-lg'>{`- ${formatPrice(order.order.pricing.shippingDiscount)}`}</span>
            </div>

            <div className='w-full h-0.5 bg-gray-200' />

            <div className='flex justify-between items-center font-medium'>
              <div className='flex items-center gap-2'>
                <BanknotesIcon className='w-5 h-5 text-green-700' />
                <span className='sm:text-base md:text-lg'>Tổng tiết kiệm:</span>
              </div>
              <span className='sm:text-base md:text-lg'>{`- ${formatPrice(order.order.pricing.totalSavings)}`}</span>
            </div>

            <div className='w-full h-0.5 bg-gray-200' />

            <div className='flex justify-between items-center text-black font-bold'>
              <div className='flex items-center gap-2'>
                <CurrencyDollarIcon className='w-6 h-6 text-gray-800' />
                <span className='sm:text-base md:text-lg'>Tổng cộng:</span>
              </div>
              <span className='sm:text-base md:text-lg'>{formatPrice(order.order.pricing.totalPrice)}</span>
            </div>
          </div>

          <div className='flex flex-col w-full gap-y-4'>
            {order.order.status === OrderStatus.AWAITING_PAYMENT && (
              <button
                onClick={handlePayment}
                className='flex justify-center items-center h-12 bg-gray-800 hover:bg-gray-900 text-white text-xl font-bold rounded-lg'
              >
                {paymentLoading ? (
                  <ClipLoader size={20} color='#ffffff' aria-label="Loading Spinner" />
                ) : (
                  <div className='flex justify-center items-center gap-x-2'>
                    <CreditCardIcon className='size-7' />
                    <span>Thanh toán</span>
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
                  <ClipLoader size={20} color='#ffffff' aria-label="Loading Spinner" />
                ) : (
                  <span>Hủy đơn</span>
                )}
              </button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}