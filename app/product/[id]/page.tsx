import React from 'react';
import data from "@/data/data.json";
import Link from 'next/link';
import ImageList from '@/app/ui/product/image-list';
import InforContainer from '@/app/ui/product/filter-container';
import { ArrowTurnDownLeftIcon } from '@heroicons/react/24/outline';
import Detail from '@/app/ui/product/detail';
import Description from '@/app/ui/product/description';
import FeedbackContainer from '@/app/ui/product/feedback-container';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id;

  const product = data.products.find(item => item.id === id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className='px-24 py-10'>
      <div className='flex items-center space-x-24'>
        <Link
          href="/"
          passHref
          className='hover:bg-gray-300 hover:rounded-md px-1 py-1'
        >
          <ArrowTurnDownLeftIcon className='size-8' />
        </Link>

        <ul className="flex space-x-1 text-xl">
          <li>
            <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
          </li>
          <li>
            <Link href="#" className='text-gray-400 hover:text-gray-900'>{`${product.category} /`}</Link>
          </li>
          <li>
            {product.name}
          </li>
        </ul>
      </div>

      <div className='flex flex-col w-full px-44 space-y-20'>
        <div className='flex w-full space-x-5 my-5'>
          <ImageList images={product.image} />
          <InforContainer product={product} />
        </div>

        <div className='flex flex-col space-y-10'>
          <Detail category={product.category} stock={product.stock} origin={product.origin} />
          <Description description={product.description} />
        </div>

        <div className='w-full'>
          <FeedbackContainer product={product} />
        </div>
      </div>
    </div>
  );
}