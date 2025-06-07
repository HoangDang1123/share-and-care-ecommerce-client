'use client'

import { getReviewDetail } from '@/app/api/review';
import { ReviewDetailResponse } from '@/interface/review';
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
      if (userId !== "" && accessToken !== "") {
        try {
          const response = await getReviewDetail(orderId, productId, variantId, userId, accessToken);
          setReviewDetail(response);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchOrder();
  }, [accessToken, userId, orderId, productId, variantId]);

  if (!reviewDetail) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="w-full mx-auto bg-gray-100 border-2 rounded-xl shadow-sm p-6 mt-4 flex flex-col gap-y-4">
      <div className="flex justify-between items-center">
        <Rate disabled defaultValue={reviewDetail.review.star} />
        <span className="text-sm text-muted-foreground">
          {reviewDetail.review.createdAt}
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
        <div className="mt-2 p-3 rounded-md bg-gray-50 border">
          <p className="text-sm font-semibold text-gray-700">Seller&apos;s reply:</p>
          <p className="text-sm text-gray-800">{reviewDetail.review.reply}</p>
        </div>
      )}
    </div>
  );
}
