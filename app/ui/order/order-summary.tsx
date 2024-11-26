'use client'

import { formatPrice } from '@/utils/helpers';
import { useOrder } from '@/app/context/OrderContext';
import DiscountPanel from './discount-panel';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function OrderSummary() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { order, setOrder } = useOrder();

    return (
        <div
            className='flex flex-col w-[390px] h-fit shadow-lg px-4 py-10 space-y-10 rounded-lg'
        >
            <h1>Order Summary</h1>
            <div className='space-y-4'>
                <div className='flex justify-between'>
                    <h4 className='font-semibold'>Product Cost:</h4>
                    <h4>{`${formatPrice(order.productPrice)}`}</h4>
                </div>

                <div className='flex justify-between'>
                    <h4 className='font-semibold'>Shipping:</h4>
                    <h4>{formatPrice(order.shipping)}</h4>
                </div>

                <div className='flex justify-between'>
                    <h4 className='font-semibold'>Discount:</h4>
                    <h4>{`-${formatPrice(order.discount)}`}</h4>
                </div>

                <DiscountPanel />

                <div className='w-full h-0.5 bg-gray-200' />

                <div className='flex justify-between'>
                    <h4 className='font-semibold'>Total Cost:</h4>
                    <h4>{formatPrice(order.totalPrice)}</h4>
                </div>
            </div>

            <div className='flex flex-col space-y-4'>
                <button
                    className='flex justify-center items-center text-xl font-semibold bg-gray-900 px-6 py-2 rounded-md text-white'
                >
                    <ShoppingCartIcon className='size-8 mr-3' />
                    Order
                </button>
            </div>
        </div>
    )
}
