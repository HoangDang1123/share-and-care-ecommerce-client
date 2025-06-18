'use client'

import { formatPrice } from '@/utils/helpers';
import { PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import SelectedColor from './option/selected-color';
import SelectedSize from './option/selected-size';
import SelectedQuantity from './option/selected-quantity';
import { ProductDetailResponse, SkuList } from '@/interface/product';
import { useAuth, useCart, useOrder } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { addProductToCart, getCart } from '@/app/api/cart';
import ClipLoader from 'react-spinners/ClipLoader';
import { CreateOrder } from '@/interface/order';
import { Rate } from 'antd';
import Image from 'next/image';

interface OptionContainerProps {
  product: ProductDetailResponse,
  setVariantImage: (selectedColorIndex: string) => void;
}

const OptionContainer: React.FC<OptionContainerProps> = ({ product, setVariantImage }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(-1);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number | null>(-1);
  const [quantity, setQuantity] = useState(1);
  const [quantityInStock, setQuantityInStock] = useState(0);
  const [skuItem, setSkuItem] = useState<SkuList | null>(null);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [loadingBuyNow, setLoadingBuyNow] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();
  const { isLogin } = useAuth();
  const { setCart } = useCart();
  const { setOrder, setProductPrice } = useOrder();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    if (selectedColorIndex !== null && selectedColorIndex !== -1) {
      const colorVariant = product.product.variants.find(variant => variant.name === "Màu sắc");

      if (colorVariant?.images?.[selectedColorIndex]) {
        setVariantImage(colorVariant.images[selectedColorIndex]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColorIndex])

  useEffect(() => {
    const hasVariants = product.product.variants.length > 0;
    const isColorOrSizeNotSelected = selectedColorIndex === -1 || selectedSizeIndex === -1;

    setDisabled((hasVariants && isColorOrSizeNotSelected) || loadingAddToCart || loadingBuyNow);
  }, [product.product.variants.length, selectedColorIndex, selectedSizeIndex, loadingAddToCart, loadingBuyNow]);

  useEffect(() => {
    let tierIndex: number[] | null = null;

    const colorIndex = selectedColorIndex;
    const sizeIndex = selectedSizeIndex;

    const variants = product.product.variants;
    const colorPosition = variants.findIndex(v => (v.name === "Màu sắc" || v.name === "Color"));
    const sizePosition = variants.findIndex(v => (v.name === "Kích thước" || v.name === "Size"));

    const hasColor = colorIndex !== null;
    const hasSize = sizeIndex !== null;
    const colorSelected = colorIndex !== -1;
    const sizeSelected = sizeIndex !== -1;

    if (hasColor && hasSize) {
      if (colorSelected && sizeSelected) {
        tierIndex = colorPosition < sizePosition
          ? [colorIndex, sizeIndex]
          : [sizeIndex, colorIndex];
      } else {
        tierIndex = null; // có cả 2 nhưng chưa chọn hết
      }
    } else if (hasColor && colorSelected) {
      tierIndex = [colorIndex];
    } else if (hasSize && sizeSelected) {
      tierIndex = [sizeIndex];
    }

    if (tierIndex) {
      const foundSkuItem = product.skuList.skuList.find(
        (item) => JSON.stringify(item.tierIndex) === JSON.stringify(tierIndex)
      );
      setSkuItem(foundSkuItem || null);
    } else {
      setSkuItem(null);
    }
  }, [selectedColorIndex, selectedSizeIndex, product]);

  useEffect(() => {
    if (skuItem) {
      setQuantityInStock(skuItem.quantity);
    } else {
      setQuantityInStock(product.product.quantity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColorIndex, selectedSizeIndex, skuItem]);

  const getDiscountPercentRange = () => {
    if (!product.product.hasDiscount || product.product.discountedPrice === null) return null;

    if (
      typeof product.product.price === 'object' &&
      typeof product.product.discountedPrice === 'object'
    ) {
      const { min: minPrice, max: maxPrice } = product.product.price;
      const { min: minDiscount, max: maxDiscount } = product.product.discountedPrice;

      const minPercent = Math.round(100 - (minDiscount / minPrice) * 100);
      const maxPercent = Math.round(100 - (maxDiscount / maxPrice) * 100);

      return minPercent === maxPercent
        ? `-${minPercent}%`
        : `-${minPercent}% đến -${maxPercent}%`;
    }

    if (
      typeof product.product.price === 'number' &&
      typeof product.product.discountedPrice === 'number'
    ) {
      const percent = Math.round(100 - (product.product.discountedPrice / product.product.price) * 100);
      return `-${percent}%`;
    }

    return null;
  };

  const getDisplayPrice = () => {
    if (product.product.hasDiscount && product.product.discountedPrice !== null) {
      if (typeof product.product.discountedPrice === 'number') return formatPrice(product.product.discountedPrice);
      if (typeof product.product.discountedPrice === 'object') return formatPrice(product.product.discountedPrice.min);
    }

    if (typeof product.product.price === 'number') return formatPrice(product.product.price);
    return formatPrice(product.product.price.min);
  };

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoadingAddToCart(true);
    if (!isLogin) {
      router.push("/auth/login");
      toast.warn("Vui lòng đăng nhập để tiếp tục");
    } else {
      if (userId !== "" && accessToken !== "") {
        const itemData = {
          productId: product.product.id,
          quantity: quantity,
          variantId: skuItem ? skuItem.id : undefined
        };

        try {
          await addProductToCart(itemData, userId, accessToken);
          toast.success("Thêm sản phẩm vào giỏ hàng thành công.");
          try {
            const response = await getCart(userId, accessToken);
            setCart(response);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) { }
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
      toast.warn("Vui lòng đăng nhập để tiếp tục");
    } else {
      if (userId !== "" && accessToken !== "") {
        const itemData = [{
          productId: product.product.id,
          quantity: quantity,
          variantId: skuItem ? skuItem.id : undefined,
        }];

        setOrder(prevOrder => {
          const currentOrder: CreateOrder = prevOrder || {
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

        if (skuItem) {
          setProductPrice(skuItem.price * quantity);
        } else if (product.skuList.skuList.length === 0
          && typeof (product.product.price) === 'number'
          && ((selectedColorIndex !== null && selectedColorIndex !== -1) || (selectedSizeIndex !== null && selectedSizeIndex !== -1))) {
          setProductPrice(product.product.price * quantity);
        } else {
          setProductPrice(0);
        }

        localStorage.setItem('productInCart', 'false');

        router.push("/order");
      }
    }
  }

  return (
    <div className='flex flex-col justify-between w-full sm:px-2 md:px-0 space-y-10'>
      <div className='flex flex-col w-full h-full space-y-10'>
        <div className='md:flex justify-between items-start sm:space-y-4 md:space-y-0'>
          <div className='sm:space-y-2 md:space-y-2'>
            <h1 className='sm:text-2xl md:text-4xl font-semibold'>{product.product.name}</h1>

            <h3 className='sm:text-sm md:text-lg font-medium'>{`Code: ${product.product.code}`}</h3>

            <div className='flex items-center px-2 py-1 gap-x-2'>
              <h3 className='text-lg mb-0.5'>{product.product.rating}</h3>
              <Rate
                disabled
                allowHalf
                className='text-yellow-500'
                style={{ fontSize: 16 }}
                defaultValue={product.product.rating}
              />
              <span>|</span>
              <h3 className='text-lg mb-0.5 font-medium'>{`${product.product.ratingCount} đánh giá`}</h3>
            </div>

            <div className="flex items-end space-x-3">
              {product.product.hasDiscount && (
                <>
                  <h2 className="sm:text-xl md:text-[2em] font-semibold text-red-500">
                    {getDisplayPrice()}
                  </h2>
                  <span className="line-through text-gray-500 sm:text-base md:text-xl">
                    {typeof product.product.price === 'number'
                      ? formatPrice(product.product.price)
                      : `${formatPrice(product.product.price.min)} - ${formatPrice(product.product.price.max)}`}
                  </span>
                  <div className="bg-red-500 text-white text-base font-semibold px-2 py-1 rounded-full">
                    {getDiscountPercentRange() || 'Giảm giá'}
                  </div>
                </>
              )}

              {!product.product.hasDiscount && (
                <h2 className="sm:text-xl md:text-[2em] font-semibold">
                  {typeof product.product.price === 'number'
                    ? formatPrice(product.product.price)
                    : `${formatPrice(product.product.price.min)} - ${formatPrice(product.product.price.max)}`}
                </h2>
              )}
            </div>
          </div>

          <Image
            src={product.product.qrCode}
            alt={product.product.qrCode}
            title={product.product.qrCode}
            width={1200}
            height={1200}
            className='flex place-items-end sm:size-full md:size-32 md:border-2 md:border-gray-400 rounded-lg'
          />
        </div>

        <SelectedColor product={product} selectedColorIndex={selectedColorIndex} setSelectedColorIndex={setSelectedColorIndex} />

        <SelectedSize product={product} selectedSizeIndex={selectedSizeIndex} setSelectedSizeIndex={setSelectedSizeIndex} />

        <SelectedQuantity
          product={product}
          quantityInStock={quantityInStock}
          quantity={quantity}
          setQuantity={setQuantity}
          selectedColorIndex={selectedColorIndex}
          selectedSizeIndex={selectedSizeIndex}
        />
      </div>

      <div className='grid grid-cols-2 gap-x-4'>
        <button
          onClick={handleAddToCart}
          disabled={disabled || quantityInStock === 0}
          className={`flex justify-center items-center h-12 sm:text-lg md:text-xl font-semibold bg-gray-300 rounded-full ${disabled || quantityInStock === 0 ? 'cursor-not-allowed' : ''}`}
        >
          {loadingAddToCart ? (
            <ClipLoader size={20} color='#000000' aria-label="Loading Spinner" />
          ) : (
            <span className='flex'>
              <PlusIcon className='size-7 mr-3' />
              Thêm vào giỏ hàng
            </span>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={disabled || quantityInStock === 0}
          className={`flex justify-center items-center h-12 sm:text-lg md:text-xl font-semibold bg-gray-900 text-white rounded-full ${disabled || quantityInStock === 0 ? 'cursor-not-allowed' : ''}`}
        >
          {loadingBuyNow ? (
            <ClipLoader size={20} color='#ffffff' aria-label="Loading Spinner" />
          ) : (
            <span className='flex'>
              <ShoppingCartIcon className='size-7 mr-3' />
              Mua ngay
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default OptionContainer;