'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ImageList from '@/app/ui/product/image-list';
import OptionContainer from '@/app/ui/product/option-container';
// import FeedbackContainer from '@/app/ui/product/feedback-container';
import BackButton from '@/app/ui/back-button';
import { useParams } from 'next/navigation';
import { ProductDetailResponse } from '@/interface/product';
import { getProductDetail } from '@/app/api/product';
import Description from '@/app/ui/product/description';
import Detail from '@/app/ui/product/detail';

export default function Page() {
  const [product, setProduct] = useState<ProductDetailResponse>();
  const [images, setImages] = useState<string[]>([]);
  const [variantImage, setVariantImage] = useState<string>('');
  const param = useParams();
  const id = param.id;

  useEffect(() => {
    const fetchProducts = async () => {
      if (typeof id !== 'string') {
        return;
      }
      try {
        const response = await getProductDetail(id);
        setProduct(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [id, setProduct]);

  useEffect(() => {
    if (product) {
      setImages([product.product.mainImage, ...product.product.subImages]);
    }
  }, [product, setImages]);

  if (!product) {
    return <div className='flex justify-center items-center w-full h-[720px] text-lg'>
      Product not found
    </div>;
  }

  return (
    <div className='md:px-12 lg:px-24 sm:my-5 md:my-20'>
      <div className='flex items-center sm:px-6 md:px-0 sm:space-x-8 md:space-x-24'>
        <BackButton />

        <ul className="flex space-x-1 sm:text-md md:text-xl whitespace-nowrap text-ellipsis">
          <li>
            <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
          </li>
          <li>
            {product.product.name}
          </li>
        </ul>
      </div>

      <div className='flex flex-col w-full md:px-22 xl:px-44 sm:gap-y-10 xl:gap-y-20'>
        <div className='flex sm:flex-col md:flex-row w-full md:gap-x-5 sm:gap-y-5 md:gap-y-0 my-5'>
          <ImageList images={images} video={product.product.video} variantImage={variantImage} />
          <OptionContainer product={product} setVariantImage={setVariantImage} />
        </div>

        <div className='flex flex-col gap-y-10'>
          <Detail
            categories={product.product.category}
            attributes={[...product.product.attributes, ...product.product.variantAttributes]}
          />
          <Description description={product.product.description} />
        </div>

        {/* <div className='w-full'>
          <FeedbackContainer product={product} />
        </div> */}
      </div>
    </div>
  );
}