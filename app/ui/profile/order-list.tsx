'use client'

import React, { useState, useEffect } from 'react';
import { getAllOrder } from "../../api/order";
import { AllOrderResponse, OrderStatus, PaymentStatus } from "@/interface/order";
import { Tabs } from 'antd';
import Link from 'next/link';
import { convertDateTime, formatPrice } from '@/utils/helpers';
import Image from 'next/image';

interface OrderListProps {
  userId: string,
  accessToken: string,
}

interface OrderItemProps {
  order: AllOrderResponse,
  filter?: string | undefined,
}

const OrderItem: React.FC<OrderItemProps> = ({ order, filter }) => {
  const statusBadge: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-gray-200 text-gray-800',
    [OrderStatus.AWAITING_PAYMENT]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
    [OrderStatus.AWAITING_SHIPMENT]: 'bg-indigo-100 text-indigo-800',
    [OrderStatus.SHIPPED]: 'bg-sky-100 text-sky-800',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [OrderStatus.RETURN_REQUESTED]: 'bg-orange-100 text-orange-800',
    [OrderStatus.RETURNED]: 'bg-orange-200 text-orange-900',
    [OrderStatus.PENDING_REFUND]: 'bg-purple-100 text-purple-800',
    [OrderStatus.REFUNDED]: 'bg-emerald-100 text-emerald-800',
  };

  const paymentStatusBadge: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'bg-gray-200 text-gray-800',
    [PaymentStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [PaymentStatus.FAILED]: 'bg-red-100 text-red-800',
    [PaymentStatus.PENDING_REFUND]: 'bg-yellow-100 text-yellow-800',
    [PaymentStatus.REFUNDED]: 'bg-blue-100 text-blue-800',
  };

  if (!filter) {
    return (
      <div className='flex flex-col gap-y-6'>
        {order.items.map((order) => (
          <Link
            key={order.id}
            href={`/order/${order.id}`}
            className='flex flex-col border-2 p-6 gap-y-4 rounded-md hover:text-gray-900'
          >
            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <span className='font-semibold mb-2'>{`ID: ${order.id}`}</span>
                <span>{`Order Date: ${convertDateTime(order.createdAt)}`}</span>
                <span>{`Delivery Method: ${order.deliveryMethod}`}</span>
              </div>
              <span className={`font-semibold h-fit px-3 py-1 rounded-lg ${statusBadge[order.status]}`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            {order.items.map((childItem, index) => (
              <div
                key={index}
                className='flex gap-x-4 border-t-2 border-b-2 py-4'
              >
                <Image
                  src={childItem.image}
                  alt={childItem.productName}
                  width={500}
                  height={500}
                  className='object-cover w-24'
                />
                <div className='flex flex-col'>
                  <span>{childItem.productName}</span>
                  <span>{`Quantity: ${childItem.quantity}`}</span>
                </div>
              </div>
            ))}

            <div className='flex justify-between'>
              <div className='flex flex-col gap-y-2'>
                <span>{`Payment Method: ${order.paymentMethod}`}</span>
                <span className={`font-semibold w-fit h-fit px-3 py-1 rounded-lg ${paymentStatusBadge[order.paymentStatus]}`}>
                  {order.paymentStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <span className='font-semibold'>{`Total: ${formatPrice(order.totalPrice)}`}</span>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-y-6'>
      {order.items.filter(o => o.status === filter).map((order) => (
        <Link
          key={order.id}
          href={`/order/${order.id}`}
          className='flex flex-col border-2 p-6 gap-y-4 rounded-md hover:text-gray-900'
        >
          <div className='flex justify-between'>
            <div className='flex flex-col'>
              <span className='font-semibold mb-2'>{`ID: ${order.id}`}</span>
              <span>{`Order Date: ${convertDateTime(order.createdAt)}`}</span>
              <span>{`Delivery Method: ${order.deliveryMethod}`}</span>
            </div>
          </div>

          {order.items.map((childItem, index) => (
            <div
              key={index}
              className='flex gap-x-4 border-t-2 border-b-2 py-4'
            >
              <Image
                src={childItem.image}
                alt={childItem.productName}
                width={500}
                height={500}
                className='object-cover w-24'
              />
              <div className='flex flex-col'>
                <span>{childItem.productName}</span>
                <span>{`Quantity: ${childItem.quantity}`}</span>
              </div>
            </div>
          ))}

          <div className='flex justify-between'>
            <div className='flex flex-col gap-y-2'>
              <span>{`Payment Method: ${order.paymentMethod}`}</span>
              <span className={`font-semibold w-fit h-fit px-3 py-1 rounded-lg ${paymentStatusBadge[order.paymentStatus]}`}>
                {order.paymentStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <span className='font-semibold'>{`Total: ${formatPrice(order.totalPrice)}`}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export const OrderList: React.FC<OrderListProps> = ({ userId, accessToken }) => {
  const [order, setOrder] = useState<AllOrderResponse>();

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await getAllOrder(userId, accessToken);
      setOrder(response);
    }

    fetchOrder();
  }, [accessToken, userId]);

  if (!order) {
    return <span>Loading...</span>
  } else if (order.items.length === 0) {
    return <span>There&apos;s no order.</span>
  }

  const orderLists = Object.entries(OrderStatus).map(([value], index) => ({
    key: String(index + 1),
    label: value.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase()),
    children: <OrderItem order={order} filter={value} />,
  }));

  orderLists.unshift({
    key: '0',
    label: 'All',
    children: <OrderItem order={order} />,
  });

  return (
    <div>
      <Tabs
        items={orderLists}
        size='large'
        defaultActiveKey='0'
        tabBarStyle={{ backgroundColor: "#e5e7eb", borderRadius: "5px", padding: "0 20px" }}
      />
    </div>
  );
}
