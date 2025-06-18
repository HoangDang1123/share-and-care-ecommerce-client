import { ProductResponse } from '@/interface/product';
import { formatPrice } from '@/utils/helpers';
import { StarIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface CardProps {
  product: ProductResponse;
}

const Card: React.FC<CardProps> = ({ product }) => {
  const router = useRouter();

  const getDiscountPercentRange = () => {
    if (!product.hasDiscount || product.discountedPrice === null) return null;

    if (
      typeof product.price === 'object' &&
      typeof product.discountedPrice === 'object'
    ) {
      const { min: minPrice, max: maxPrice } = product.price;
      const { min: minDiscount, max: maxDiscount } = product.discountedPrice;

      const minPercent = Math.round(100 - (minDiscount / minPrice) * 100);
      const maxPercent = Math.round(100 - (maxDiscount / maxPrice) * 100);

      return minPercent === maxPercent
        ? `-${minPercent}%`
        : `-${minPercent}% đến -${maxPercent}%`;
    }

    if (
      typeof product.price === 'number' &&
      typeof product.discountedPrice === 'number'
    ) {
      const percent = Math.round(100 - (product.discountedPrice / product.price) * 100);
      return `-${percent}%`;
    }

    return null;
  };

  const getDisplayPrice = () => {
    if (product.hasDiscount && product.discountedPrice !== null) {
      if (typeof product.discountedPrice === 'number') {
        return {
          original: formatPrice(product.price as number),
          discounted: formatPrice(product.discountedPrice),
        };
      }

      if (typeof product.discountedPrice === 'object') {
        return {
          original: formatPrice((product.price as { min: number }).min),
          discounted: formatPrice(product.discountedPrice.min),
        };
      }
    }

    if (typeof product.price === 'number') {
      return {
        original: formatPrice(product.price),
        discounted: null,
      };
    }

    return {
      original: formatPrice(product.price.min),
      discounted: null,
    };
  };


  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none">
      <button onClick={() => router.push(`/product/${product.code}`)}>
        <div className="relative w-fit">
          <Image
            alt={product.name}
            title={product.name}
            src={product.mainImage}
            priority
            width={270}
            height={360}
            style={{ borderRadius: "10px" }}
            className="object-cover w-auto h-auto block transition ease-in-out hover:scale-110 duration-300 mb-4"
          />

          {product.hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white sm:text-xs md:text-base font-semibold px-2 py-1 rounded-full z-10">
              {getDiscountPercentRange() || 'Giảm giá'}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between sm:h-28 md:h-36">
          <h1 className="md:my-2 sm:text-base md:text-2xl">{product.name}</h1>

          <div className="flex justify-between items-center">
            {(() => {
              const price = getDisplayPrice();

              return price.discounted ? (
                <div className="flex sm:flex-col md:flex-row md:gap-2">
                  <span className="text-red-500 font-semibold sm:text-sm md:text-2xl">
                    {price.discounted}
                  </span>
                  <span className="line-through text-gray-500 text-xs md:text-base">
                    {price.original}
                  </span>
                </div>
              ) : (
                <span className="font-semibold sm:text-base md:text-2xl">
                  {price.original}
                </span>
              );
            })()}

            <div className="flex items-center">
              <h2 className="md:mt-1 sm:text-base md:text-2xl">{product.rating}</h2>
              <StarIcon className="sm:size-4 md:size-7 mt-1 text-yellow-500" />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default Card;
