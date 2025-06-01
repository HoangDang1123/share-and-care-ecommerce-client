import { OrderDetailItem } from '@/interface/order'
import Image from 'next/image'
import React from 'react'
import { formatPrice } from '@/utils/helpers';

interface OrderItemProps {
  item: OrderDetailItem,
}

export const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
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
          className='object-cover w-24'
        />
        <div className='flex flex-col justify-between'>
          <div className='flex flex-col'>
            <span>{item.productName}</span>
            <span>{`Quantity: ${item.quantity}`}</span>
          </div>
          <span>{`Slug: ${item.variantSlug}`}</span>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <span className="font-semibold">{`Price: ${formatPrice(item.price)}`}</span>
        <span
          className={`inline-block text-sm font-medium px-3 py-1 rounded-lg w-fit ${item.canReturn
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-amber-50 text-amber-700'
            }`}
        >
          {item.canReturn ? '7-Day Return' : 'Not Returnable'}
        </span>
      </div>
    </div>
  )
}
