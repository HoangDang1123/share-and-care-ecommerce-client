'use client'

import React, { useEffect, useState } from 'react'
import ReviewRating from './review/review-rating';
import ReviewItem from './review/review-item';
import ReviewFilter from './review/review-filter';
import { GetReviewResponse } from '@/interface/review';
import { getProductReview } from '@/app/api/review';
import { Col, Row } from 'antd';
import Pagination from '../pagination';

interface ReviewContainerProps {
  productId: string,
}

const ReviewContainer: React.FC<ReviewContainerProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<GetReviewResponse>();
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [hasImageFilter, setHasImageFilter] = useState<boolean | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getProductReview(productId, pageSize, currentPage, ratingFilter, hasImageFilter);
        setReviews(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchReviews();
  }, [currentPage, hasImageFilter, pageSize, productId, ratingFilter]);

  return (
    <Row
      className='flex justify-between bg-gray-100 rounded-md p-10'
    >
      {!reviews ? (
        <div className='flex justify-center items-center w-full text-lg'>
          Loading...
        </div>
      ) : (
        <div className='flex w-full'>
          <Col span={8} >
            <ReviewRating productId={productId} total={reviews.total} />
          </Col>

          <Col span={1} />

          <Col span={15} className='flex flex-col justify-between items-center w-full'>
            <div className='flex flex-col items-center'>
              <ReviewFilter setRatingFilter={setRatingFilter} setHasImageFilter={setHasImageFilter} />

              <div className='flex flex-col justify-center items-center w-full mt-10 gap-y-8'>
                {reviews.total === 0 ? (
                  <div>There&apos;s no reviews.</div>
                ) : (
                  reviews.items.map((item) => (
                    <ReviewItem key={item.id} item={item} />
                  ))
                )}
              </div>
            </div>

            <div className='flex justify-center items-center gap-x-4 mt-4'>
              <Pagination
                currentPage={currentPage}
                totalItems={reviews.total}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />

              <div className='flex justify-center items-center gap-x-2'>
                <select
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="border rounded-md p-1 text-base"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
                <span>items per page</span>
              </div>
            </div>
          </Col>
        </div>
      )}
    </Row>
  )
}

export default ReviewContainer;