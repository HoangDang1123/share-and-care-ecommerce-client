'use client'

import { formatPrice } from '@/utils/helpers';
import { PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import SelectedColor from './option/selected-color';
import SelectedSize from './option/selected-size';
import SelectedQuantity from './option/selected-quantity';
import { ProductDetailDataResponse } from '@/interface/product';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { addProductToCart } from '@/app/api/cart';
import ClipLoader from 'react-spinners/ClipLoader';

interface OptionContainerProps {
  product: ProductDetailDataResponse,
}

const OptionContainer: React.FC<OptionContainerProps> = ({ product }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const { isLogin } = useAuth();
  const router = useRouter();

  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const hasVariants = product.product.variants.length > 0;
    const isColorOrSizeNotSelected = selectedColorIndex === null || selectedSizeIndex === null;

    setDisabled((hasVariants && isColorOrSizeNotSelected) || loading);
  }, [product.product.variants.length, selectedColorIndex, selectedSizeIndex, loading, setDisabled]);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!isLogin) {
      router.push("/auth/login");
      toast.warn("Please login to continue !");
    } else {
      const tierIndex = [selectedColorIndex, selectedSizeIndex];
      const skuItem = product.skuList.skuList.find(item => JSON.stringify(item.tierIndex) === JSON.stringify(tierIndex));

      if (userId !== null && accessToken !== null) {
        const itemData = {
          productId: product.product.id,
          quantity: quantity,
          ...(skuItem && { variantId: skuItem.id })
        };

        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const response = await addProductToCart(itemData, userId, accessToken);
          toast.success("Add product to cart successful.");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { } finally {
          setLoading(false);
        }
      }
    }
  }

  return (
    <div className='flex flex-col w-full space-y-24'>
      <div className='flex flex-col w-full space-y-12'>
        <div className='space-y-2'>
          <h3 className='font-semibold'>{product.product.name}</h3>
          <h6 className='text-lg'>{`ID: ${product.product.id}`}</h6>
          <div className='flex items-end space-x-5'>
            <h1 className='font-semibold'>{formatPrice(product.product.price)}</h1>
            <h6 className='text-xl mb-2 line-through'>{formatPrice(product.product.originalPrice)}</h6>
          </div>
        </div>

        <SelectedColor product={product.product} selectedColorIndex={selectedColorIndex} setSelectedColorIndex={setSelectedColorIndex} />

        <SelectedSize product={product.product} selectedSizeIndex={selectedSizeIndex} setSelectedSizeIndex={setSelectedSizeIndex} />

        <SelectedQuantity
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          selectedColorIndex={selectedColorIndex}
          selectedSizeIndex={selectedSizeIndex}
        />
      </div>

      <div className='flex space-x-6'>
        <button
          onClick={handleAddToCart}
          disabled={disabled}
          className={`flex justify-center items-center w-[200px] text-xl font-semibold bg-gray-300 px-6 py-2 rounded-md ${disabled ? 'cursor-not-allowed' : ''}`}
        >{loading ? (
          <ClipLoader
            size={20}
            color='#000000'
            aria-label="Loading Spinner"
          />
        ) : (

          <span className='flex'>
            <PlusIcon className='size-7 mr-3' />
            Add To Cart
          </span>
        )}
        </button>

        <button
          className={`flex justify-center items-center text-xl font-semibold bg-gray-900 px-6 py-2 rounded-md text-white ${disabled ? 'cursor-not-allowed' : ''}`}
          disabled={disabled}
        >
          <ShoppingCartIcon className='size-8 mr-3' />
          Buy Now
        </button>
      </div>
    </div>
  )
}

export default OptionContainer;