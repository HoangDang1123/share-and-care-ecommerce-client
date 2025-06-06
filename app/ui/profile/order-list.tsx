'use client'

import React, { useState, useEffect } from 'react';
import { getAllOrderWithSize } from "../../api/order";
import { AllOrderResponse, OrderStatus } from "@/interface/order";
import { Tabs } from 'antd';
import Link from 'next/link';
import { convertDateTime, formatPrice } from '@/utils/helpers';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Pagination from '../pagination';

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
    [OrderStatus.AWAITING_SHIPMENT]: 'bg-indigo-100 text-indigo-800',
    [OrderStatus.SHIPPED]: 'bg-sky-100 text-sky-800',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [OrderStatus.NOT_DELIVERED]: 'bg-emerald-100 text-emerald-800',
    [OrderStatus.RETURN]: 'bg-orange-200 text-orange-900',
  };

  if (!orders || (orders && orders.total === 0)) {
    return <div className='flex justify-center items-center w-full text-lg py-4'>There&apos;s no order.</div>
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
              <div className='flex flex-col'>
                <span className='font-semibold mb-2'>{`ID: ${order.id}`}</span>
                <span>{`Ordered Date: ${convertDateTime(order.createAt)}`}</span>
                <span>{`Delivery Method: ${order.deliveryMethod}`}</span>
              </div>
              <span className={`font-semibold h-fit px-3 py-1 rounded-lg ${statusBadge[order.status]}`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            {order.items.map((childItem, index) => (
              <div
                key={index}
                className='flex gap-x-4 border-t-2 border-b-2 border-gray-100 py-4'
              >
                <Image
                  src={childItem.image}
                  alt={childItem.productName}
                  width={500}
                  height={500}
                  className='object-cover w-24'
                />
                <div className='flex flex-col justify-between w-full'>
                  <div className='flex justify-between'>
                    <div className='flex flex-col'>
                      <span>{childItem.productName}</span>
                      <span>{`Slug: ${childItem.variantSlug}`}</span>
                    </div>
                    <span>{`Price: ${formatPrice(childItem.price)}`}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span>{`Quantity: ${childItem.quantity}`}</span>
                    <div className='flex gap-x-2'>
                      {childItem.isReviewed ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();

                            router.push(`/review/${order.id}-${childItem.productId}-${childItem.variantId}`)
                          }}
                          className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300'
                        >
                          View Review Detail
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();

                            router.push(`/review/${order.id}-${childItem.productId}-${childItem.variantId}`)
                          }}
                          disabled={!childItem.canReview || order.status !== OrderStatus.DELIVERED}
                          className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300'
                        >
                          Review
                        </button>
                      )}

                      <button
                        disabled={!childItem.canReturn}
                        className={`inline-block text-sm font-medium px-3 py-1 text-white rounded-lg w-fit ${childItem.canReturn
                          ? 'bg-gray-800 hover:bg-gray-900'
                          : 'bg-gray-300'
                          }`}
                      >
                        {childItem.canReturn ? 'Request Return' : 'Not Returnable'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <span className='block text-right w-full font-semibold'>
              {`Total: ${formatPrice(order.totalPrice)}`}
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
            <span>items per page</span>
          </div>
        </div>
      </div>
    );
  }

  const paginatedItems = orders.items.filter(o => o.status === filter).slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (paginatedItems.length === 0) {
    return <div className='flex justify-center items-center w-full text-lg py-4'>There&apos;s no order.</div>
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
            <div className='flex flex-col'>
              <span className='font-semibold mb-2'>{`ID: ${order.id}`}</span>
              <span>{`Ordered Date: ${convertDateTime(order.createAt)}`}</span>
              <span>{`Delivery Method: ${order.deliveryMethod}`}</span>
            </div>

            <div className='flex flex-col items-end gap-y-5'>
              <span className={`font-semibold h-fit px-3 py-1 rounded-lg ${statusBadge[order.status]}`}>
                {order.status.replace(/_/g, ' ')}
              </span>

              {order.deliveredAt !== null && (
                <span>{`Delivered Date: ${convertDateTime(order.deliveredAt)}`}</span>
              )}
            </div>
          </div>

          {order.items.map((childItem, index) => (
            <div
              key={index}
              className='flex gap-x-4 border-t-2 border-b-2 border-gray-100 py-4'
            >
              <Image
                src={childItem.image}
                alt={childItem.productName}
                width={500}
                height={500}
                className='object-cover w-24'
              />
              <div className='flex flex-col justify-between w-full'>
                <div className='flex justify-between'>
                  <div className='flex flex-col'>
                    <span>{childItem.productName}</span>
                    <span>{`Slug: ${childItem.variantSlug}`}</span>
                  </div>
                  <span>{`Price: ${formatPrice(childItem.price)}`}</span>
                </div>
                <div className='flex justify-between'>
                  <span>{`Quantity: ${childItem.quantity}`}</span>
                  <div className='flex gap-x-2'>
                    {childItem.isReviewed ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();

                          router.push(`/review/${order.id}-${childItem.productId}-${childItem.variantId}`)
                        }}
                        className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300'
                      >
                        View Review Detail
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();

                          router.push(`/review/${order.id}-${childItem.productId}-${childItem.variantId}`)
                        }}
                        disabled={!childItem.canReview || order.status !== OrderStatus.DELIVERED}
                        className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300'
                      >
                        Review
                      </button>
                    )}

                    <button
                      disabled={!childItem.canReturn}
                      className={`inline-block text-sm font-medium px-3 py-1 text-white rounded-lg w-fit ${childItem.canReturn
                        ? 'bg-gray-800 hover:bg-gray-900'
                        : 'bg-gray-300'
                        }`}
                    >
                      {childItem.canReturn ? 'Request Return' : 'Not Returnable'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <span className='block text-right w-full font-semibold'>
            {`Total: ${formatPrice(order.totalPrice)}`}
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
          <span>items per page</span>
        </div>
      </div>
    </div>
  );
}

export const OrderList: React.FC<OrderListProps> = ({ userId, accessToken, total }) => {
  const orderLists = Object.entries(OrderStatus).map(([value], index) => ({
    key: String(index + 1),
    label: value.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase()),
    children: <OrderItem
      key={`${value}-${userId}`}
      userId={userId}
      accessToken={accessToken}
      filter={value}
      {...(total ? { total: total } : {})}
    />,
  }));

  orderLists.unshift({
    key: '0',
    label: 'All',
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
      />
    </div>
  );
}
