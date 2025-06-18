'use client'

import React, { useEffect, useState } from 'react';
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
    <div className='bg-gray-100 rounded-md p-4 md:p-10 w-full'>
      {!reviews ? (
        <div className='flex justify-center items-center w-full text-lg'>
          Đang tải...
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={0} md={8}>
            <ReviewRating productId={productId} total={reviews.total} />
          </Col>

          <Col xs={24} md={16}>
            <div className='flex flex-col items-center w-full'>
              <ReviewFilter setRatingFilter={setRatingFilter} setHasImageFilter={setHasImageFilter} />

              <div className='flex flex-col justify-center items-center w-full mt-10 gap-y-8'>
                {reviews.total === 0 ? (
                  <div>Chưa có đánh giá nào.</div>
                ) : (
                  reviews.items.map((item) => (
                    <ReviewItem key={item.id} item={item} />
                  ))
                )}
              </div>

              <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-full'>
                <Pagination
                  currentPage={currentPage}
                  totalItems={reviews.total}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                />

                <div className='flex items-center gap-x-2'>
                  <select
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded-md p-1 text-base"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                  <span>sản phẩm mỗi trang</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ReviewContainer;
