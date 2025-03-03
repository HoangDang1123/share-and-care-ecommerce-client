'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ImageList from '@/app/ui/product/image-list';
import OptionContainer from '@/app/ui/product/option-container';
import Detail from '@/app/ui/product/detail';
import Description from '@/app/ui/product/description';
// import FeedbackContainer from '@/app/ui/product/feedback-container';
import BackButton from '@/app/ui/back-button';
import { useParams } from 'next/navigation';
import { ProductDetailDataResponse } from '@/interface/product';
import { getProductDetail } from '@/app/api/product';

export default function Page() {
  const [product, setProduct] = useState<ProductDetailDataResponse>();
  const [images, setImages] = useState<Array<string>>([]);
  const [variantImage, setVariantImage] = useState<string>("");
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
    <div className='md:px-12 lg:px-24 sm:my-5 md:my-10'>
      <div className='flex items-center sm:px-6 md:px-0 sm:space-x-8 md:space-x-24'>
        <BackButton previousPathname="/" />

        <ul className="flex space-x-1 sm:text-md md:text-xl whitespace-nowrap text-ellipsis">
          <li>
            <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
          </li>
          <li>
            {product.product.name}
          </li>
        </ul>
      </div>

      <div className='flex flex-col w-full md:px-22 xl:px-44 sm:space-y-10 xl:space-y-20'>
        <div className='flex sm:flex-col md:flex-row w-full md:space-x-5 sm:space-y-5 md:space-y-0 my-5'>
          <ImageList images={images} variantImage={variantImage} />
          <OptionContainer product={product} setVariantImage={setVariantImage} />
        </div>

        <div className='flex flex-col sm:px-6 md:px-0 space-y-10'>
          <Detail category={product.product.category} quantity={product.product.quantity} attributes={product.product.attributes} />
          <Description description={product.product.description} />
        </div>

        {/* <div className='w-full'>
          <FeedbackContainer product={product} />
        </div> */}
      </div>
    </div>
  );
}