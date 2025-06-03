'use client'

import React, { useEffect, useState } from 'react'
import { GetReviewResponse } from '@/interface/review';
import { Progress, Rate } from 'antd';
import { getProductReview } from '@/app/api/review';

interface ReviewRatingProps {
  productId: string,
  total: number,
}

const ReviewRating: React.FC<ReviewRatingProps> = ({ productId, total }) => {
  const [reviews, setReviews] = useState<GetReviewResponse>();
  
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await getProductReview(productId, total, undefined, undefined, undefined);
          setReviews(response);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
  
      fetchReviews();
    }, [productId, total]);

  const ratingList = Array.from({ length: 5 }, (_, index) => ({
    star: index + 1,
    count: 0,
  }));

  let totalStars = 0;

  if (!reviews) {
    return (
      <span>Loading...</span>
    )
  }

  reviews.items.forEach(review => {
    ratingList[review.star - 1].count += 1;
    totalStars += review.star;
  });

  ratingList.reverse();

  const averageRating = reviews.total > 0 ? totalStars / reviews.total : 0;

  return (
    <div className='flex justify-center items-center w-full bg-white rounded-2xl p-6 transition-all duration-300 ease-in-out'>
      <div className='flex flex-col justify-center items-center gap-y-10'>
        <div className='flex justify-center items-center gap-x-4'>
          <h6 className='text-5xl font-semibold'>{`${averageRating}`}</h6>
          <Rate
            disabled
            allowHalf
            defaultValue={averageRating}
            className='text-3xl'
          />
        </div>

        <div className="flex flex-col gap-y-3 w-full">
          {ratingList.map((item, index) => (
            <div key={index} className="flex items-center w-full gap-x-4">
              <Rate
                disabled
                defaultValue={item.star}
                className="text-lg w-72"
              />
              <Progress 
                percent={item.count / reviews.total * 100} 
                showInfo={false}
                strokeColor='#fadb14'
              />
              <span className="text-lg text-gray-700">{`(${item.count})`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReviewRating;