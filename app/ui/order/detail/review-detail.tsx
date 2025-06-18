'use client'

import { getReviewDetail } from '@/app/api/review';
import { ReviewDetailResponse } from '@/interface/review';
import { convertDateTime } from '@/utils/helpers';
import { ArrowUturnDownIcon } from '@heroicons/react/24/outline';
import { Rate } from 'antd';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

interface ReviewCardProps {
  orderId: string,
  productId: string,
  variantId: string | null,
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ orderId, productId, variantId }) => {
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [reviewDetail, setReviewDetail] = useState<ReviewDetailResponse>();

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    setAccessToken(localStorage.getItem('accessToken') || '');
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (userId && accessToken) {
        try {
          const response = variantId
            ? await getReviewDetail(orderId, productId, userId, accessToken, variantId)
            : await getReviewDetail(orderId, productId, userId, accessToken);

          setReviewDetail(response);
        } catch (error) {
          console.error("Error fetching review:", error);
        }
      }
    };

    fetchOrder();
  }, [accessToken, userId, orderId, productId, variantId]);

  if (!reviewDetail) {
    return (
      <div>Đang tải...</div>
    )
  }

  return (
    <div className="w-full mx-auto bg-gray-100 border-2 rounded-xl shadow-sm p-6 mt-4 flex flex-col gap-y-4">
      <div className="flex justify-between items-center">
        <Rate disabled defaultValue={reviewDetail.review.star} />
        <span className="text-sm text-muted-foreground">
          {convertDateTime(reviewDetail.review.createdAt)}
        </span>
      </div>

      <p className="text-base text-foreground">{reviewDetail.review.content}</p>

      {reviewDetail.review.images.length > 0 && (
        <div className="flex gap-4 flex-wrap">
          {reviewDetail.review.images.map((img, index) => (
            <div key={index} className="w-24 h-24 relative">
              <Image
                src={img}
                alt={`Review image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      {reviewDetail.review.reply && (
        <div className='flex flex-col p-4 bg-gray-100 rounded-lg mt-4 ml-12'>
          <div className='flex items-center gap-x-2'>
            <ArrowUturnDownIcon className='size-5 -rotate-90 mr-2' />
            <Image
              src={reviewDetail.review.reply.user.avatar}
              alt={reviewDetail.review.reply.user.avatar}
              width={100}
              height={100}
              className='w-6 h-6 rounded-full'
            />
            <span className='font-semibold text-base'>{reviewDetail.review.reply.user.name}</span>
          </div>

          <p className='text-sm leading-8 text-justify mt-2 ml-16'>{reviewDetail.review.reply.content}</p>
        </div>
      )}
    </div>
  );
}
