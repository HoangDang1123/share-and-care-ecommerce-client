'use client'

import React, { useCallback, useEffect, useState } from 'react';
import Card from '../card';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { CategoryResponse } from '@/interface/category';
import { getTopCategoriesProduct } from '@/app/api/product';
import { ProductResponse } from '@/interface/product';
import { ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { getCategoryBanner } from '@/app/api/banner';
import { BannerItem } from '@/interface/banner';
import { useRouter } from 'next/navigation';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1441 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 1440, min: 1281 },
    items: 5
  },
  laptop: {
    breakpoint: { max: 1280, min: 769 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 768, min: 481 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 480, min: 0 },
    items: 2
  }
}

interface TopProductProps {
  category: CategoryResponse
}

const TopProduct: React.FC<TopProductProps> = ({ category }) => {
  const [topProduct, setTopProduct] = useState<ProductResponse[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);

  const router = useRouter();

  const showNextBanner = useCallback(() => {
    setBannerIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }, [banners.length])

  const showPrevBanner = useCallback(() => {
    setBannerIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }, [banners.length])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, bannerRes] = await Promise.all([
          getTopCategoriesProduct(category.id),
          getCategoryBanner(category.id)
        ])
        setTopProduct(productsRes.items)
        setBanners(bannerRes.items || [])
      } catch (error) {
        console.error('Error fetching category data:', error)
      }
    }

    fetchData()
  }, [category])

  return (
    <div className="md:mt-8 px-4 md:px-20">
      {/* Banner */}
      {banners.length > 0 && (
        <div className="relative w-full h-[200px] md:h-[600px] rounded-xl overflow-hidden mb-4">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = banner.ctaUrl;
              }}
              className={`absolute inset-0 transition-opacity duration-700 ${index === bannerIndex ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'}`}
            >
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                title={banner.title}
                width={1920}
                height={790}
                className="object-cover rounded-xl h-full"
                priority={index === 0}
              />
            </button>
          ))}

          {banners.length > 1 && (
            <>
              <button
                onClick={showPrevBanner}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white p-1.5 rounded-full"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <button
                onClick={showNextBanner}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white p-1.5 rounded-full"
              >
                <ChevronRightIcon className="size-5" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setBannerIndex(index)}
                    className={`w-2 h-2 rounded-full ${index === bannerIndex ? 'bg-gray-800' : 'bg-white border'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Title */}
      <div className="flex justify-between items-center md:mb-2">
        <span className="sm:text-xl md:text-3xl font-semibold">
          {category.name.toUpperCase()}
        </span>
        <button
          onClick={() => router.push(`/shop?category=${category.id}`)}
          className="flex justify-center items-center sm:space-x-1 md:space-x-2 bg-gray-700 text-white sm:text-sm md:text-base xl:text-lg h-fit sm:px-3 md:px-4 py-1 rounded-full hover:bg-gray-800"
        >
          <span>Xem tất cả</span>
          <ChevronDoubleRightIcon className="size-4" />
        </button>
      </div>

      {/* Products */}
      {topProduct.length === 0 ? (
        <div className="w-88vw h-[360px] flex justify-center items-center bg-gray-200 t rounded-xl">
          Chưa có sản phẩm.
        </div>
      ) : (
        <Carousel
          ssr
          responsive={responsive}
          swipeable
          draggable
          infinite
          containerClass="w-88vw py-5"
          itemClass="px-5"
        >
          {topProduct.map((item, index) => (
            <Card key={index} product={item} />
          ))}
        </Carousel>
      )}
    </div>
  )
}

export default TopProduct
