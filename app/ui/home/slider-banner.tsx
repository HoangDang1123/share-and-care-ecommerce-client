'use client'

import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getBanner } from "@/app/api/banner";

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl: string;
}

export interface BannerResponse {
  total: number;
  totalPages: number;
  page: number;
  size: number;
  hasMore: boolean;
  items: BannerItem[];
}

export function SliderBanner() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const router = useRouter();

  const fetchBanners = async () => {
    try {
      const data = await getBanner('SLIDE');
      setBanners(data.items);
    } catch (err) {
      console.error("Error fetching banners:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const showNextImage = useCallback(() => {
    setImageIndex((index) => (index === banners.length - 1 ? 0 : index + 1));
  }, [banners.length]);

  const showPrevImage = useCallback(() => {
    setImageIndex((index) => (index === 0 ? banners.length - 1 : index - 1));
  }, [banners.length]);

  useEffect(() => {
    const interval = setInterval(showNextImage, 5000);
    return () => clearInterval(interval);
  }, [showNextImage]);

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full h-full" aria-label="Slider">
      <div className="flex w-full h-full overflow-hidden">
        {banners.map(({ imageUrl, title, ctaUrl }, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex-grow-0 transition-transform duration-300 cursor-pointer"
            style={{ transform: `translateX(${-100 * imageIndex}%)` }}
            onClick={() => router.push(ctaUrl)}
          >
            <Image
              src={imageUrl}
              alt={title}
              title={title}
              width={1920}
              height={960}
              className="object-cover w-auto h-auto block"
              priority
            />
          </div>
        ))}
      </div>

      <button
        onClick={showPrevImage}
        className="absolute top-0 bottom-0 left-0 sm:p-1 md:p-1.5 xl:p-2 cursor-pointer rounded-lg hover:bg-gray-700 hover:bg-opacity-20"
        aria-label="View Previous Image"
      >
        <ChevronLeftIcon className="sm:size-4 md:size-6 xl:size-8" />
      </button>

      <button
        onClick={showNextImage}
        className="absolute top-0 bottom-0 right-0 sm:p-1 md:p-1.5 xl:p-2 cursor-pointer rounded-lg hover:bg-gray-700 hover:bg-opacity-20"
        aria-label="View Next Image"
      >
        <ChevronRightIcon className="sm:size-4 md:size-6 xl:size-8" />
      </button>

      <div className="absolute sm:bottom-2 md:bottom-5 sm:-right-5 md:right-5 transform -translate-x-1/2 flex gap-1">
        {banners.map((_, index) => (
          <button
            key={index}
            className="flex items-center justify-center cursor-pointer sm:p-1 md:p-1.5 transition-transform duration-100"
            aria-label={`View Image ${index + 1}`}
            onClick={() => setImageIndex(index)}
          >
            <div
              className={`rounded-full ${
                index === imageIndex
                  ? "bg-gray-700"
                  : "bg-white border border-gray-300"
              } sm:w-1.5 md:w-2.5 xl:w-3 sm:h-1.5 md:h-2.5 xl:h-3`}
              aria-hidden
            />
          </button>
        ))}
      </div>
    </section>
  );
}
