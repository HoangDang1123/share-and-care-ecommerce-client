'use client'

import { formatPrice } from '@/utils/helpers';
import { PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import SelectedColor from './option/selected-color';
import SelectedSize from './option/selected-size';
import SelectedQuantity from './option/selected-quantity';
import { ProductDetailDataResponse } from '@/interface/product';
import { useAuth, useOrder } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { addProductToCart } from '@/app/api/cart';
import ClipLoader from 'react-spinners/ClipLoader';
import { OrderData } from '@/interface/order';

interface OptionContainerProps {
  product: ProductDetailDataResponse,
}

const OptionContainer: React.FC<OptionContainerProps> = ({ product }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [loadingBuyNow, setLoadingBuyNow] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const { isLogin } = useAuth();
  const router = useRouter();
  const { setOrder, setProductPrice } = useOrder();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const hasVariants = product.product.variants.length > 0;
    const isColorOrSizeNotSelected = selectedColorIndex === null || selectedSizeIndex === null;

    setDisabled((hasVariants && isColorOrSizeNotSelected) || loadingAddToCart || loadingBuyNow);
  }, [product.product.variants.length, selectedColorIndex, selectedSizeIndex, loadingAddToCart, loadingBuyNow]);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoadingAddToCart(true);
    if (!isLogin) {
      router.push("/auth/login");
      toast.warn("Please login to continue !");
    } else {
      const tierIndex = [selectedColorIndex, selectedSizeIndex];
      const skuItem = product.skuList.skuList.find(item => JSON.stringify(item.tierIndex) === JSON.stringify(tierIndex));

      if (userId !== "" && accessToken !== "") {
        const itemData = {
          productId: product.product.id,
          quantity: quantity,
          variantId: skuItem ? skuItem.id : null
        };

        try {
          await addProductToCart(itemData, userId, accessToken);
          toast.success("Add product to cart successful.");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { } finally {
          setLoadingAddToCart(false);
        }
      }
    }
  }

  const handleBuyNow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoadingBuyNow(true);
    if (!isLogin) {
      router.push("/auth/login");
      toast.warn("Please login to continue !");
    } else {
      const tierIndex = [selectedColorIndex, selectedSizeIndex];
      const skuItem = product.skuList.skuList.find(item => JSON.stringify(item.tierIndex) === JSON.stringify(tierIndex));

      if (userId !== "" && accessToken !== "") {
        const itemData = [{
          productId: product.product.id,
          quantity: quantity,
          variantId: skuItem ? skuItem.id : null
        }];

        setOrder(prevOrder => {
          const currentOrder: OrderData = prevOrder || {
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

        setProductPrice(skuItem ? skuItem.price : 0);

        router.push("/order");
      }
    }
  }

  return (
    <div className='flex flex-col w-full space-y-24'>
      <div className='flex flex-col w-full h-full space-y-6'>
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
          className={`flex justify-center items-center w-[200px] h-14 text-xl font-semibold bg-gray-300 rounded-md ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          {loadingAddToCart ? (
            <ClipLoader size={20} color='#000000' aria-label="Loading Spinner" />
          ) : (
            <span className='flex'>
              <PlusIcon className='size-7 mr-3' />
              Add To Cart
            </span>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={disabled}
          className={`flex justify-center items-center w-[180px] h-14 text-xl font-semibold bg-gray-900 text-white rounded-md ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          {loadingBuyNow ? (
            <ClipLoader size={20} color='#ffffff' aria-label="Loading Spinner" />
          ) : (
            <span className='flex'>
              <ShoppingCartIcon className='size-7 mr-3' />
              Buy Now
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default OptionContainer;