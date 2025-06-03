'use client'

import { OrderDetailItem } from '@/interface/order'
import Image from 'next/image'
import React from 'react'
import { formatPrice } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

interface OrderItemProps {
  item: OrderDetailItem,
  orderId: string,
}

export const OrderItem: React.FC<OrderItemProps> = ({ item, orderId }) => {
  const router = useRouter();

  return (
    <div
      className='flex justify-between border-t-2 border-b-2 py-4'
    >
      <div className='flex gap-x-4'>
        <Image
          src={item.image}
          alt={item.productName}
          width={500}
          height={500}
          className='object-cover w-28'
        />
        <div className='flex flex-col justify-between'>
          <div className='flex flex-col'>
            <span className='text-base'>{item.productName}</span>
            <span className='text-base'>{`Slug: ${item.variantSlug}`}</span>
          </div>

          <span className='text-base'>{`Quantity: ${item.quantity}`}</span>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <span className="font-semibold text-base">{`Price: ${formatPrice(item.price)}`}</span>

        <div className='flex flex-col items-end gap-y-2'>
          <span
            className={`inline-block text-sm font-medium px-3 py-1 rounded-lg w-fit ${item.canReturn
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
              }`}
          >
            {item.canReturn ? `${item.returnDays}-Day Return` : 'Not Returnable'}
          </span>

          <div className='flex gap-x-2'>
            <button
              onClick={() => {
                router.push(`/review/${orderId}-${item.productId}-${item.variantId}`)
              }}
              disabled={!item.canReview}
              className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300'
            >
              Review
            </button>

            <button
              disabled={!item.canReturn}
              className={`inline-block text-sm font-medium px-3 py-1 text-white rounded-lg w-fit ${item.canReturn
                ? 'bg-gray-800 hover:bg-gray-900'
                : 'bg-gray-300'
                }`}
            >
              Request Return
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
