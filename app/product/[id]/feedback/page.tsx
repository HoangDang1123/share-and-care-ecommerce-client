'use client'

import React, { useEffect, useState } from 'react';
// import data from "@/data/data.json";
import FeedbackContent from '@/app/ui/product/feedback/feedback-content';
import { useParams } from 'next/navigation';
import FeedbackFilter from '@/app/ui/product/feedback/feedback-filter';
import Link from 'next/link';
import FeedbackRating from '@/app/ui/product/feedback/feedback-rating';
import BackButton from '@/app/ui/back-button';
import Pagination from '@/app/ui/pagination';

export default function Page() {
    const [ratingFilter, setRatingFilter] = useState("all");
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        const newParams = new URLSearchParams(window.location.search);

        if (ratingFilter === "all" && newParams.has('ratingFilter')) {
            newParams.delete('ratingFilter');
        } else if (ratingFilter !== "all") {
            newParams.set('ratingFilter', ratingFilter);
        }
        window.history.pushState(null, '', `?${newParams.toString()}`);
    }, [ratingFilter]);

    const param = useParams();
    const id = param.id;

    const product = data.products.find(item => item.id === id);
    const orders = data.orders.filter(item => item.productId === id);
    const orderIds = orders.map(order => order.id);
    const feedbacks = data.feedbacks.filter(item => orderIds.includes(item.orderId));

    const newFeedbacks = feedbacks.map(feedback => {
        const order = orders.find(order => order.id === feedback.orderId);
        if (order) {
            return { ...feedback, ...order };
        }
        return null;
    }).filter(item => item !== null);

    const filteredFeedbacks = ratingFilter === "all"
        ? newFeedbacks
        : newFeedbacks.filter(feedback => feedback.rating === Number(ratingFilter));

    const paginatedFeedbacks = filteredFeedbacks.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    let rating = 0
    if (product?.rating !== undefined) {
        rating = product.rating
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className='px-24 py-10'>
            <div className='flex items-center space-x-24'>
                <BackButton />

                <ul className="flex space-x-1 text-xl">
                    <li>
                        <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
                    </li>
                    <li>
                        <Link href={`/shop/${product.category.toLowerCase()}`} className='text-gray-400 hover:text-gray-900'>{`${product.category} /`}</Link>
                    </li>
                    <li>
                        <Link href={`/product/${id}`} className='text-gray-400 hover:text-gray-900'>{`${product.name} /`}</Link>
                    </li>
                    <li>
                        Feedback
                    </li>
                </ul>
            </div>

            <div className='flex items-start space-x-20'>
                <FeedbackRating feedbacks={feedbacks} rating={rating} isFixed={isFixed} setIsFixed={setIsFixed} />
                <div className='flex flex-col justify-center items-center w-full mt-10'>
                    <FeedbackFilter setRatingFilter={setRatingFilter} />

                    <div className={`flex flex-col justify-center items-center w-fit my-10 space-y-10 ${isFixed ? 'ml-[380px]' :''}`}>
                        {newFeedbacks.length === 0 ? (
                            <div>No feedback yet.</div>
                        ) : (
                            paginatedFeedbacks.map((paginatedFeedback, index) => (
                                <FeedbackContent key={index} feedback={paginatedFeedback} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className='flex justify-center items-center w-full space-x-12 mt-10'>
                <label className="flex items-center space-x-2 text-lg text-gray-900">
                    <span>Show:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="border rounded-md p-1 text-gray-900 text-lg"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </label>

                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredFeedbacks.length}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}