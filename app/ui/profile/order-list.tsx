'use client'

import React, { useState, useEffect } from 'react';
import { getAllOrderWithSize } from "../../api/order";
import { AllOrderResponse, OrderStatus } from "@/interface/order";
import { Tabs } from 'antd';
import Link from 'next/link';
import { convertDateTime, formatPrice, getOrderStatusLabel } from '@/utils/helpers';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Pagination from '../pagination';
import { CalendarIcon, TruckIcon } from '@heroicons/react/24/outline';
import { ReturnStatusCard } from '../order/detail/return-detail';
import { ReviewCard } from '../order/detail/review-detail';

interface OrderListProps {
  userId: string,
  accessToken: string,
  total?: number,
}

interface OrderItemProps {
  userId: string,
  accessToken: string,
  filter?: string | undefined,
  total?: number,
}

const OrderItem: React.FC<OrderItemProps> = ({ userId, accessToken, filter, total }) => {
  const [orders, setOrders] = useState<AllOrderResponse>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [openReviewMap, setOpenReviewMap] = useState<Record<string, boolean>>({});
  const [openReturnMap, setOpenReturnMap] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    if (total) {
      const fetchOrder = async () => {
        const response = await getAllOrderWithSize(userId, accessToken, total);
        setOrders(response);
      }

      fetchOrder();
    }
  }, [accessToken, userId, total]);

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

  const toggleReviewDetail = (key: string) => {
    setOpenReviewMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleReturnDetail = (key: string) => {
    setOpenReturnMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!orders || (orders && orders.total === 0)) {
    return <div className='flex justify-center items-center w-full text-lg py-4'>Bạn chưa có đơn hàng nào.</div>
  }

  if (!filter) {
    const paginatedItems = orders.items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
      <div className='flex flex-col gap-y-6'>
        {paginatedItems.map((order) => (
          <Link
            key={order.id}
            href={`/order/${order.id}`}
            className='flex flex-col border-2 p-6 gap-y-4 rounded-md hover:text-gray-900'
          >
            <div className='flex justify-between'>
              <div className='flex flex-col gap-y-4'>
                <span className='font-semibold mb-2'>{`ID: ${order.id}`}</span>
                <div className="flex items-start gap-2">
                  <CalendarIcon className="w-4 h-4 mt-1 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Ngày đặt hàng</p>
                    <p className="font-medium text-foreground">
                      {convertDateTime(order.createAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <TruckIcon className="w-4 h-4 mt-1 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Dịch vụ giao hàng</p>
                    <p className="font-medium text-foreground">{order.deliveryMethod}</p>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-y-4'>
                <span className={`font-semibold h-fit px-3 py-1 rounded-lg ${statusBadge[order.status]}`}>
                  {getOrderStatusLabel(order.status).replace(/_/g, ' ')}
                </span>

                {order.deliveredAt !== null && (

                  <div className="flex items-start gap-2">
                    <CalendarIcon className="w-4 h-4 mt-1 text-primary" />
                    <div>
                      <p className="text-muted-foreground">Ngày nhận hàng</p>
                      <p className="font-medium text-foreground">
                        {convertDateTime(order.deliveredAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {order.items.map((childItem, index) => (
              <div
                key={index}
                className='flex flex-col border-t-2 border-b-2 border-gray-100 py-4'
              >
                <div className='flex flex-col md:flex-row gap-x-4 py-4'>
                  <Image
                    src={childItem.image}
                    alt={childItem.productName}
                    width={500}
                    height={500}
                    className='object-cover w-24 sm:w-28 md:w-24'
                  />
                  <div className='flex flex-col justify-between w-full gap-y-2'>
                    <div className='flex flex-col md:flex-row justify-between gap-y-1'>
                      <div className='flex flex-col'>
                        <span className='text-base font-medium'>{childItem.productName}</span>
                        <span className='text-sm text-gray-600'>{`Phân loại: ${childItem.variantSlug}`}</span>
                      </div>

                      <span className='hidden md:inline-block text-base font-semibold'>
                        {`Giá: ${formatPrice(childItem.price)}`}
                      </span>
                    </div>

                    <div className='flex justify-between md:hidden text-base'>
                      <span>{`Giá: ${formatPrice(childItem.price)}`}</span>
                      <span>{`Số lượng: ${childItem.quantity}`}</span>
                    </div>

                    <div className='hidden md:flex justify-between'>
                      <span className='text-base'>{`Số lượng: ${childItem.quantity}`}</span>
                      <div className='flex gap-x-2'>
                        {childItem.isReviewed ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleReviewDetail(`${order.id}-${index}`);
                            }}
                            disabled={order.status !== OrderStatus.DELIVERED}
                            className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300'
                          >
                            Xem đánh giá
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/review/${order.id}-${childItem.productId}-${childItem.variantId}`);
                            }}
                            disabled={!childItem.canReview || order.status !== OrderStatus.DELIVERED}
                            className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300'
                          >
                            Đánh giá
                          </button>
                        )}

                        {childItem.returnStatus && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleReturnDetail(`${order.id}-${index}`);
                            }}
                            className='inline-block text-sm font-medium px-3 py-1 text-white rounded-lg w-fit bg-gray-800 hover:bg-gray-900'
                          >
                            Xem tình trạng hoàn trả
                          </button>
                        )}
                      </div>
                    </div>

                    <div className='flex md:hidden flex-wrap gap-2'>
                      {childItem.isReviewed ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleReviewDetail(`${order.id}-${index}`);
                          }}
                          disabled={order.status !== OrderStatus.DELIVERED}
                          className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300 text-sm'
                        >
                          Xem đánh giá
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/review/${order.id}-${childItem.productId}-${childItem.variantId}`);
                          }}
                          disabled={!childItem.canReview || order.status !== OrderStatus.DELIVERED}
                          className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300 text-sm'
                        >
                          Đánh giá
                        </button>
                      )}

                      {childItem.returnStatus && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleReturnDetail(`${order.id}-${index}`);
                          }}
                          className='inline-block text-sm font-medium px-3 py-1 text-white rounded-lg w-fit bg-gray-800 hover:bg-gray-900'
                        >
                          Xem tình trạng hoàn trả
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {openReviewMap[`${order.id}-${index}`] && (
                  <ReviewCard
                    orderId={order.id}
                    productId={childItem.productId}
                    variantId={childItem.variantId}
                  />
                )}

                {openReturnMap[`${order.id}-${index}`] && childItem.returnStatus && (
                  <ReturnStatusCard returnStatus={childItem.returnStatus} />
                )}
              </div>
            ))}

            <span className='block text-right w-full font-semibold'>
              {`Tổng tiền: ${formatPrice(order.totalPrice)}`}
            </span>
          </Link>
        ))}

        <div className='flex justify-center items-center gap-x-4 mt-4'>
          <Pagination
            currentPage={currentPage}
            totalItems={orders.total}
            itemsPerPage={pageSize}
            onPageChange={setCurrentPage}
          />

          <div className='flex justify-center items-center gap-x-2'>
            <select
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border rounded-md p-1 text-base"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
            <span>sản phẩm mỗi trang</span>
          </div>
        </div>
      </div>
    );
  }

  const paginatedItems = orders.items.filter(o => o.status === filter).slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (paginatedItems.length === 0) {
    return <div className='flex justify-center items-center w-full text-lg py-4'>Bạn chưa có đơn hàng nào.</div>
  }

  return (
    <div className='flex flex-col gap-y-6'>
      {paginatedItems.map((order) => (
        <Link
          key={order.id}
          href={`/order/${order.id}`}
          className='flex flex-col border-2 p-6 gap-y-4 rounded-md hover:text-gray-900'
        >
          <div className='flex justify-between'>
            <div className='flex flex-col gap-y-4'>
              <span className='font-semibold mb-2'>{`ID: ${order.id}`}</span>
              <div className="flex items-start gap-2">
                <CalendarIcon className="w-4 h-4 mt-1 text-primary" />
                <div>
                  <p className="text-muted-foreground">Ngày đặt hàng</p>
                  <p className="font-medium text-foreground">
                    {convertDateTime(order.createAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <TruckIcon className="w-4 h-4 mt-1 text-primary" />
                <div>
                  <p className="text-muted-foreground">Dịch vụ giao hàng</p>
                  <p className="font-medium text-foreground">{order.deliveryMethod}</p>
                </div>
              </div>
            </div>
            <div className='flex flex-col items-end gap-y-4'>
              <span className={`font-semibold h-fit px-3 py-1 rounded-lg ${statusBadge[order.status]}`}>
                {getOrderStatusLabel(order.status).replace(/_/g, ' ')}
              </span>

              {order.deliveredAt !== null && (

                <div className="flex items-start gap-2">
                  <CalendarIcon className="w-4 h-4 mt-1 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Ngày nhận hàng</p>
                    <p className="font-medium text-foreground">
                      {convertDateTime(order.deliveredAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {order.items.map((childItem, index) => (
            <div
              key={index}
              className='flex flex-col border-t-2 border-b-2 border-gray-100 py-4'
            >
              <div className='flex flex-col md:flex-row gap-x-4 py-4'>
                <Image
                  src={childItem.image}
                  alt={childItem.productName}
                  width={500}
                  height={500}
                  className='object-cover w-24 sm:w-28 md:w-24'
                />
                <div className='flex flex-col justify-between w-full gap-y-2'>
                  <div className='flex flex-col md:flex-row justify-between gap-y-1'>
                    <div className='flex flex-col'>
                      <span className='text-base font-medium'>{childItem.productName}</span>
                      <span className='text-sm text-gray-600'>{`Phân loại: ${childItem.variantSlug}`}</span>
                    </div>

                    <span className='hidden md:inline-block text-base font-semibold'>
                      {`Giá: ${formatPrice(childItem.price)}`}
                    </span>
                  </div>

                  <div className='flex justify-between md:hidden text-base'>
                    <span>{`Giá: ${formatPrice(childItem.price)}`}</span>
                    <span>{`Số lượng: ${childItem.quantity}`}</span>
                  </div>

                  <div className='hidden md:flex justify-between'>
                    <span className='text-base'>{`Số lượng: ${childItem.quantity}`}</span>
                    <div className='flex gap-x-2'>
                      {childItem.isReviewed ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleReviewDetail(`${order.id}-${index}`);
                          }}
                          disabled={order.status !== OrderStatus.DELIVERED}
                          className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300'
                        >
                          Xem đánh giá
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/review/${order.id}-${childItem.productId}-${childItem.variantId}`);
                          }}
                          disabled={!childItem.canReview || order.status !== OrderStatus.DELIVERED}
                          className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300'
                        >
                          Đánh giá
                        </button>
                      )}

                      {childItem.returnStatus && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleReturnDetail(`${order.id}-${index}`);
                          }}
                          className='inline-block text-sm font-medium px-3 py-1 text-white rounded-lg w-fit bg-gray-800 hover:bg-gray-900'
                        >
                          Xem tình trạng hoàn trả
                        </button>
                      )}
                    </div>
                  </div>

                  <div className='flex md:hidden flex-wrap gap-2'>
                    {childItem.isReviewed ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleReviewDetail(`${order.id}-${index}`);
                        }}
                        disabled={order.status !== OrderStatus.DELIVERED}
                        className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300 text-sm'
                      >
                        Xem đánh giá
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/review/${order.id}-${childItem.productId}-${childItem.variantId}`);
                        }}
                        disabled={!childItem.canReview || order.status !== OrderStatus.DELIVERED}
                        className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300 text-sm'
                      >
                        Đánh giá
                      </button>
                    )}

                    {childItem.returnStatus && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleReturnDetail(`${order.id}-${index}`);
                        }}
                        className='inline-block text-sm font-medium px-3 py-1 text-white rounded-lg w-fit bg-gray-800 hover:bg-gray-900'
                      >
                        Xem tình trạng hoàn trả
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {openReviewMap[`${order.id}-${index}`] && (
                <ReviewCard
                  orderId={order.id}
                  productId={childItem.productId}
                  variantId={childItem.variantId}
                />
              )}

              {openReturnMap[`${order.id}-${index}`] && childItem.returnStatus && (
                <ReturnStatusCard returnStatus={childItem.returnStatus} />
              )}
            </div>
          ))}

          <span className='block text-right w-full font-semibold'>
            {`Tổng tiền: ${formatPrice(order.totalPrice)}`}
          </span>
        </Link>
      ))}

      <div className='flex justify-center items-center gap-x-4 mt-4'>
        <Pagination
          currentPage={currentPage}
          totalItems={orders.items.filter(o => o.status === filter).length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />

        <div className='flex justify-center items-center gap-x-2'>
          <select
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="border rounded-md p-1 text-base"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <span>sản phẩm mỗi trang</span>
        </div>
      </div>
    </div>
  );
}

export const OrderList: React.FC<OrderListProps> = ({ userId, accessToken, total }) => {
  const orderLists = Object.values(OrderStatus).map((status, index) => ({
    key: String(index + 1),
    label: getOrderStatusLabel(status),
    children: <OrderItem
      key={`${status}-${userId}`}
      userId={userId}
      accessToken={accessToken}
      filter={status}
      {...(total ? { total: total } : {})}
    />,
  }));

  orderLists.unshift({
    key: '0',
    label: 'Tất cả',
    children: <OrderItem
      key={`all-${userId}`}
      userId={userId}
      accessToken={accessToken}
      {...(total ? { total: total } : {})}
    />,
  });

  return (
    <div>
      <Tabs
        items={orderLists}
        size='large'
        defaultActiveKey='0'
        tabBarStyle={{ backgroundColor: "#e5e7eb", borderRadius: "5px" }}
        className="custom-order-tabs"
      />
    </div>
  );
}
