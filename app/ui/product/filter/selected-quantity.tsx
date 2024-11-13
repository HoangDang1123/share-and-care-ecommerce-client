import { Product } from '@/data/interface';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import React from 'react'

interface SelectedQuantityProps {
    product: Product,
    quantity: number,
    setQuantity: React.Dispatch<React.SetStateAction<number>>,
    selectedColorIndex: number | null,
    selectedSizeIndex: number | null,
}

const SelectedQuantity: React.FC<SelectedQuantityProps> = ({ product, quantity, setQuantity, selectedColorIndex, selectedSizeIndex }) => {
    const decQuantity = () => {
        setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
    }

    const incQuantity = () => {
        setQuantity(prevQuantity => Math.min(prevQuantity + 1, product.stock));
    }

    return (
        <div className='flex items-center space-x-4'>
            <h6 className='text-2xl font-semibold'>Quantity</h6>
            <div className='flex items-center justify-between space-x-2 rounded-md'>
                <button
                    onClick={decQuantity}
                    className={`flex justify-center items-center px-1 py-1 h-full rounded-md border-solid border border-gray-900 ${selectedColorIndex === null || selectedSizeIndex === null ? 'cursor-not-allowed' : ''}`}
                    disabled={selectedColorIndex === null || selectedSizeIndex === null}
                >
                    <MinusIcon className='size-6' />
                </button>

                <h6
                    className="w-20 text-center border-solid border border-gray-900 rounded-md text-2xl"
                >
                    {quantity}
                </h6>

                <button
                    onClick={incQuantity}
                    className={`flex justify-center items-center px-1 py-1 h-full rounded-md border-solid border border-gray-900 ${selectedColorIndex === null || selectedSizeIndex === null ? 'cursor-not-allowed' : ''}`}
                    disabled={selectedColorIndex === null || selectedSizeIndex === null}
                >
                    <PlusIcon className='size-6' />
                </button>
            </div>
            <h6 className='text-2xl'>{`( ${product.stock} left )`}</h6>
        </div>
    )
}

export default SelectedQuantity;