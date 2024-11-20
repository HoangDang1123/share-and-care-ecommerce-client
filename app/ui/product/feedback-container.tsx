'use client'

import { Product } from '@/data/interface-test'
import React, { useEffect, useState } from 'react'
import FeedbackRating from './feedback/feedback-rating';
import FeedbackContent from './feedback/feedback-content';
import FeedbackFilter from './feedback/feedback-filter';
import data from "@/data/data.json";
import { useRouter } from 'next/navigation';

interface FeedbackContainerProps {
    product: Product,
}

const FeedbackContainer: React.FC<FeedbackContainerProps> = ({ product }) => {
    const [ratingFilter, setRatingFilter] = useState("all");
    const [isFixed, setIsFixed] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (ratingFilter === "all" && params.has('ratingFilter')) {
            params.delete('ratingFilter');
        } else if (ratingFilter !== "all") {
            params.set('ratingFilter', ratingFilter);
        }
        window.history.pushState(null, '', `?${params.toString()}`)
    })

    const orders = data.orders.filter(item => item.productId === product.id);
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

    const goToFeedbackPage = () => {
        router.push(`/product/${product.id}/feedback`);
    }

    let rating = 0
    if (product.rating !== undefined) {
        rating = product.rating
    }

    return (
        <div
            onClick={goToFeedbackPage}
            className='flex justify-between items-start bg-gray-200 rounded-md px-20 py-10 space-x-32 hover:cursor-pointer hover:shadow-lg'
        >
            <FeedbackRating feedbacks={feedbacks} rating={rating} isFixed={isFixed} setIsFixed={setIsFixed} />
            <div className='flex flex-col justify-center items-center w-full'>
                <FeedbackFilter setRatingFilter={setRatingFilter} />

                <div className='flex flex-col justify-center items-center w-full mt-10 space-y-10'>
                    {newFeedbacks.length === 0 ? (
                        <div>No feedback yet.</div>
                    ) : (
                        filteredFeedbacks.slice(0, 2).map((filteredFeedback, index) => (
                            <FeedbackContent key={index} feedback={filteredFeedback} />
                        ))
                    )}

                </div>
            </div>
        </div>
    )
}

export default FeedbackContainer;